import * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../models.js";
import { type PrismaClient } from "./class.js";
export type * from '../models.js';
export type DMMF = typeof runtime.DMMF;
export type PrismaPromise<T> = runtime.Types.Public.PrismaPromise<T>;
/**
 * Prisma Errors
 */
export declare const PrismaClientKnownRequestError: typeof runtime.PrismaClientKnownRequestError;
export type PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError;
export declare const PrismaClientUnknownRequestError: typeof runtime.PrismaClientUnknownRequestError;
export type PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError;
export declare const PrismaClientRustPanicError: typeof runtime.PrismaClientRustPanicError;
export type PrismaClientRustPanicError = runtime.PrismaClientRustPanicError;
export declare const PrismaClientInitializationError: typeof runtime.PrismaClientInitializationError;
export type PrismaClientInitializationError = runtime.PrismaClientInitializationError;
export declare const PrismaClientValidationError: typeof runtime.PrismaClientValidationError;
export type PrismaClientValidationError = runtime.PrismaClientValidationError;
/**
 * Re-export of sql-template-tag
 */
export declare const sql: typeof runtime.sqltag;
export declare const empty: runtime.Sql;
export declare const join: typeof runtime.join;
export declare const raw: typeof runtime.raw;
export declare const Sql: typeof runtime.Sql;
export type Sql = runtime.Sql;
/**
 * Decimal.js
 */
export declare const Decimal: typeof runtime.Decimal;
export type Decimal = runtime.Decimal;
export type DecimalJsLike = runtime.DecimalJsLike;
/**
* Extensions
*/
export type Extension = runtime.Types.Extensions.UserArgs;
export declare const getExtensionContext: typeof runtime.Extensions.getExtensionContext;
export type Args<T, F extends runtime.Operation> = runtime.Types.Public.Args<T, F>;
export type Payload<T, F extends runtime.Operation = never> = runtime.Types.Public.Payload<T, F>;
export type Result<T, A, F extends runtime.Operation> = runtime.Types.Public.Result<T, A, F>;
export type Exact<A, W> = runtime.Types.Public.Exact<A, W>;
export type PrismaVersion = {
    client: string;
    engine: string;
};
/**
 * Prisma Client JS version: 7.0.0
 * Query Engine version: 0c19ccc313cf9911a90d99d2ac2eb0280c76c513
 */
export declare const prismaVersion: PrismaVersion;
/**
 * Utility Types
 */
export type Bytes = runtime.Bytes;
export type JsonObject = runtime.JsonObject;
export type JsonArray = runtime.JsonArray;
export type JsonValue = runtime.JsonValue;
export type InputJsonObject = runtime.InputJsonObject;
export type InputJsonArray = runtime.InputJsonArray;
export type InputJsonValue = runtime.InputJsonValue;
export declare const NullTypes: {
    DbNull: (new (secret: never) => typeof runtime.DbNull);
    JsonNull: (new (secret: never) => typeof runtime.JsonNull);
    AnyNull: (new (secret: never) => typeof runtime.AnyNull);
};
/**
 * Helper for filtering JSON entries that have `null` on the database (empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const DbNull: import("@prisma/client-runtime-utils").DbNullClass;
/**
 * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
/**
 * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const AnyNull: import("@prisma/client-runtime-utils").AnyNullClass;
type SelectAndInclude = {
    select: any;
    include: any;
};
type SelectAndOmit = {
    select: any;
    omit: any;
};
/**
 * From T, pick a set of properties whose keys are in the union K
 */
type Prisma__Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};
export type Enumerable<T> = T | Array<T>;
/**
 * Subset
 * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
 */
export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
};
/**
 * SelectSubset
 * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
 * Additionally, it validates, if both select and include are present. If the case, it errors.
 */
export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
} & (T extends SelectAndInclude ? 'Please either choose `select` or `include`.' : T extends SelectAndOmit ? 'Please either choose `select` or `omit`.' : {});
/**
 * Subset + Intersection
 * @desc From `T` pick properties that exist in `U` and intersect `K`
 */
export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
} & K;
type Without<T, U> = {
    [P in Exclude<keyof T, keyof U>]?: never;
};
/**
 * XOR is needed to have a real mutually exclusive union type
 * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
 */
export type XOR<T, U> = T extends object ? U extends object ? (Without<T, U> & U) | (Without<U, T> & T) : U : T;
/**
 * Is T a Record?
 */
type IsObject<T extends any> = T extends Array<any> ? False : T extends Date ? False : T extends Uint8Array ? False : T extends BigInt ? False : T extends object ? True : False;
/**
 * If it's T[], return T
 */
export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T;
/**
 * From ts-toolbelt
 */
type __Either<O extends object, K extends Key> = Omit<O, K> & {
    [P in K]: Prisma__Pick<O, P & keyof O>;
}[K];
type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>;
type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>;
type _Either<O extends object, K extends Key, strict extends Boolean> = {
    1: EitherStrict<O, K>;
    0: EitherLoose<O, K>;
}[strict];
export type Either<O extends object, K extends Key, strict extends Boolean = 1> = O extends unknown ? _Either<O, K, strict> : never;
export type Union = any;
export type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K];
} & {};
/** Helper Types for "Merge" **/
export type IntersectOf<U extends Union> = (U extends unknown ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
export type Overwrite<O extends object, O1 extends object> = {
    [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
} & {};
type _Merge<U extends object> = IntersectOf<Overwrite<U, {
    [K in keyof U]-?: At<U, K>;
}>>;
type Key = string | number | symbol;
type AtStrict<O extends object, K extends Key> = O[K & keyof O];
type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
    1: AtStrict<O, K>;
    0: AtLoose<O, K>;
}[strict];
export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
} & {};
export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
} & {};
type _Record<K extends keyof any, T> = {
    [P in K]: T;
};
type NoExpand<T> = T extends unknown ? T : never;
export type AtLeast<O extends object, K extends string> = NoExpand<O extends unknown ? (K extends keyof O ? {
    [P in K]: O[P];
} & O : O) | {
    [P in keyof O as P extends K ? P : never]-?: O[P];
} & O : never>;
type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;
export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
/** End Helper Types for "Merge" **/
export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;
export type Boolean = True | False;
export type True = 1;
export type False = 0;
export type Not<B extends Boolean> = {
    0: 1;
    1: 0;
}[B];
export type Extends<A1 extends any, A2 extends any> = [A1] extends [never] ? 0 : A1 extends A2 ? 1 : 0;
export type Has<U extends Union, U1 extends Union> = Not<Extends<Exclude<U1, U>, U1>>;
export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
        0: 0;
        1: 1;
    };
    1: {
        0: 1;
        1: 1;
    };
}[B1][B2];
export type Keys<U extends Union> = U extends unknown ? keyof U : never;
export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O ? O[P] : never;
} : never;
type FieldPaths<T, U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>> = IsObject<T> extends True ? U : T;
export type GetHavingFields<T> = {
    [K in keyof T]: Or<Or<Extends<'OR', K>, Extends<'AND', K>>, Extends<'NOT', K>> extends True ? T[K] extends infer TK ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never> : never : {} extends FieldPaths<T[K]> ? never : K;
}[keyof T];
/**
 * Convert tuple to union
 */
type _TupleToUnion<T> = T extends (infer E)[] ? E : never;
type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>;
export type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T;
/**
 * Like `Pick`, but additionally can also accept an array of keys
 */
export type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>;
/**
 * Exclude all keys with underscores
 */
export type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T;
export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>;
type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>;
export declare const ModelName: {
    readonly MdParentCompany: "MdParentCompany";
    readonly MdUbigeo: "MdUbigeo";
    readonly MdBrand: "MdBrand";
    readonly MdOrdenPedido: "MdOrdenPedido";
    readonly MdFacility: "MdFacility";
    readonly MdMaquila: "MdMaquila";
    readonly MdFacilityMaquila: "MdFacilityMaquila";
    readonly MdParentCompanyMaquila: "MdParentCompanyMaquila";
    readonly MdSubbrand: "MdSubbrand";
    readonly MdUserReo: "MdUserReo";
    readonly LgUserAccess: "LgUserAccess";
    readonly LgParentCompany: "LgParentCompany";
};
export type ModelName = (typeof ModelName)[keyof typeof ModelName];
export interface TypeMapCb<GlobalOmitOptions = {}> extends runtime.Types.Utils.Fn<{
    extArgs: runtime.Types.Extensions.InternalArgs;
}, runtime.Types.Utils.Record<string, any>> {
    returns: TypeMap<this['params']['extArgs'], GlobalOmitOptions>;
}
export type TypeMap<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
        omit: GlobalOmitOptions;
    };
    meta: {
        modelProps: "mdParentCompany" | "mdUbigeo" | "mdBrand" | "mdOrdenPedido" | "mdFacility" | "mdMaquila" | "mdFacilityMaquila" | "mdParentCompanyMaquila" | "mdSubbrand" | "mdUserReo" | "lgUserAccess" | "lgParentCompany";
        txIsolationLevel: TransactionIsolationLevel;
    };
    model: {
        MdParentCompany: {
            payload: Prisma.$MdParentCompanyPayload<ExtArgs>;
            fields: Prisma.MdParentCompanyFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.MdParentCompanyFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MdParentCompanyPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.MdParentCompanyFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MdParentCompanyPayload>;
                };
                findFirst: {
                    args: Prisma.MdParentCompanyFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MdParentCompanyPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.MdParentCompanyFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MdParentCompanyPayload>;
                };
                findMany: {
                    args: Prisma.MdParentCompanyFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MdParentCompanyPayload>[];
                };
                create: {
                    args: Prisma.MdParentCompanyCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MdParentCompanyPayload>;
                };
                createMany: {
                    args: Prisma.MdParentCompanyCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.MdParentCompanyDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MdParentCompanyPayload>;
                };
                update: {
                    args: Prisma.MdParentCompanyUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MdParentCompanyPayload>;
                };
                deleteMany: {
                    args: Prisma.MdParentCompanyDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.MdParentCompanyUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.MdParentCompanyUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MdParentCompanyPayload>;
                };
                aggregate: {
                    args: Prisma.MdParentCompanyAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateMdParentCompany>;
                };
                groupBy: {
                    args: Prisma.MdParentCompanyGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.MdParentCompanyGroupByOutputType>[];
                };
                count: {
                    args: Prisma.MdParentCompanyCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.MdParentCompanyCountAggregateOutputType> | number;
                };
            };
        };
        MdUbigeo: {
            payload: Prisma.$MdUbigeoPayload<ExtArgs>;
            fields: Prisma.MdUbigeoFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.MdUbigeoFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MdUbigeoPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.MdUbigeoFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MdUbigeoPayload>;
                };
                findFirst: {
                    args: Prisma.MdUbigeoFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MdUbigeoPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.MdUbigeoFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MdUbigeoPayload>;
                };
                findMany: {
                    args: Prisma.MdUbigeoFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MdUbigeoPayload>[];
                };
                create: {
                    args: Prisma.MdUbigeoCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MdUbigeoPayload>;
                };
                createMany: {
                    args: Prisma.MdUbigeoCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.MdUbigeoDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MdUbigeoPayload>;
                };
                update: {
                    args: Prisma.MdUbigeoUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MdUbigeoPayload>;
                };
                deleteMany: {
                    args: Prisma.MdUbigeoDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.MdUbigeoUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.MdUbigeoUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MdUbigeoPayload>;
                };
                aggregate: {
                    args: Prisma.MdUbigeoAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateMdUbigeo>;
                };
                groupBy: {
                    args: Prisma.MdUbigeoGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.MdUbigeoGroupByOutputType>[];
                };
                count: {
                    args: Prisma.MdUbigeoCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.MdUbigeoCountAggregateOutputType> | number;
                };
            };
        };
        MdBrand: {
            payload: Prisma.$MdBrandPayload<ExtArgs>;
            fields: Prisma.MdBrandFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.MdBrandFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MdBrandPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.MdBrandFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MdBrandPayload>;
                };
                findFirst: {
                    args: Prisma.MdBrandFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MdBrandPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.MdBrandFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MdBrandPayload>;
                };
                findMany: {
                    args: Prisma.MdBrandFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MdBrandPayload>[];
                };
                create: {
                    args: Prisma.MdBrandCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MdBrandPayload>;
                };
                createMany: {
                    args: Prisma.MdBrandCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.MdBrandDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MdBrandPayload>;
                };
                update: {
                    args: Prisma.MdBrandUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MdBrandPayload>;
                };
                deleteMany: {
                    args: Prisma.MdBrandDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.MdBrandUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.MdBrandUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MdBrandPayload>;
                };
                aggregate: {
                    args: Prisma.MdBrandAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateMdBrand>;
                };
                groupBy: {
                    args: Prisma.MdBrandGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.MdBrandGroupByOutputType>[];
                };
                count: {
                    args: Prisma.MdBrandCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.MdBrandCountAggregateOutputType> | number;
                };
            };
        };
        MdOrdenPedido: {
            payload: Prisma.$MdOrdenPedidoPayload<ExtArgs>;
            fields: Prisma.MdOrdenPedidoFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.MdOrdenPedidoFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MdOrdenPedidoPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.MdOrdenPedidoFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MdOrdenPedidoPayload>;
                };
                findFirst: {
                    args: Prisma.MdOrdenPedidoFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MdOrdenPedidoPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.MdOrdenPedidoFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MdOrdenPedidoPayload>;
                };
                findMany: {
                    args: Prisma.MdOrdenPedidoFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MdOrdenPedidoPayload>[];
                };
                create: {
                    args: Prisma.MdOrdenPedidoCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MdOrdenPedidoPayload>;
                };
                createMany: {
                    args: Prisma.MdOrdenPedidoCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.MdOrdenPedidoDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MdOrdenPedidoPayload>;
                };
                update: {
                    args: Prisma.MdOrdenPedidoUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MdOrdenPedidoPayload>;
                };
                deleteMany: {
                    args: Prisma.MdOrdenPedidoDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.MdOrdenPedidoUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.MdOrdenPedidoUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MdOrdenPedidoPayload>;
                };
                aggregate: {
                    args: Prisma.MdOrdenPedidoAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateMdOrdenPedido>;
                };
                groupBy: {
                    args: Prisma.MdOrdenPedidoGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.MdOrdenPedidoGroupByOutputType>[];
                };
                count: {
                    args: Prisma.MdOrdenPedidoCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.MdOrdenPedidoCountAggregateOutputType> | number;
                };
            };
        };
        MdFacility: {
            payload: Prisma.$MdFacilityPayload<ExtArgs>;
            fields: Prisma.MdFacilityFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.MdFacilityFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MdFacilityPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.MdFacilityFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MdFacilityPayload>;
                };
                findFirst: {
                    args: Prisma.MdFacilityFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MdFacilityPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.MdFacilityFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MdFacilityPayload>;
                };
                findMany: {
                    args: Prisma.MdFacilityFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MdFacilityPayload>[];
                };
                create: {
                    args: Prisma.MdFacilityCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MdFacilityPayload>;
                };
                createMany: {
                    args: Prisma.MdFacilityCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.MdFacilityDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MdFacilityPayload>;
                };
                update: {
                    args: Prisma.MdFacilityUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MdFacilityPayload>;
                };
                deleteMany: {
                    args: Prisma.MdFacilityDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.MdFacilityUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.MdFacilityUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MdFacilityPayload>;
                };
                aggregate: {
                    args: Prisma.MdFacilityAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateMdFacility>;
                };
                groupBy: {
                    args: Prisma.MdFacilityGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.MdFacilityGroupByOutputType>[];
                };
                count: {
                    args: Prisma.MdFacilityCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.MdFacilityCountAggregateOutputType> | number;
                };
            };
        };
        MdMaquila: {
            payload: Prisma.$MdMaquilaPayload<ExtArgs>;
            fields: Prisma.MdMaquilaFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.MdMaquilaFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MdMaquilaPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.MdMaquilaFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MdMaquilaPayload>;
                };
                findFirst: {
                    args: Prisma.MdMaquilaFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MdMaquilaPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.MdMaquilaFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MdMaquilaPayload>;
                };
                findMany: {
                    args: Prisma.MdMaquilaFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MdMaquilaPayload>[];
                };
                create: {
                    args: Prisma.MdMaquilaCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MdMaquilaPayload>;
                };
                createMany: {
                    args: Prisma.MdMaquilaCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.MdMaquilaDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MdMaquilaPayload>;
                };
                update: {
                    args: Prisma.MdMaquilaUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MdMaquilaPayload>;
                };
                deleteMany: {
                    args: Prisma.MdMaquilaDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.MdMaquilaUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.MdMaquilaUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MdMaquilaPayload>;
                };
                aggregate: {
                    args: Prisma.MdMaquilaAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateMdMaquila>;
                };
                groupBy: {
                    args: Prisma.MdMaquilaGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.MdMaquilaGroupByOutputType>[];
                };
                count: {
                    args: Prisma.MdMaquilaCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.MdMaquilaCountAggregateOutputType> | number;
                };
            };
        };
        MdFacilityMaquila: {
            payload: Prisma.$MdFacilityMaquilaPayload<ExtArgs>;
            fields: Prisma.MdFacilityMaquilaFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.MdFacilityMaquilaFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MdFacilityMaquilaPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.MdFacilityMaquilaFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MdFacilityMaquilaPayload>;
                };
                findFirst: {
                    args: Prisma.MdFacilityMaquilaFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MdFacilityMaquilaPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.MdFacilityMaquilaFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MdFacilityMaquilaPayload>;
                };
                findMany: {
                    args: Prisma.MdFacilityMaquilaFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MdFacilityMaquilaPayload>[];
                };
                create: {
                    args: Prisma.MdFacilityMaquilaCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MdFacilityMaquilaPayload>;
                };
                createMany: {
                    args: Prisma.MdFacilityMaquilaCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.MdFacilityMaquilaDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MdFacilityMaquilaPayload>;
                };
                update: {
                    args: Prisma.MdFacilityMaquilaUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MdFacilityMaquilaPayload>;
                };
                deleteMany: {
                    args: Prisma.MdFacilityMaquilaDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.MdFacilityMaquilaUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.MdFacilityMaquilaUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MdFacilityMaquilaPayload>;
                };
                aggregate: {
                    args: Prisma.MdFacilityMaquilaAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateMdFacilityMaquila>;
                };
                groupBy: {
                    args: Prisma.MdFacilityMaquilaGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.MdFacilityMaquilaGroupByOutputType>[];
                };
                count: {
                    args: Prisma.MdFacilityMaquilaCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.MdFacilityMaquilaCountAggregateOutputType> | number;
                };
            };
        };
        MdParentCompanyMaquila: {
            payload: Prisma.$MdParentCompanyMaquilaPayload<ExtArgs>;
            fields: Prisma.MdParentCompanyMaquilaFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.MdParentCompanyMaquilaFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MdParentCompanyMaquilaPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.MdParentCompanyMaquilaFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MdParentCompanyMaquilaPayload>;
                };
                findFirst: {
                    args: Prisma.MdParentCompanyMaquilaFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MdParentCompanyMaquilaPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.MdParentCompanyMaquilaFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MdParentCompanyMaquilaPayload>;
                };
                findMany: {
                    args: Prisma.MdParentCompanyMaquilaFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MdParentCompanyMaquilaPayload>[];
                };
                create: {
                    args: Prisma.MdParentCompanyMaquilaCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MdParentCompanyMaquilaPayload>;
                };
                createMany: {
                    args: Prisma.MdParentCompanyMaquilaCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.MdParentCompanyMaquilaDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MdParentCompanyMaquilaPayload>;
                };
                update: {
                    args: Prisma.MdParentCompanyMaquilaUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MdParentCompanyMaquilaPayload>;
                };
                deleteMany: {
                    args: Prisma.MdParentCompanyMaquilaDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.MdParentCompanyMaquilaUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.MdParentCompanyMaquilaUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MdParentCompanyMaquilaPayload>;
                };
                aggregate: {
                    args: Prisma.MdParentCompanyMaquilaAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateMdParentCompanyMaquila>;
                };
                groupBy: {
                    args: Prisma.MdParentCompanyMaquilaGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.MdParentCompanyMaquilaGroupByOutputType>[];
                };
                count: {
                    args: Prisma.MdParentCompanyMaquilaCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.MdParentCompanyMaquilaCountAggregateOutputType> | number;
                };
            };
        };
        MdSubbrand: {
            payload: Prisma.$MdSubbrandPayload<ExtArgs>;
            fields: Prisma.MdSubbrandFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.MdSubbrandFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MdSubbrandPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.MdSubbrandFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MdSubbrandPayload>;
                };
                findFirst: {
                    args: Prisma.MdSubbrandFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MdSubbrandPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.MdSubbrandFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MdSubbrandPayload>;
                };
                findMany: {
                    args: Prisma.MdSubbrandFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MdSubbrandPayload>[];
                };
                create: {
                    args: Prisma.MdSubbrandCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MdSubbrandPayload>;
                };
                createMany: {
                    args: Prisma.MdSubbrandCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.MdSubbrandDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MdSubbrandPayload>;
                };
                update: {
                    args: Prisma.MdSubbrandUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MdSubbrandPayload>;
                };
                deleteMany: {
                    args: Prisma.MdSubbrandDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.MdSubbrandUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.MdSubbrandUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MdSubbrandPayload>;
                };
                aggregate: {
                    args: Prisma.MdSubbrandAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateMdSubbrand>;
                };
                groupBy: {
                    args: Prisma.MdSubbrandGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.MdSubbrandGroupByOutputType>[];
                };
                count: {
                    args: Prisma.MdSubbrandCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.MdSubbrandCountAggregateOutputType> | number;
                };
            };
        };
        MdUserReo: {
            payload: Prisma.$MdUserReoPayload<ExtArgs>;
            fields: Prisma.MdUserReoFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.MdUserReoFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MdUserReoPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.MdUserReoFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MdUserReoPayload>;
                };
                findFirst: {
                    args: Prisma.MdUserReoFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MdUserReoPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.MdUserReoFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MdUserReoPayload>;
                };
                findMany: {
                    args: Prisma.MdUserReoFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MdUserReoPayload>[];
                };
                create: {
                    args: Prisma.MdUserReoCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MdUserReoPayload>;
                };
                createMany: {
                    args: Prisma.MdUserReoCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.MdUserReoDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MdUserReoPayload>;
                };
                update: {
                    args: Prisma.MdUserReoUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MdUserReoPayload>;
                };
                deleteMany: {
                    args: Prisma.MdUserReoDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.MdUserReoUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.MdUserReoUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MdUserReoPayload>;
                };
                aggregate: {
                    args: Prisma.MdUserReoAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateMdUserReo>;
                };
                groupBy: {
                    args: Prisma.MdUserReoGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.MdUserReoGroupByOutputType>[];
                };
                count: {
                    args: Prisma.MdUserReoCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.MdUserReoCountAggregateOutputType> | number;
                };
            };
        };
        LgUserAccess: {
            payload: Prisma.$LgUserAccessPayload<ExtArgs>;
            fields: Prisma.LgUserAccessFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.LgUserAccessFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LgUserAccessPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.LgUserAccessFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LgUserAccessPayload>;
                };
                findFirst: {
                    args: Prisma.LgUserAccessFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LgUserAccessPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.LgUserAccessFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LgUserAccessPayload>;
                };
                findMany: {
                    args: Prisma.LgUserAccessFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LgUserAccessPayload>[];
                };
                create: {
                    args: Prisma.LgUserAccessCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LgUserAccessPayload>;
                };
                createMany: {
                    args: Prisma.LgUserAccessCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.LgUserAccessDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LgUserAccessPayload>;
                };
                update: {
                    args: Prisma.LgUserAccessUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LgUserAccessPayload>;
                };
                deleteMany: {
                    args: Prisma.LgUserAccessDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.LgUserAccessUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.LgUserAccessUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LgUserAccessPayload>;
                };
                aggregate: {
                    args: Prisma.LgUserAccessAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateLgUserAccess>;
                };
                groupBy: {
                    args: Prisma.LgUserAccessGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.LgUserAccessGroupByOutputType>[];
                };
                count: {
                    args: Prisma.LgUserAccessCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.LgUserAccessCountAggregateOutputType> | number;
                };
            };
        };
        LgParentCompany: {
            payload: Prisma.$LgParentCompanyPayload<ExtArgs>;
            fields: Prisma.LgParentCompanyFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.LgParentCompanyFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LgParentCompanyPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.LgParentCompanyFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LgParentCompanyPayload>;
                };
                findFirst: {
                    args: Prisma.LgParentCompanyFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LgParentCompanyPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.LgParentCompanyFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LgParentCompanyPayload>;
                };
                findMany: {
                    args: Prisma.LgParentCompanyFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LgParentCompanyPayload>[];
                };
                create: {
                    args: Prisma.LgParentCompanyCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LgParentCompanyPayload>;
                };
                createMany: {
                    args: Prisma.LgParentCompanyCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.LgParentCompanyDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LgParentCompanyPayload>;
                };
                update: {
                    args: Prisma.LgParentCompanyUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LgParentCompanyPayload>;
                };
                deleteMany: {
                    args: Prisma.LgParentCompanyDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.LgParentCompanyUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.LgParentCompanyUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LgParentCompanyPayload>;
                };
                aggregate: {
                    args: Prisma.LgParentCompanyAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateLgParentCompany>;
                };
                groupBy: {
                    args: Prisma.LgParentCompanyGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.LgParentCompanyGroupByOutputType>[];
                };
                count: {
                    args: Prisma.LgParentCompanyCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.LgParentCompanyCountAggregateOutputType> | number;
                };
            };
        };
    };
} & {
    other: {
        payload: any;
        operations: {
            $executeRaw: {
                args: [query: TemplateStringsArray | Sql, ...values: any[]];
                result: any;
            };
            $executeRawUnsafe: {
                args: [query: string, ...values: any[]];
                result: any;
            };
            $queryRaw: {
                args: [query: TemplateStringsArray | Sql, ...values: any[]];
                result: any;
            };
            $queryRawUnsafe: {
                args: [query: string, ...values: any[]];
                result: any;
            };
        };
    };
};
/**
 * Enums
 */
export declare const TransactionIsolationLevel: {
    readonly ReadUncommitted: "ReadUncommitted";
    readonly ReadCommitted: "ReadCommitted";
    readonly RepeatableRead: "RepeatableRead";
    readonly Serializable: "Serializable";
};
export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];
export declare const MdParentCompanyScalarFieldEnum: {
    readonly idDlkParentCompany: "idDlkParentCompany";
    readonly codParentCompany: "codParentCompany";
    readonly codGlnParentCompany: "codGlnParentCompany";
    readonly nameParentCompany: "nameParentCompany";
    readonly categoryParentCompany: "categoryParentCompany";
    readonly numRucParentCompany: "numRucParentCompany";
    readonly codUbigeoParentCompany: "codUbigeoParentCompany";
    readonly addressParentCompany: "addressParentCompany";
    readonly gpsLocationParentCompany: "gpsLocationParentCompany";
    readonly emailParentCompany: "emailParentCompany";
    readonly cellularParentCompany: "cellularParentCompany";
    readonly webParentCompany: "webParentCompany";
    readonly canisterDataParentCompany: "canisterDataParentCompany";
    readonly canisterAssetsParentCompany: "canisterAssetsParentCompany";
    readonly logoParentCompany: "logoParentCompany";
    readonly stateParentCompany: "stateParentCompany";
    readonly codUsuarioCargaDl: "codUsuarioCargaDl";
    readonly fehProcesoCargaDl: "fehProcesoCargaDl";
    readonly fehProcesoModifDl: "fehProcesoModifDl";
    readonly desAccion: "desAccion";
    readonly flgStatutActif: "flgStatutActif";
};
export type MdParentCompanyScalarFieldEnum = (typeof MdParentCompanyScalarFieldEnum)[keyof typeof MdParentCompanyScalarFieldEnum];
export declare const MdUbigeoScalarFieldEnum: {
    readonly idDlkUbigeo: "idDlkUbigeo";
    readonly codUbigeo: "codUbigeo";
    readonly desDepartamento: "desDepartamento";
    readonly desProvincia: "desProvincia";
    readonly desDistrito: "desDistrito";
    readonly desCapital: "desCapital";
    readonly codRegion: "codRegion";
    readonly desRegion: "desRegion";
    readonly stateUbigeo: "stateUbigeo";
    readonly codUsuarioCargaDl: "codUsuarioCargaDl";
    readonly fehProcesoCargaDl: "fehProcesoCargaDl";
    readonly fehProcesoModifDl: "fehProcesoModifDl";
    readonly desAccion: "desAccion";
    readonly flgStatutActif: "flgStatutActif";
};
export type MdUbigeoScalarFieldEnum = (typeof MdUbigeoScalarFieldEnum)[keyof typeof MdUbigeoScalarFieldEnum];
export declare const MdBrandScalarFieldEnum: {
    readonly idDlkBrand: "idDlkBrand";
    readonly codBrand: "codBrand";
    readonly idDlkParentCompany: "idDlkParentCompany";
    readonly codParentCompany: "codParentCompany";
    readonly nameBrand: "nameBrand";
    readonly codUbigeoBrand: "codUbigeoBrand";
    readonly addressBrand: "addressBrand";
    readonly locationBrand: "locationBrand";
    readonly emailBrand: "emailBrand";
    readonly cellularBrand: "cellularBrand";
    readonly facebookBrand: "facebookBrand";
    readonly instagramBrand: "instagramBrand";
    readonly whatsappBrand: "whatsappBrand";
    readonly ecommerceBrand: "ecommerceBrand";
    readonly logoBrand: "logoBrand";
    readonly stateBrand: "stateBrand";
    readonly codUsuarioCargaDl: "codUsuarioCargaDl";
    readonly fehProcesoCargaDl: "fehProcesoCargaDl";
    readonly fehProcesoModifDl: "fehProcesoModifDl";
    readonly desAccion: "desAccion";
    readonly flgStatutActif: "flgStatutActif";
};
export type MdBrandScalarFieldEnum = (typeof MdBrandScalarFieldEnum)[keyof typeof MdBrandScalarFieldEnum];
export declare const MdOrdenPedidoScalarFieldEnum: {
    readonly idDlkOrdenPedido: "idDlkOrdenPedido";
    readonly codOrdenPedido: "codOrdenPedido";
    readonly idDlkParentCompany: "idDlkParentCompany";
    readonly cantidad: "cantidad";
    readonly fechaIngreso: "fechaIngreso";
    readonly probableDespacho: "probableDespacho";
    readonly etapa: "etapa";
    readonly estado: "estado";
    readonly codUsuarioCargaDl: "codUsuarioCargaDl";
    readonly fehProcesoCargaDl: "fehProcesoCargaDl";
    readonly fehProcesoModifDl: "fehProcesoModifDl";
    readonly desAccion: "desAccion";
    readonly flgStatutActif: "flgStatutActif";
};
export type MdOrdenPedidoScalarFieldEnum = (typeof MdOrdenPedidoScalarFieldEnum)[keyof typeof MdOrdenPedidoScalarFieldEnum];
export declare const MdFacilityScalarFieldEnum: {
    readonly idDlkFacility: "idDlkFacility";
    readonly codFacility: "codFacility";
    readonly idDlkParentCompany: "idDlkParentCompany";
    readonly codUbigeo: "codUbigeo";
    readonly codGlnFacility: "codGlnFacility";
    readonly registryFacility: "registryFacility";
    readonly identifierFacility: "identifierFacility";
    readonly nameFacility: "nameFacility";
    readonly addressFacility: "addressFacility";
    readonly gpsLocationFacility: "gpsLocationFacility";
    readonly emailFacility: "emailFacility";
    readonly cellularFacility: "cellularFacility";
    readonly stateFacility: "stateFacility";
    readonly codUsuarioCargaDl: "codUsuarioCargaDl";
    readonly fehProcesoCargaDl: "fehProcesoCargaDl";
    readonly fehProcesoModifDl: "fehProcesoModifDl";
    readonly desAccion: "desAccion";
    readonly flgStatutActif: "flgStatutActif";
};
export type MdFacilityScalarFieldEnum = (typeof MdFacilityScalarFieldEnum)[keyof typeof MdFacilityScalarFieldEnum];
export declare const MdMaquilaScalarFieldEnum: {
    readonly idDlkMaquila: "idDlkMaquila";
    readonly codMaquila: "codMaquila";
    readonly codGlnMaquila: "codGlnMaquila";
    readonly nameMaquila: "nameMaquila";
    readonly categoryMaquila: "categoryMaquila";
    readonly numRucMaquila: "numRucMaquila";
    readonly codUbigeo: "codUbigeo";
    readonly addressMaquila: "addressMaquila";
    readonly gpsLocationMaquila: "gpsLocationMaquila";
    readonly emailMaquila: "emailMaquila";
    readonly cellularMaquila: "cellularMaquila";
    readonly webMaquila: "webMaquila";
    readonly canisterDataMaquila: "canisterDataMaquila";
    readonly canisterAssetsMaquila: "canisterAssetsMaquila";
    readonly logoMaquila: "logoMaquila";
    readonly stateMaquila: "stateMaquila";
    readonly codUsuarioCargaDl: "codUsuarioCargaDl";
    readonly fehProcesoCargaDl: "fehProcesoCargaDl";
    readonly fehProcesoModifDl: "fehProcesoModifDl";
    readonly desAccion: "desAccion";
    readonly flgStatutActif: "flgStatutActif";
};
export type MdMaquilaScalarFieldEnum = (typeof MdMaquilaScalarFieldEnum)[keyof typeof MdMaquilaScalarFieldEnum];
export declare const MdFacilityMaquilaScalarFieldEnum: {
    readonly idDlkFacilityMaquila: "idDlkFacilityMaquila";
    readonly codFacilityMaquila: "codFacilityMaquila";
    readonly idDlkMaquila: "idDlkMaquila";
    readonly codMaquila: "codMaquila";
    readonly codUbigeo: "codUbigeo";
    readonly codGlnFacilityMaquila: "codGlnFacilityMaquila";
    readonly registryFacilityMaquila: "registryFacilityMaquila";
    readonly identifierFacilityMaquila: "identifierFacilityMaquila";
    readonly nameFacilityMaquila: "nameFacilityMaquila";
    readonly addressFacilityMaquila: "addressFacilityMaquila";
    readonly gpsLocationFacilityMaquila: "gpsLocationFacilityMaquila";
    readonly emailFacilityMaquila: "emailFacilityMaquila";
    readonly cellularFacilityMaquila: "cellularFacilityMaquila";
    readonly stateFacilityMaquila: "stateFacilityMaquila";
    readonly codUsuarioCargaDl: "codUsuarioCargaDl";
    readonly fehProcesoCargaDl: "fehProcesoCargaDl";
    readonly fehProcesoModifDl: "fehProcesoModifDl";
    readonly desAccion: "desAccion";
    readonly flgStatutActif: "flgStatutActif";
};
export type MdFacilityMaquilaScalarFieldEnum = (typeof MdFacilityMaquilaScalarFieldEnum)[keyof typeof MdFacilityMaquilaScalarFieldEnum];
export declare const MdParentCompanyMaquilaScalarFieldEnum: {
    readonly idDlkParentCompanyMaquila: "idDlkParentCompanyMaquila";
    readonly codParentCompany: "codParentCompany";
    readonly codMaquila: "codMaquila";
    readonly stateParentCompanyMaquila: "stateParentCompanyMaquila";
    readonly codUsuarioCargaDl: "codUsuarioCargaDl";
    readonly fehProcesoCargaDl: "fehProcesoCargaDl";
    readonly fehProcesoModifDl: "fehProcesoModifDl";
    readonly desAccion: "desAccion";
    readonly flgStatutActif: "flgStatutActif";
};
export type MdParentCompanyMaquilaScalarFieldEnum = (typeof MdParentCompanyMaquilaScalarFieldEnum)[keyof typeof MdParentCompanyMaquilaScalarFieldEnum];
export declare const MdSubbrandScalarFieldEnum: {
    readonly idDlkSubbrand: "idDlkSubbrand";
    readonly codSubbrand: "codSubbrand";
    readonly idDlkBrand: "idDlkBrand";
    readonly codBrand: "codBrand";
    readonly nameSubbrand: "nameSubbrand";
    readonly codUbigeoSubbrand: "codUbigeoSubbrand";
    readonly addressSubbrand: "addressSubbrand";
    readonly locationSubbrand: "locationSubbrand";
    readonly emailSubbrand: "emailSubbrand";
    readonly cellularSubbrand: "cellularSubbrand";
    readonly facebookSubbrand: "facebookSubbrand";
    readonly instagramSubbrand: "instagramSubbrand";
    readonly whatsappSubbrand: "whatsappSubbrand";
    readonly ecommerceSubbrand: "ecommerceSubbrand";
    readonly logoSubbrand: "logoSubbrand";
    readonly stateSubbrand: "stateSubbrand";
    readonly codUsuarioCargaDl: "codUsuarioCargaDl";
    readonly fehProcesoCargaDl: "fehProcesoCargaDl";
    readonly fehProcesoModifDl: "fehProcesoModifDl";
    readonly desAccion: "desAccion";
    readonly flgStatutActif: "flgStatutActif";
};
export type MdSubbrandScalarFieldEnum = (typeof MdSubbrandScalarFieldEnum)[keyof typeof MdSubbrandScalarFieldEnum];
export declare const MdUserReoScalarFieldEnum: {
    readonly idDlkUserReo: "idDlkUserReo";
    readonly codUserReo: "codUserReo";
    readonly idDlkParentCompany: "idDlkParentCompany";
    readonly codParentCompany: "codParentCompany";
    readonly documentType: "documentType";
    readonly documentNumber: "documentNumber";
    readonly nameUser: "nameUser";
    readonly paternalLastNameUser: "paternalLastNameUser";
    readonly maternalLastNameUser: "maternalLastNameUser";
    readonly sexUser: "sexUser";
    readonly positionUser: "positionUser";
    readonly rolUser: "rolUser";
    readonly emailUser: "emailUser";
    readonly cellularUser: "cellularUser";
    readonly userLogin: "userLogin";
    readonly password: "password";
    readonly photograph: "photograph";
    readonly failedAttempts: "failedAttempts";
    readonly isLocked: "isLocked";
    readonly lockedUntil: "lockedUntil";
    readonly lastLoginDate: "lastLoginDate";
    readonly lastLoginIp: "lastLoginIp";
    readonly passwordExpiresAt: "passwordExpiresAt";
    readonly twoFactorSecret: "twoFactorSecret";
    readonly stateUser: "stateUser";
    readonly codUsuarioCargaDl: "codUsuarioCargaDl";
    readonly fehProcesoCargaDl: "fehProcesoCargaDl";
    readonly fehProcesoModifDl: "fehProcesoModifDl";
    readonly desAccion: "desAccion";
    readonly flgStatutActif: "flgStatutActif";
};
export type MdUserReoScalarFieldEnum = (typeof MdUserReoScalarFieldEnum)[keyof typeof MdUserReoScalarFieldEnum];
export declare const LgUserAccessScalarFieldEnum: {
    readonly idLogAccess: "idLogAccess";
    readonly idDlkUserReo: "idDlkUserReo";
    readonly ipAddress: "ipAddress";
    readonly browser: "browser";
    readonly browserVersion: "browserVersion";
    readonly operatingSystem: "operatingSystem";
    readonly deviceType: "deviceType";
    readonly latitude: "latitude";
    readonly longitude: "longitude";
    readonly city: "city";
    readonly country: "country";
    readonly accessStatus: "accessStatus";
    readonly fehAccess: "fehAccess";
    readonly userAgentRaw: "userAgentRaw";
};
export type LgUserAccessScalarFieldEnum = (typeof LgUserAccessScalarFieldEnum)[keyof typeof LgUserAccessScalarFieldEnum];
export declare const LgParentCompanyScalarFieldEnum: {
    readonly idAudit: "idAudit";
    readonly idDlkParentCompany: "idDlkParentCompany";
    readonly typeOperation: "typeOperation";
    readonly ipAcceso: "ipAcceso";
    readonly userAgent: "userAgent";
    readonly auditUsuario: "auditUsuario";
    readonly fechaCambio: "fechaCambio";
    readonly codParentCompany: "codParentCompany";
    readonly codGlnParentCompany: "codGlnParentCompany";
    readonly nameParentCompany: "nameParentCompany";
    readonly categoryParentCompany: "categoryParentCompany";
    readonly numRucParentCompany: "numRucParentCompany";
    readonly codUbigeoParentCompany: "codUbigeoParentCompany";
    readonly addressParentCompany: "addressParentCompany";
    readonly gpsLocationParent: "gpsLocationParent";
    readonly emailParentCompanyLog: "emailParentCompanyLog";
    readonly cellularParentCompanyLog: "cellularParentCompanyLog";
    readonly webParentCompanyLog: "webParentCompanyLog";
    readonly canisterDataParentLog: "canisterDataParentLog";
    readonly canisterAssetsParentLog: "canisterAssetsParentLog";
};
export type LgParentCompanyScalarFieldEnum = (typeof LgParentCompanyScalarFieldEnum)[keyof typeof LgParentCompanyScalarFieldEnum];
export declare const SortOrder: {
    readonly asc: "asc";
    readonly desc: "desc";
};
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
export declare const NullsOrder: {
    readonly first: "first";
    readonly last: "last";
};
export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];
export declare const MdParentCompanyOrderByRelevanceFieldEnum: {
    readonly codParentCompany: "codParentCompany";
    readonly codGlnParentCompany: "codGlnParentCompany";
    readonly nameParentCompany: "nameParentCompany";
    readonly numRucParentCompany: "numRucParentCompany";
    readonly addressParentCompany: "addressParentCompany";
    readonly gpsLocationParentCompany: "gpsLocationParentCompany";
    readonly emailParentCompany: "emailParentCompany";
    readonly cellularParentCompany: "cellularParentCompany";
    readonly webParentCompany: "webParentCompany";
    readonly canisterDataParentCompany: "canisterDataParentCompany";
    readonly canisterAssetsParentCompany: "canisterAssetsParentCompany";
    readonly codUsuarioCargaDl: "codUsuarioCargaDl";
    readonly desAccion: "desAccion";
};
export type MdParentCompanyOrderByRelevanceFieldEnum = (typeof MdParentCompanyOrderByRelevanceFieldEnum)[keyof typeof MdParentCompanyOrderByRelevanceFieldEnum];
export declare const MdUbigeoOrderByRelevanceFieldEnum: {
    readonly desDepartamento: "desDepartamento";
    readonly desProvincia: "desProvincia";
    readonly desDistrito: "desDistrito";
    readonly desCapital: "desCapital";
    readonly desRegion: "desRegion";
    readonly codUsuarioCargaDl: "codUsuarioCargaDl";
    readonly desAccion: "desAccion";
};
export type MdUbigeoOrderByRelevanceFieldEnum = (typeof MdUbigeoOrderByRelevanceFieldEnum)[keyof typeof MdUbigeoOrderByRelevanceFieldEnum];
export declare const MdBrandOrderByRelevanceFieldEnum: {
    readonly codBrand: "codBrand";
    readonly codParentCompany: "codParentCompany";
    readonly nameBrand: "nameBrand";
    readonly addressBrand: "addressBrand";
    readonly locationBrand: "locationBrand";
    readonly emailBrand: "emailBrand";
    readonly cellularBrand: "cellularBrand";
    readonly facebookBrand: "facebookBrand";
    readonly instagramBrand: "instagramBrand";
    readonly whatsappBrand: "whatsappBrand";
    readonly ecommerceBrand: "ecommerceBrand";
    readonly codUsuarioCargaDl: "codUsuarioCargaDl";
    readonly desAccion: "desAccion";
};
export type MdBrandOrderByRelevanceFieldEnum = (typeof MdBrandOrderByRelevanceFieldEnum)[keyof typeof MdBrandOrderByRelevanceFieldEnum];
export declare const MdOrdenPedidoOrderByRelevanceFieldEnum: {
    readonly codOrdenPedido: "codOrdenPedido";
    readonly codUsuarioCargaDl: "codUsuarioCargaDl";
    readonly desAccion: "desAccion";
};
export type MdOrdenPedidoOrderByRelevanceFieldEnum = (typeof MdOrdenPedidoOrderByRelevanceFieldEnum)[keyof typeof MdOrdenPedidoOrderByRelevanceFieldEnum];
export declare const MdFacilityOrderByRelevanceFieldEnum: {
    readonly codFacility: "codFacility";
    readonly codGlnFacility: "codGlnFacility";
    readonly registryFacility: "registryFacility";
    readonly identifierFacility: "identifierFacility";
    readonly nameFacility: "nameFacility";
    readonly addressFacility: "addressFacility";
    readonly gpsLocationFacility: "gpsLocationFacility";
    readonly emailFacility: "emailFacility";
    readonly cellularFacility: "cellularFacility";
    readonly codUsuarioCargaDl: "codUsuarioCargaDl";
    readonly desAccion: "desAccion";
};
export type MdFacilityOrderByRelevanceFieldEnum = (typeof MdFacilityOrderByRelevanceFieldEnum)[keyof typeof MdFacilityOrderByRelevanceFieldEnum];
export declare const MdMaquilaOrderByRelevanceFieldEnum: {
    readonly codMaquila: "codMaquila";
    readonly codGlnMaquila: "codGlnMaquila";
    readonly nameMaquila: "nameMaquila";
    readonly numRucMaquila: "numRucMaquila";
    readonly addressMaquila: "addressMaquila";
    readonly gpsLocationMaquila: "gpsLocationMaquila";
    readonly emailMaquila: "emailMaquila";
    readonly cellularMaquila: "cellularMaquila";
    readonly webMaquila: "webMaquila";
    readonly canisterAssetsMaquila: "canisterAssetsMaquila";
    readonly codUsuarioCargaDl: "codUsuarioCargaDl";
    readonly desAccion: "desAccion";
};
export type MdMaquilaOrderByRelevanceFieldEnum = (typeof MdMaquilaOrderByRelevanceFieldEnum)[keyof typeof MdMaquilaOrderByRelevanceFieldEnum];
export declare const MdFacilityMaquilaOrderByRelevanceFieldEnum: {
    readonly codFacilityMaquila: "codFacilityMaquila";
    readonly codMaquila: "codMaquila";
    readonly codGlnFacilityMaquila: "codGlnFacilityMaquila";
    readonly registryFacilityMaquila: "registryFacilityMaquila";
    readonly identifierFacilityMaquila: "identifierFacilityMaquila";
    readonly nameFacilityMaquila: "nameFacilityMaquila";
    readonly addressFacilityMaquila: "addressFacilityMaquila";
    readonly gpsLocationFacilityMaquila: "gpsLocationFacilityMaquila";
    readonly emailFacilityMaquila: "emailFacilityMaquila";
    readonly cellularFacilityMaquila: "cellularFacilityMaquila";
    readonly codUsuarioCargaDl: "codUsuarioCargaDl";
    readonly desAccion: "desAccion";
};
export type MdFacilityMaquilaOrderByRelevanceFieldEnum = (typeof MdFacilityMaquilaOrderByRelevanceFieldEnum)[keyof typeof MdFacilityMaquilaOrderByRelevanceFieldEnum];
export declare const MdParentCompanyMaquilaOrderByRelevanceFieldEnum: {
    readonly codParentCompany: "codParentCompany";
    readonly codMaquila: "codMaquila";
    readonly codUsuarioCargaDl: "codUsuarioCargaDl";
    readonly desAccion: "desAccion";
};
export type MdParentCompanyMaquilaOrderByRelevanceFieldEnum = (typeof MdParentCompanyMaquilaOrderByRelevanceFieldEnum)[keyof typeof MdParentCompanyMaquilaOrderByRelevanceFieldEnum];
export declare const MdSubbrandOrderByRelevanceFieldEnum: {
    readonly codSubbrand: "codSubbrand";
    readonly codBrand: "codBrand";
    readonly nameSubbrand: "nameSubbrand";
    readonly addressSubbrand: "addressSubbrand";
    readonly locationSubbrand: "locationSubbrand";
    readonly emailSubbrand: "emailSubbrand";
    readonly cellularSubbrand: "cellularSubbrand";
    readonly facebookSubbrand: "facebookSubbrand";
    readonly instagramSubbrand: "instagramSubbrand";
    readonly whatsappSubbrand: "whatsappSubbrand";
    readonly ecommerceSubbrand: "ecommerceSubbrand";
    readonly codUsuarioCargaDl: "codUsuarioCargaDl";
    readonly desAccion: "desAccion";
};
export type MdSubbrandOrderByRelevanceFieldEnum = (typeof MdSubbrandOrderByRelevanceFieldEnum)[keyof typeof MdSubbrandOrderByRelevanceFieldEnum];
export declare const MdUserReoOrderByRelevanceFieldEnum: {
    readonly codUserReo: "codUserReo";
    readonly codParentCompany: "codParentCompany";
    readonly documentNumber: "documentNumber";
    readonly nameUser: "nameUser";
    readonly paternalLastNameUser: "paternalLastNameUser";
    readonly maternalLastNameUser: "maternalLastNameUser";
    readonly sexUser: "sexUser";
    readonly emailUser: "emailUser";
    readonly cellularUser: "cellularUser";
    readonly userLogin: "userLogin";
    readonly password: "password";
    readonly lastLoginIp: "lastLoginIp";
    readonly twoFactorSecret: "twoFactorSecret";
    readonly codUsuarioCargaDl: "codUsuarioCargaDl";
    readonly desAccion: "desAccion";
};
export type MdUserReoOrderByRelevanceFieldEnum = (typeof MdUserReoOrderByRelevanceFieldEnum)[keyof typeof MdUserReoOrderByRelevanceFieldEnum];
export declare const LgUserAccessOrderByRelevanceFieldEnum: {
    readonly ipAddress: "ipAddress";
    readonly browser: "browser";
    readonly browserVersion: "browserVersion";
    readonly operatingSystem: "operatingSystem";
    readonly deviceType: "deviceType";
    readonly city: "city";
    readonly country: "country";
    readonly accessStatus: "accessStatus";
    readonly userAgentRaw: "userAgentRaw";
};
export type LgUserAccessOrderByRelevanceFieldEnum = (typeof LgUserAccessOrderByRelevanceFieldEnum)[keyof typeof LgUserAccessOrderByRelevanceFieldEnum];
export declare const LgParentCompanyOrderByRelevanceFieldEnum: {
    readonly typeOperation: "typeOperation";
    readonly ipAcceso: "ipAcceso";
    readonly userAgent: "userAgent";
    readonly auditUsuario: "auditUsuario";
    readonly codParentCompany: "codParentCompany";
    readonly codGlnParentCompany: "codGlnParentCompany";
    readonly nameParentCompany: "nameParentCompany";
    readonly numRucParentCompany: "numRucParentCompany";
    readonly addressParentCompany: "addressParentCompany";
    readonly gpsLocationParent: "gpsLocationParent";
    readonly emailParentCompanyLog: "emailParentCompanyLog";
    readonly cellularParentCompanyLog: "cellularParentCompanyLog";
    readonly webParentCompanyLog: "webParentCompanyLog";
    readonly canisterDataParentLog: "canisterDataParentLog";
    readonly canisterAssetsParentLog: "canisterAssetsParentLog";
};
export type LgParentCompanyOrderByRelevanceFieldEnum = (typeof LgParentCompanyOrderByRelevanceFieldEnum)[keyof typeof LgParentCompanyOrderByRelevanceFieldEnum];
/**
 * Field references
 */
/**
 * Reference to a field of type 'Int'
 */
export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>;
/**
 * Reference to a field of type 'String'
 */
export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>;
/**
 * Reference to a field of type 'Bytes'
 */
export type BytesFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Bytes'>;
/**
 * Reference to a field of type 'DateTime'
 */
export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>;
/**
 * Reference to a field of type 'BigInt'
 */
export type BigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt'>;
/**
 * Reference to a field of type 'Decimal'
 */
export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>;
/**
 * Reference to a field of type 'Float'
 */
export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>;
/**
 * Batch Payload for updateMany & deleteMany & createMany
 */
export type BatchPayload = {
    count: number;
};
export declare const defineExtension: runtime.Types.Extensions.ExtendsHook<"define", TypeMapCb, runtime.Types.Extensions.DefaultArgs>;
export type DefaultPrismaClient = PrismaClient;
export type ErrorFormat = 'pretty' | 'colorless' | 'minimal';
export type PrismaClientOptions = ({
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-pg`.
     */
    adapter: runtime.SqlDriverAdapterFactory;
    accelerateUrl?: never;
} | {
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl: string;
    adapter?: never;
}) & {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat;
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     *
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     *
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     *
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[];
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
        maxWait?: number;
        timeout?: number;
        isolationLevel?: TransactionIsolationLevel;
    };
    /**
     * Global configuration for omitting model fields by default.
     *
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: GlobalOmitConfig;
};
export type GlobalOmitConfig = {
    mdParentCompany?: Prisma.MdParentCompanyOmit;
    mdUbigeo?: Prisma.MdUbigeoOmit;
    mdBrand?: Prisma.MdBrandOmit;
    mdOrdenPedido?: Prisma.MdOrdenPedidoOmit;
    mdFacility?: Prisma.MdFacilityOmit;
    mdMaquila?: Prisma.MdMaquilaOmit;
    mdFacilityMaquila?: Prisma.MdFacilityMaquilaOmit;
    mdParentCompanyMaquila?: Prisma.MdParentCompanyMaquilaOmit;
    mdSubbrand?: Prisma.MdSubbrandOmit;
    mdUserReo?: Prisma.MdUserReoOmit;
    lgUserAccess?: Prisma.LgUserAccessOmit;
    lgParentCompany?: Prisma.LgParentCompanyOmit;
};
export type LogLevel = 'info' | 'query' | 'warn' | 'error';
export type LogDefinition = {
    level: LogLevel;
    emit: 'stdout' | 'event';
};
export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;
export type GetLogType<T> = CheckIsLogLevel<T extends LogDefinition ? T['level'] : T>;
export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition> ? GetLogType<T[number]> : never;
export type QueryEvent = {
    timestamp: Date;
    query: string;
    params: string;
    duration: number;
    target: string;
};
export type LogEvent = {
    timestamp: Date;
    message: string;
    target: string;
};
export type PrismaAction = 'findUnique' | 'findUniqueOrThrow' | 'findMany' | 'findFirst' | 'findFirstOrThrow' | 'create' | 'createMany' | 'createManyAndReturn' | 'update' | 'updateMany' | 'updateManyAndReturn' | 'upsert' | 'delete' | 'deleteMany' | 'executeRaw' | 'queryRaw' | 'aggregate' | 'count' | 'runCommandRaw' | 'findRaw' | 'groupBy';
/**
 * `PrismaClient` proxy available in interactive transactions.
 */
export type TransactionClient = Omit<DefaultPrismaClient, runtime.ITXClientDenyList>;
