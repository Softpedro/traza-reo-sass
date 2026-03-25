/**
 * Prisma 7 CLI carga @prisma/dev; con Node por debajo del mínimo oficial
 * aparece ERR_REQUIRE_ESM al hacer require() de zeptomatch (solo ESM).
 * Requisitos: https://www.prisma.io/docs/orm/reference/system-requirements
 */
const v = process.version;
const m = /^v(\d+)\.(\d+)\.(\d+)/.exec(v);
if (!m) process.exit(0);
const major = Number(m[1]);
const minor = Number(m[2]);
const ok =
  (major === 20 && minor >= 19) ||
  (major === 22 && minor >= 12) ||
  major >= 24;

if (!ok) {
  console.error(`
Prisma 7 no es compatible con esta versión de Node (${v}).

Requisito: Node ^20.19 || ^22.12 || >=24
Ejemplo con nvm:  nvm install 22.14  &&  nvm use 22.14

Referencia: https://github.com/prisma/prisma/issues/28784
`);
  process.exit(1);
}
