#!/usr/bin/env bash
# Vacía OD_ORDER_LABEL_HEAD y OD_ORDER_LABEL_DETAIL con backup previo.
#
# Uso:
#   DATABASE_URL="mysql://user:pass@host:port/db" ./scripts/wipe-labels.sh
#
# Pide confirmación interactiva antes de borrar.

set -euo pipefail

if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "ERROR: define DATABASE_URL antes de correr el script." >&2
  exit 1
fi

# Parsear mysql://user:pass@host:port/db
proto_stripped="${DATABASE_URL#mysql://}"
creds="${proto_stripped%%@*}"
hostpart="${proto_stripped#*@}"
DB_USER="${creds%%:*}"
DB_PASS="${creds#*:}"
hostport="${hostpart%%/*}"
DB_NAME="${hostpart#*/}"
DB_NAME="${DB_NAME%%\?*}"
DB_HOST="${hostport%%:*}"
DB_PORT="${hostport#*:}"
[[ "$DB_PORT" == "$DB_HOST" ]] && DB_PORT=3306

TS="$(date +%Y%m%d_%H%M%S)"
BACKUP_FILE="backup_labels_${TS}.sql"

echo "Host:   $DB_HOST:$DB_PORT"
echo "DB:     $DB_NAME"
echo "User:   $DB_USER"
echo "Backup: $BACKUP_FILE"
echo
read -rp "¿Confirmar backup + DELETE de OD_ORDER_LABEL_HEAD/DETAIL? (yes/no) " ans
[[ "$ans" == "yes" ]] || { echo "Abortado."; exit 0; }

echo "→ Tomando backup..."
mysqldump -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASS" \
  --no-tablespaces --skip-lock-tables --set-gtid-purged=OFF --column-statistics=0 \
  "$DB_NAME" OD_ORDER_LABEL_HEAD OD_ORDER_LABEL_DETAIL > "$BACKUP_FILE"
echo "✓ Backup en $BACKUP_FILE ($(du -h "$BACKUP_FILE" | cut -f1))"

echo "→ Conteo previo:"
mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" -e "
  SELECT 'HEAD' AS tabla, COUNT(*) AS filas FROM OD_ORDER_LABEL_HEAD
  UNION ALL
  SELECT 'DETAIL', COUNT(*) FROM OD_ORDER_LABEL_DETAIL;"

echo "→ Borrando (DETAIL primero por FK)..."
mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" -e "
  DELETE FROM OD_ORDER_LABEL_DETAIL;
  DELETE FROM OD_ORDER_LABEL_HEAD;"

echo "→ Conteo final:"
mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" -e "
  SELECT 'HEAD' AS tabla, COUNT(*) AS filas FROM OD_ORDER_LABEL_HEAD
  UNION ALL
  SELECT 'DETAIL', COUNT(*) FROM OD_ORDER_LABEL_DETAIL;"

echo "✓ Listo. Si algo salió mal, restaurar con:"
echo "  mysql -h $DB_HOST -P $DB_PORT -u $DB_USER -p<pass> $DB_NAME < $BACKUP_FILE"
