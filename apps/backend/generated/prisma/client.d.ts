import * as runtime from "@prisma/client/runtime/client";
import * as $Class from "./internal/class.js";
import * as Prisma from "./internal/prismaNamespace.js";
export * as $Enums from './enums.js';
export * from "./enums.js";
/**
 * ## Prisma Client
 *
 * Type-safe database client for TypeScript
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more MdParentCompanies
 * const mdParentCompanies = await prisma.mdParentCompany.findMany()
 * ```
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export declare const PrismaClient: $Class.PrismaClientConstructor;
export type PrismaClient<LogOpts extends Prisma.LogLevel = never, OmitOpts extends Prisma.PrismaClientOptions["omit"] = Prisma.PrismaClientOptions["omit"], ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = $Class.PrismaClient<LogOpts, OmitOpts, ExtArgs>;
export { Prisma };
/**
 * Model MdParentCompany
 *
 */
export type MdParentCompany = Prisma.MdParentCompanyModel;
/**
 * Model MdUbigeo
 *
 */
export type MdUbigeo = Prisma.MdUbigeoModel;
/**
 * Model MdBrand
 *
 */
export type MdBrand = Prisma.MdBrandModel;
/**
 * Model MdOrdenPedido
 *
 */
export type MdOrdenPedido = Prisma.MdOrdenPedidoModel;
/**
 * Model MdFacility
 *
 */
export type MdFacility = Prisma.MdFacilityModel;
/**
 * Model MdMaquila
 *
 */
export type MdMaquila = Prisma.MdMaquilaModel;
/**
 * Model MdFacilityMaquila
 *
 */
export type MdFacilityMaquila = Prisma.MdFacilityMaquilaModel;
/**
 * Model MdParentCompanyMaquila
 *
 */
export type MdParentCompanyMaquila = Prisma.MdParentCompanyMaquilaModel;
/**
 * Model MdSubbrand
 *
 */
export type MdSubbrand = Prisma.MdSubbrandModel;
/**
 * Model MdUserReo
 *
 */
export type MdUserReo = Prisma.MdUserReoModel;
/**
 * Model LgUserAccess
 *
 */
export type LgUserAccess = Prisma.LgUserAccessModel;
/**
 * Model LgParentCompany
 *
 */
export type LgParentCompany = Prisma.LgParentCompanyModel;
