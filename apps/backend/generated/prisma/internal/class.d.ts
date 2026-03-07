import * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "./prismaNamespace.js";
export type LogOptions<ClientOptions extends Prisma.PrismaClientOptions> = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never;
export interface PrismaClientConstructor {
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
    new <Options extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions, LogOpts extends LogOptions<Options> = LogOptions<Options>, OmitOpts extends Prisma.PrismaClientOptions['omit'] = Options extends {
        omit: infer U;
    } ? U : Prisma.PrismaClientOptions['omit'], ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs>(options: Prisma.Subset<Options, Prisma.PrismaClientOptions>): PrismaClient<LogOpts, OmitOpts, ExtArgs>;
}
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
export interface PrismaClient<in LogOpts extends Prisma.LogLevel = never, in out OmitOpts extends Prisma.PrismaClientOptions['omit'] = undefined, in out ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['other'];
    };
    $on<V extends LogOpts>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;
    /**
     * Connect with the database
     */
    $connect(): runtime.Types.Utils.JsPromise<void>;
    /**
     * Disconnect from the database
     */
    $disconnect(): runtime.Types.Utils.JsPromise<void>;
    /**
       * Executes a prepared raw query and returns the number of affected rows.
       * @example
       * ```
       * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
       * ```
       *
       * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
       */
    $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;
    /**
     * Executes a raw query and returns the number of affected rows.
     * Susceptible to SQL injections, see documentation.
     * @example
     * ```
     * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
     * ```
     *
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
     */
    $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;
    /**
     * Performs a prepared raw query and returns the `SELECT` data.
     * @example
     * ```
     * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
     * ```
     *
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
     */
    $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;
    /**
     * Performs a raw query and returns the `SELECT` data.
     * Susceptible to SQL injections, see documentation.
     * @example
     * ```
     * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
     * ```
     *
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
     */
    $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;
    /**
     * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
     * @example
     * ```
     * const [george, bob, alice] = await prisma.$transaction([
     *   prisma.user.create({ data: { name: 'George' } }),
     *   prisma.user.create({ data: { name: 'Bob' } }),
     *   prisma.user.create({ data: { name: 'Alice' } }),
     * ])
     * ```
     *
     * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
     */
    $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: {
        isolationLevel?: Prisma.TransactionIsolationLevel;
    }): runtime.Types.Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>;
    $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => runtime.Types.Utils.JsPromise<R>, options?: {
        maxWait?: number;
        timeout?: number;
        isolationLevel?: Prisma.TransactionIsolationLevel;
    }): runtime.Types.Utils.JsPromise<R>;
    $extends: runtime.Types.Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<OmitOpts>, ExtArgs, runtime.Types.Utils.Call<Prisma.TypeMapCb<OmitOpts>, {
        extArgs: ExtArgs;
    }>>;
    /**
 * `prisma.mdParentCompany`: Exposes CRUD operations for the **MdParentCompany** model.
  * Example usage:
  * ```ts
  * // Fetch zero or more MdParentCompanies
  * const mdParentCompanies = await prisma.mdParentCompany.findMany()
  * ```
  */
    get mdParentCompany(): Prisma.MdParentCompanyDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.mdUbigeo`: Exposes CRUD operations for the **MdUbigeo** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more MdUbigeos
      * const mdUbigeos = await prisma.mdUbigeo.findMany()
      * ```
      */
    get mdUbigeo(): Prisma.MdUbigeoDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.mdBrand`: Exposes CRUD operations for the **MdBrand** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more MdBrands
      * const mdBrands = await prisma.mdBrand.findMany()
      * ```
      */
    get mdBrand(): Prisma.MdBrandDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.mdOrdenPedido`: Exposes CRUD operations for the **MdOrdenPedido** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more MdOrdenPedidos
      * const mdOrdenPedidos = await prisma.mdOrdenPedido.findMany()
      * ```
      */
    get mdOrdenPedido(): Prisma.MdOrdenPedidoDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.mdFacility`: Exposes CRUD operations for the **MdFacility** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more MdFacilities
      * const mdFacilities = await prisma.mdFacility.findMany()
      * ```
      */
    get mdFacility(): Prisma.MdFacilityDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.mdMaquila`: Exposes CRUD operations for the **MdMaquila** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more MdMaquilas
      * const mdMaquilas = await prisma.mdMaquila.findMany()
      * ```
      */
    get mdMaquila(): Prisma.MdMaquilaDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.mdFacilityMaquila`: Exposes CRUD operations for the **MdFacilityMaquila** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more MdFacilityMaquilas
      * const mdFacilityMaquilas = await prisma.mdFacilityMaquila.findMany()
      * ```
      */
    get mdFacilityMaquila(): Prisma.MdFacilityMaquilaDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.mdParentCompanyMaquila`: Exposes CRUD operations for the **MdParentCompanyMaquila** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more MdParentCompanyMaquilas
      * const mdParentCompanyMaquilas = await prisma.mdParentCompanyMaquila.findMany()
      * ```
      */
    get mdParentCompanyMaquila(): Prisma.MdParentCompanyMaquilaDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.mdSubbrand`: Exposes CRUD operations for the **MdSubbrand** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more MdSubbrands
      * const mdSubbrands = await prisma.mdSubbrand.findMany()
      * ```
      */
    get mdSubbrand(): Prisma.MdSubbrandDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.mdUserReo`: Exposes CRUD operations for the **MdUserReo** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more MdUserReos
      * const mdUserReos = await prisma.mdUserReo.findMany()
      * ```
      */
    get mdUserReo(): Prisma.MdUserReoDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.lgUserAccess`: Exposes CRUD operations for the **LgUserAccess** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more LgUserAccesses
      * const lgUserAccesses = await prisma.lgUserAccess.findMany()
      * ```
      */
    get lgUserAccess(): Prisma.LgUserAccessDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.lgParentCompany`: Exposes CRUD operations for the **LgParentCompany** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more LgParentCompanies
      * const lgParentCompanies = await prisma.lgParentCompany.findMany()
      * ```
      */
    get lgParentCompany(): Prisma.LgParentCompanyDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
}
export declare function getPrismaClientClass(): PrismaClientConstructor;
