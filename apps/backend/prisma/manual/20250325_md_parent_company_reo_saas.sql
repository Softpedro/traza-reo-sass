-- Añade columnas REO SaaS a la empresa matriz. Ejecutar una vez en MariaDB/MySQL.
-- Luego: cd apps/backend && npx prisma generate
--
-- Si ya tienes TYPE_PARENT_COMPANY y solo falta ID_DLK_ADM_REO, este ALTER falla entero.
-- Usa en su lugar: 20250327_md_parent_company_columns_idempotent.sql

ALTER TABLE MD_PARENT_COMPANY
  ADD COLUMN ID_DLK_ADM_REO VARCHAR(10) NULL COMMENT 'Código REO Saas',
  ADD COLUMN TYPE_PARENT_COMPANY TINYINT(1) NOT NULL DEFAULT 1 COMMENT 'Tipo de REO: 1=Marca Propia, 2=Maquila, 3=Hibrido, 4=Comercializadora';
