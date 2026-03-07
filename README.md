# FullStack Reo – Monorepo

Monorepo con **frontend** (Next.js, React, TypeScript, Tailwind CSS) y **backend** (Node.js, Express, Prisma).

## Estructura

```
fullStack_reo/
├── apps/
│   ├── frontend/     # Next.js + React + TypeScript + Tailwind
│   └── backend/      # Node + Express + Prisma
├── package.json      # Workspaces (npm)
└── README.md
```

## Requisitos

- Node.js 18+
- PostgreSQL (para el backend con Prisma)

## Instalación

```bash
npm install
```

## Base de datos (backend)

1. Crea una base PostgreSQL y copia el ejemplo de env:

```bash
cp apps/backend/.env.example apps/backend/.env
```

2. Edita `apps/backend/.env` y pon tu `DATABASE_URL`.

3. Genera el cliente Prisma y aplica el schema:

```bash
npm run db:generate
npm run db:push
```

(O desde la raíz: `npm run db:generate` y `npm run db:push`.)

Opcional: Prisma Studio para ver/editar datos:

```bash
npm run db:studio
```

## Desarrollo

En la raíz puedes levantar todo:

```bash
npm run dev
```

O por app:

- **Frontend** (http://localhost:3000): `npm run dev:frontend`
- **Backend** (http://localhost:4000): `npm run dev:backend`

## Scripts útiles (raíz)

| Script         | Descripción                    |
|----------------|--------------------------------|
| `npm run dev`  | Dev de frontend y backend      |
| `npm run build`| Build de ambos                 |
| `db:generate`  | Genera cliente Prisma          |
| `db:push`      | Aplica schema a la DB          |
| `db:studio`    | Abre Prisma Studio             |

## Endpoints de ejemplo (backend)

- `GET /health` – Health check
- `GET /api/users` – Lista usuarios (requiere DB y modelo `User`)

El schema de Prisma está en `apps/backend/prisma/schema.prisma`; puedes modificarlo y volver a ejecutar `db:generate` y `db:push` o `db:migrate`.
