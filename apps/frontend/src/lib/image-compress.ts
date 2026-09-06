/**
 * La implementación vive en `@fullstack-reo/ui` para que `ImageUpload` pueda comprimir
 * por defecto: el 413 del alta de modelos nació de que cada modal reimplementaba la
 * subida a mano, así que la política de compresión tiene que estar donde está el
 * componente, no en cada pantalla.
 *
 * Este re-export mantiene funcionando los modales que todavía llaman a la función
 * directamente (logos, pictograma de cuidado, foto de usuario, foto de estilo).
 */
export { compressImage, compressPhoto, compressLogo } from "@fullstack-reo/ui";
export type { CompressImageOptions, CompressedImage } from "@fullstack-reo/ui";
