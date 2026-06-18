# TEMPORAL · Ofuscación de marcas/empresas en el listado de Marca

**Fecha:** 2026-06-17
**Estado:** Activo (momentáneo, pedido de negocio para producción)

## Qué hace

En `Configuración > REO > Marca`, las columnas **Marca** y **Empresa** se muestran
como `********` para toda marca cuya **empresa NO empiece con `REO-1`**
(es decir, se ocultan REO-2, REO-3, REO-4, …; solo se ven las de REO-1).

Las demás columnas (Código, Estado, Acción) no se tocan. Es solo visual en el
listado: los datos siguen completos en la base de datos y en los modales de
Editar/Ver.

## Dónde está el código

Archivo: `apps/frontend/src/app/configuracion/reo/marca/columns.tsx`

- Bloque comentado `TEMPORAL` + constante `MASK` + función `isBrandMasked(brand)`.
- Uso en la celda de la columna **Marca** (`nameBrand`).
- Uso en la celda de la columna **Empresa**.

## Cómo revertir

1. Eliminar la constante `MASK` y la función `isBrandMasked` (bloque `TEMPORAL`).
2. En la celda **Marca**, volver a:
   ```tsx
   cell: ({ row }) => (
     <span className="text-primary font-medium">
       {row.getValue("nameBrand")}
     </span>
   ),
   ```
3. En la celda **Empresa**, quitar el early-return de `isBrandMasked` y dejar:
   ```tsx
   cell: ({ row }) => {
     const pc = row.original.parentCompany;
     return pc
       ? `${pc.codParentCompany ?? ""} - ${pc.nameParentCompany}`
       : "Sin empresa";
   },
   ```
4. Borrar este archivo.

## Nota

El criterio usa `codParentCompany.startsWith("REO-1")`. Si en el futuro existe
`REO-10`, `REO-11`, etc., también quedarían visibles (coinciden con el prefijo).
Si se necesita exactitud, cambiar a `=== "REO-1"`.
