#!/usr/bin/env bash
# Copia la base de producción a la base local de desarrollo.
#
# Uso:
#   PROD_DATABASE_URL="mysql://user:pass@host:port/db" ./scripts/sync-prod-to-local.sh
#
# Opcional (por defecto apunta al contenedor mariadb de docker-compose):
#   LOCAL_DATABASE_URL="mysql://root:root@127.0.0.1:3306/reo_dev"
#
# Hace backup de la base local ANTES de sobrescribirla. Pide confirmación.

set -euo pipefail

if [[ -z "${PROD_DATABASE_URL:-}" ]]; then
  echo "ERROR: define PROD_DATABASE_URL antes de correr el script." >&2
  exit 1
fi
LOCAL_DATABASE_URL="${LOCAL_DATABASE_URL:-mysql://root:root@127.0.0.1:3306/reo_dev}"

# Parsea mysql://user:pass@host:port/db en las variables <prefijo>_{USER,PASS,HOST,PORT,NAME}
parse_url() {
  local url="${1#mysql://}" prefix="$2"
  local creds="${url%%@*}" hostpart="${url#*@}"
  printf -v "${prefix}_USER" '%s' "${creds%%:*}"
  printf -v "${prefix}_PASS" '%s' "${creds#*:}"
  local hostport="${hostpart%%/*}"
  printf -v "${prefix}_HOST" '%s' "${hostport%%:*}"
  printf -v "${prefix}_PORT" '%s' "${hostport#*:}"
  local name="${hostpart#*/}"
  printf -v "${prefix}_NAME" '%s' "${name%%\?*}"
}
parse_url "$PROD_DATABASE_URL" PROD
parse_url "$LOCAL_DATABASE_URL" LOCAL

TS="$(date +%Y%m%d_%H%M%S)"
mkdir -p backups
PROD_DUMP="backups/backup_prod_full_${TS}.sql"
LOCAL_DUMP="backups/backup_local_pre_sync_${TS}.sql"

echo "  origen : ${PROD_USER}@${PROD_HOST}:${PROD_PORT}/${PROD_NAME}"
echo "  destino: ${LOCAL_USER}@${LOCAL_HOST}:${LOCAL_PORT}/${LOCAL_NAME}  (SE SOBRESCRIBE)"
echo
read -r -p "Escribe 'si' para continuar: " ok
[[ "$ok" == "si" ]] || { echo "Cancelado."; exit 1; }

# ── 1. Backup de lo que hay en local, por si acaso ───────────────────
echo "[1/4] Backup de la base local -> ${LOCAL_DUMP}"
mysqldump -h "$LOCAL_HOST" -P "$LOCAL_PORT" -u "$LOCAL_USER" -p"$LOCAL_PASS" \
  --single-transaction --no-tablespaces --hex-blob --routines --triggers \
  --default-character-set=utf8mb4 \
  "$LOCAL_NAME" > "$LOCAL_DUMP" 2>/dev/null \
  || echo "      (la base local estaba vacía o no existía; sin backup previo)"

# ── 2. Dump de producción ────────────────────────────────────────────
# --single-transaction: consistente sin bloquear tablas (la base es compartida).
# --no-tablespaces y --column-statistics=0: el usuario gestionado no tiene PROCESS.
# --hex-blob: los logos y fotos son binarios; sin esto se corrompen al reimportar.
echo "[2/4] Dump de producción -> ${PROD_DUMP}"
mysqldump -h "$PROD_HOST" -P "$PROD_PORT" -u "$PROD_USER" -p"$PROD_PASS" \
  --single-transaction --no-tablespaces --set-gtid-purged=OFF \
  --column-statistics=0 --hex-blob --routines --triggers \
  --default-character-set=utf8mb4 \
  "$PROD_NAME" > "$PROD_DUMP"
echo "      $(du -h "$PROD_DUMP" | cut -f1)"

# ── 3. Compatibilidad MySQL 8 -> MariaDB ─────────────────────────────
# Prod es MySQL 8.4 y su colación por defecto (utf8mb4_0900_ai_ci) no existe en
# MariaDB: sin esto el import falla con "Unknown collation".
if grep -q "utf8mb4_0900" "$PROD_DUMP"; then
  echo "[3/4] Traduciendo colaciones utf8mb4_0900_* a equivalentes de MariaDB"
  sed -i -e 's/utf8mb4_0900_ai_ci/utf8mb4_general_ci/g' \
         -e 's/utf8mb4_0900_as_cs/utf8mb4_bin/g' \
         -e 's/utf8mb4_0900_bin/utf8mb4_bin/g' "$PROD_DUMP"
else
  echo "[3/4] Sin colaciones utf8mb4_0900_*, nada que traducir"
fi

# ── 4. Import ────────────────────────────────────────────────────────
echo "[4/4] Importando en ${LOCAL_NAME}"
mysql -h "$LOCAL_HOST" -P "$LOCAL_PORT" -u "$LOCAL_USER" -p"$LOCAL_PASS" \
  -e "DROP DATABASE IF EXISTS \`${LOCAL_NAME}\`;
      CREATE DATABASE \`${LOCAL_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;"
mysql -h "$LOCAL_HOST" -P "$LOCAL_PORT" -u "$LOCAL_USER" -p"$LOCAL_PASS" \
  --default-character-set=utf8mb4 "$LOCAL_NAME" < "$PROD_DUMP"

echo
echo "Listo. Resumen:"
mysql -h "$LOCAL_HOST" -P "$LOCAL_PORT" -u "$LOCAL_USER" -p"$LOCAL_PASS" -N -B -e "
  SELECT CONCAT('  tablas: ', COUNT(*)) FROM information_schema.TABLES
    WHERE TABLE_SCHEMA='${LOCAL_NAME}';
  SELECT CONCAT('  modelos: ', COUNT(*)) FROM \`${LOCAL_NAME}\`.MD_MODEL;
  SELECT CONCAT('  migraciones aplicadas: ', COUNT(*)) FROM \`${LOCAL_NAME}\`.\`_prisma_migrations\`
    WHERE finished_at IS NOT NULL;"
echo
echo "Backup de tu base local anterior: ${LOCAL_DUMP}"
