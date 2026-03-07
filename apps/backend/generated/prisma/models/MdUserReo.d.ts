import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model MdUserReo
 *
 */
export type MdUserReoModel = runtime.Types.Result.DefaultSelection<Prisma.$MdUserReoPayload>;
export type AggregateMdUserReo = {
    _count: MdUserReoCountAggregateOutputType | null;
    _avg: MdUserReoAvgAggregateOutputType | null;
    _sum: MdUserReoSumAggregateOutputType | null;
    _min: MdUserReoMinAggregateOutputType | null;
    _max: MdUserReoMaxAggregateOutputType | null;
};
export type MdUserReoAvgAggregateOutputType = {
    idDlkUserReo: number | null;
    idDlkParentCompany: number | null;
    documentType: number | null;
    positionUser: number | null;
    rolUser: number | null;
    failedAttempts: number | null;
    isLocked: number | null;
    stateUser: number | null;
    flgStatutActif: number | null;
};
export type MdUserReoSumAggregateOutputType = {
    idDlkUserReo: number | null;
    idDlkParentCompany: number | null;
    documentType: number | null;
    positionUser: number | null;
    rolUser: number | null;
    failedAttempts: number | null;
    isLocked: number | null;
    stateUser: number | null;
    flgStatutActif: number | null;
};
export type MdUserReoMinAggregateOutputType = {
    idDlkUserReo: number | null;
    codUserReo: string | null;
    idDlkParentCompany: number | null;
    codParentCompany: string | null;
    documentType: number | null;
    documentNumber: string | null;
    nameUser: string | null;
    paternalLastNameUser: string | null;
    maternalLastNameUser: string | null;
    sexUser: string | null;
    positionUser: number | null;
    rolUser: number | null;
    emailUser: string | null;
    cellularUser: string | null;
    userLogin: string | null;
    password: string | null;
    photograph: runtime.Bytes | null;
    failedAttempts: number | null;
    isLocked: number | null;
    lockedUntil: Date | null;
    lastLoginDate: Date | null;
    lastLoginIp: string | null;
    passwordExpiresAt: Date | null;
    twoFactorSecret: string | null;
    stateUser: number | null;
    codUsuarioCargaDl: string | null;
    fehProcesoCargaDl: Date | null;
    fehProcesoModifDl: Date | null;
    desAccion: string | null;
    flgStatutActif: number | null;
};
export type MdUserReoMaxAggregateOutputType = {
    idDlkUserReo: number | null;
    codUserReo: string | null;
    idDlkParentCompany: number | null;
    codParentCompany: string | null;
    documentType: number | null;
    documentNumber: string | null;
    nameUser: string | null;
    paternalLastNameUser: string | null;
    maternalLastNameUser: string | null;
    sexUser: string | null;
    positionUser: number | null;
    rolUser: number | null;
    emailUser: string | null;
    cellularUser: string | null;
    userLogin: string | null;
    password: string | null;
    photograph: runtime.Bytes | null;
    failedAttempts: number | null;
    isLocked: number | null;
    lockedUntil: Date | null;
    lastLoginDate: Date | null;
    lastLoginIp: string | null;
    passwordExpiresAt: Date | null;
    twoFactorSecret: string | null;
    stateUser: number | null;
    codUsuarioCargaDl: string | null;
    fehProcesoCargaDl: Date | null;
    fehProcesoModifDl: Date | null;
    desAccion: string | null;
    flgStatutActif: number | null;
};
export type MdUserReoCountAggregateOutputType = {
    idDlkUserReo: number;
    codUserReo: number;
    idDlkParentCompany: number;
    codParentCompany: number;
    documentType: number;
    documentNumber: number;
    nameUser: number;
    paternalLastNameUser: number;
    maternalLastNameUser: number;
    sexUser: number;
    positionUser: number;
    rolUser: number;
    emailUser: number;
    cellularUser: number;
    userLogin: number;
    password: number;
    photograph: number;
    failedAttempts: number;
    isLocked: number;
    lockedUntil: number;
    lastLoginDate: number;
    lastLoginIp: number;
    passwordExpiresAt: number;
    twoFactorSecret: number;
    stateUser: number;
    codUsuarioCargaDl: number;
    fehProcesoCargaDl: number;
    fehProcesoModifDl: number;
    desAccion: number;
    flgStatutActif: number;
    _all: number;
};
export type MdUserReoAvgAggregateInputType = {
    idDlkUserReo?: true;
    idDlkParentCompany?: true;
    documentType?: true;
    positionUser?: true;
    rolUser?: true;
    failedAttempts?: true;
    isLocked?: true;
    stateUser?: true;
    flgStatutActif?: true;
};
export type MdUserReoSumAggregateInputType = {
    idDlkUserReo?: true;
    idDlkParentCompany?: true;
    documentType?: true;
    positionUser?: true;
    rolUser?: true;
    failedAttempts?: true;
    isLocked?: true;
    stateUser?: true;
    flgStatutActif?: true;
};
export type MdUserReoMinAggregateInputType = {
    idDlkUserReo?: true;
    codUserReo?: true;
    idDlkParentCompany?: true;
    codParentCompany?: true;
    documentType?: true;
    documentNumber?: true;
    nameUser?: true;
    paternalLastNameUser?: true;
    maternalLastNameUser?: true;
    sexUser?: true;
    positionUser?: true;
    rolUser?: true;
    emailUser?: true;
    cellularUser?: true;
    userLogin?: true;
    password?: true;
    photograph?: true;
    failedAttempts?: true;
    isLocked?: true;
    lockedUntil?: true;
    lastLoginDate?: true;
    lastLoginIp?: true;
    passwordExpiresAt?: true;
    twoFactorSecret?: true;
    stateUser?: true;
    codUsuarioCargaDl?: true;
    fehProcesoCargaDl?: true;
    fehProcesoModifDl?: true;
    desAccion?: true;
    flgStatutActif?: true;
};
export type MdUserReoMaxAggregateInputType = {
    idDlkUserReo?: true;
    codUserReo?: true;
    idDlkParentCompany?: true;
    codParentCompany?: true;
    documentType?: true;
    documentNumber?: true;
    nameUser?: true;
    paternalLastNameUser?: true;
    maternalLastNameUser?: true;
    sexUser?: true;
    positionUser?: true;
    rolUser?: true;
    emailUser?: true;
    cellularUser?: true;
    userLogin?: true;
    password?: true;
    photograph?: true;
    failedAttempts?: true;
    isLocked?: true;
    lockedUntil?: true;
    lastLoginDate?: true;
    lastLoginIp?: true;
    passwordExpiresAt?: true;
    twoFactorSecret?: true;
    stateUser?: true;
    codUsuarioCargaDl?: true;
    fehProcesoCargaDl?: true;
    fehProcesoModifDl?: true;
    desAccion?: true;
    flgStatutActif?: true;
};
export type MdUserReoCountAggregateInputType = {
    idDlkUserReo?: true;
    codUserReo?: true;
    idDlkParentCompany?: true;
    codParentCompany?: true;
    documentType?: true;
    documentNumber?: true;
    nameUser?: true;
    paternalLastNameUser?: true;
    maternalLastNameUser?: true;
    sexUser?: true;
    positionUser?: true;
    rolUser?: true;
    emailUser?: true;
    cellularUser?: true;
    userLogin?: true;
    password?: true;
    photograph?: true;
    failedAttempts?: true;
    isLocked?: true;
    lockedUntil?: true;
    lastLoginDate?: true;
    lastLoginIp?: true;
    passwordExpiresAt?: true;
    twoFactorSecret?: true;
    stateUser?: true;
    codUsuarioCargaDl?: true;
    fehProcesoCargaDl?: true;
    fehProcesoModifDl?: true;
    desAccion?: true;
    flgStatutActif?: true;
    _all?: true;
};
export type MdUserReoAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which MdUserReo to aggregate.
     */
    where?: Prisma.MdUserReoWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of MdUserReos to fetch.
     */
    orderBy?: Prisma.MdUserReoOrderByWithRelationInput | Prisma.MdUserReoOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.MdUserReoWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` MdUserReos from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` MdUserReos.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned MdUserReos
    **/
    _count?: true | MdUserReoCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: MdUserReoAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: MdUserReoSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: MdUserReoMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: MdUserReoMaxAggregateInputType;
};
export type GetMdUserReoAggregateType<T extends MdUserReoAggregateArgs> = {
    [P in keyof T & keyof AggregateMdUserReo]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateMdUserReo[P]> : Prisma.GetScalarType<T[P], AggregateMdUserReo[P]>;
};
export type MdUserReoGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MdUserReoWhereInput;
    orderBy?: Prisma.MdUserReoOrderByWithAggregationInput | Prisma.MdUserReoOrderByWithAggregationInput[];
    by: Prisma.MdUserReoScalarFieldEnum[] | Prisma.MdUserReoScalarFieldEnum;
    having?: Prisma.MdUserReoScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: MdUserReoCountAggregateInputType | true;
    _avg?: MdUserReoAvgAggregateInputType;
    _sum?: MdUserReoSumAggregateInputType;
    _min?: MdUserReoMinAggregateInputType;
    _max?: MdUserReoMaxAggregateInputType;
};
export type MdUserReoGroupByOutputType = {
    idDlkUserReo: number;
    codUserReo: string;
    idDlkParentCompany: number;
    codParentCompany: string;
    documentType: number;
    documentNumber: string;
    nameUser: string;
    paternalLastNameUser: string;
    maternalLastNameUser: string;
    sexUser: string;
    positionUser: number;
    rolUser: number;
    emailUser: string;
    cellularUser: string;
    userLogin: string;
    password: string;
    photograph: runtime.Bytes | null;
    failedAttempts: number | null;
    isLocked: number | null;
    lockedUntil: Date | null;
    lastLoginDate: Date | null;
    lastLoginIp: string | null;
    passwordExpiresAt: Date | null;
    twoFactorSecret: string | null;
    stateUser: number;
    codUsuarioCargaDl: string;
    fehProcesoCargaDl: Date;
    fehProcesoModifDl: Date;
    desAccion: string;
    flgStatutActif: number;
    _count: MdUserReoCountAggregateOutputType | null;
    _avg: MdUserReoAvgAggregateOutputType | null;
    _sum: MdUserReoSumAggregateOutputType | null;
    _min: MdUserReoMinAggregateOutputType | null;
    _max: MdUserReoMaxAggregateOutputType | null;
};
type GetMdUserReoGroupByPayload<T extends MdUserReoGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<MdUserReoGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof MdUserReoGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], MdUserReoGroupByOutputType[P]> : Prisma.GetScalarType<T[P], MdUserReoGroupByOutputType[P]>;
}>>;
export type MdUserReoWhereInput = {
    AND?: Prisma.MdUserReoWhereInput | Prisma.MdUserReoWhereInput[];
    OR?: Prisma.MdUserReoWhereInput[];
    NOT?: Prisma.MdUserReoWhereInput | Prisma.MdUserReoWhereInput[];
    idDlkUserReo?: Prisma.IntFilter<"MdUserReo"> | number;
    codUserReo?: Prisma.StringFilter<"MdUserReo"> | string;
    idDlkParentCompany?: Prisma.IntFilter<"MdUserReo"> | number;
    codParentCompany?: Prisma.StringFilter<"MdUserReo"> | string;
    documentType?: Prisma.IntFilter<"MdUserReo"> | number;
    documentNumber?: Prisma.StringFilter<"MdUserReo"> | string;
    nameUser?: Prisma.StringFilter<"MdUserReo"> | string;
    paternalLastNameUser?: Prisma.StringFilter<"MdUserReo"> | string;
    maternalLastNameUser?: Prisma.StringFilter<"MdUserReo"> | string;
    sexUser?: Prisma.StringFilter<"MdUserReo"> | string;
    positionUser?: Prisma.IntFilter<"MdUserReo"> | number;
    rolUser?: Prisma.IntFilter<"MdUserReo"> | number;
    emailUser?: Prisma.StringFilter<"MdUserReo"> | string;
    cellularUser?: Prisma.StringFilter<"MdUserReo"> | string;
    userLogin?: Prisma.StringFilter<"MdUserReo"> | string;
    password?: Prisma.StringFilter<"MdUserReo"> | string;
    photograph?: Prisma.BytesNullableFilter<"MdUserReo"> | runtime.Bytes | null;
    failedAttempts?: Prisma.IntNullableFilter<"MdUserReo"> | number | null;
    isLocked?: Prisma.IntNullableFilter<"MdUserReo"> | number | null;
    lockedUntil?: Prisma.DateTimeNullableFilter<"MdUserReo"> | Date | string | null;
    lastLoginDate?: Prisma.DateTimeNullableFilter<"MdUserReo"> | Date | string | null;
    lastLoginIp?: Prisma.StringNullableFilter<"MdUserReo"> | string | null;
    passwordExpiresAt?: Prisma.DateTimeNullableFilter<"MdUserReo"> | Date | string | null;
    twoFactorSecret?: Prisma.StringNullableFilter<"MdUserReo"> | string | null;
    stateUser?: Prisma.IntFilter<"MdUserReo"> | number;
    codUsuarioCargaDl?: Prisma.StringFilter<"MdUserReo"> | string;
    fehProcesoCargaDl?: Prisma.DateTimeFilter<"MdUserReo"> | Date | string;
    fehProcesoModifDl?: Prisma.DateTimeFilter<"MdUserReo"> | Date | string;
    desAccion?: Prisma.StringFilter<"MdUserReo"> | string;
    flgStatutActif?: Prisma.IntFilter<"MdUserReo"> | number;
    parentCompany?: Prisma.XOR<Prisma.MdParentCompanyScalarRelationFilter, Prisma.MdParentCompanyWhereInput>;
    accessLogs?: Prisma.LgUserAccessListRelationFilter;
};
export type MdUserReoOrderByWithRelationInput = {
    idDlkUserReo?: Prisma.SortOrder;
    codUserReo?: Prisma.SortOrder;
    idDlkParentCompany?: Prisma.SortOrder;
    codParentCompany?: Prisma.SortOrder;
    documentType?: Prisma.SortOrder;
    documentNumber?: Prisma.SortOrder;
    nameUser?: Prisma.SortOrder;
    paternalLastNameUser?: Prisma.SortOrder;
    maternalLastNameUser?: Prisma.SortOrder;
    sexUser?: Prisma.SortOrder;
    positionUser?: Prisma.SortOrder;
    rolUser?: Prisma.SortOrder;
    emailUser?: Prisma.SortOrder;
    cellularUser?: Prisma.SortOrder;
    userLogin?: Prisma.SortOrder;
    password?: Prisma.SortOrder;
    photograph?: Prisma.SortOrderInput | Prisma.SortOrder;
    failedAttempts?: Prisma.SortOrderInput | Prisma.SortOrder;
    isLocked?: Prisma.SortOrderInput | Prisma.SortOrder;
    lockedUntil?: Prisma.SortOrderInput | Prisma.SortOrder;
    lastLoginDate?: Prisma.SortOrderInput | Prisma.SortOrder;
    lastLoginIp?: Prisma.SortOrderInput | Prisma.SortOrder;
    passwordExpiresAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    twoFactorSecret?: Prisma.SortOrderInput | Prisma.SortOrder;
    stateUser?: Prisma.SortOrder;
    codUsuarioCargaDl?: Prisma.SortOrder;
    fehProcesoCargaDl?: Prisma.SortOrder;
    fehProcesoModifDl?: Prisma.SortOrder;
    desAccion?: Prisma.SortOrder;
    flgStatutActif?: Prisma.SortOrder;
    parentCompany?: Prisma.MdParentCompanyOrderByWithRelationInput;
    accessLogs?: Prisma.LgUserAccessOrderByRelationAggregateInput;
    _relevance?: Prisma.MdUserReoOrderByRelevanceInput;
};
export type MdUserReoWhereUniqueInput = Prisma.AtLeast<{
    idDlkUserReo?: number;
    codUserReo?: string;
    userLogin?: string;
    AND?: Prisma.MdUserReoWhereInput | Prisma.MdUserReoWhereInput[];
    OR?: Prisma.MdUserReoWhereInput[];
    NOT?: Prisma.MdUserReoWhereInput | Prisma.MdUserReoWhereInput[];
    idDlkParentCompany?: Prisma.IntFilter<"MdUserReo"> | number;
    codParentCompany?: Prisma.StringFilter<"MdUserReo"> | string;
    documentType?: Prisma.IntFilter<"MdUserReo"> | number;
    documentNumber?: Prisma.StringFilter<"MdUserReo"> | string;
    nameUser?: Prisma.StringFilter<"MdUserReo"> | string;
    paternalLastNameUser?: Prisma.StringFilter<"MdUserReo"> | string;
    maternalLastNameUser?: Prisma.StringFilter<"MdUserReo"> | string;
    sexUser?: Prisma.StringFilter<"MdUserReo"> | string;
    positionUser?: Prisma.IntFilter<"MdUserReo"> | number;
    rolUser?: Prisma.IntFilter<"MdUserReo"> | number;
    emailUser?: Prisma.StringFilter<"MdUserReo"> | string;
    cellularUser?: Prisma.StringFilter<"MdUserReo"> | string;
    password?: Prisma.StringFilter<"MdUserReo"> | string;
    photograph?: Prisma.BytesNullableFilter<"MdUserReo"> | runtime.Bytes | null;
    failedAttempts?: Prisma.IntNullableFilter<"MdUserReo"> | number | null;
    isLocked?: Prisma.IntNullableFilter<"MdUserReo"> | number | null;
    lockedUntil?: Prisma.DateTimeNullableFilter<"MdUserReo"> | Date | string | null;
    lastLoginDate?: Prisma.DateTimeNullableFilter<"MdUserReo"> | Date | string | null;
    lastLoginIp?: Prisma.StringNullableFilter<"MdUserReo"> | string | null;
    passwordExpiresAt?: Prisma.DateTimeNullableFilter<"MdUserReo"> | Date | string | null;
    twoFactorSecret?: Prisma.StringNullableFilter<"MdUserReo"> | string | null;
    stateUser?: Prisma.IntFilter<"MdUserReo"> | number;
    codUsuarioCargaDl?: Prisma.StringFilter<"MdUserReo"> | string;
    fehProcesoCargaDl?: Prisma.DateTimeFilter<"MdUserReo"> | Date | string;
    fehProcesoModifDl?: Prisma.DateTimeFilter<"MdUserReo"> | Date | string;
    desAccion?: Prisma.StringFilter<"MdUserReo"> | string;
    flgStatutActif?: Prisma.IntFilter<"MdUserReo"> | number;
    parentCompany?: Prisma.XOR<Prisma.MdParentCompanyScalarRelationFilter, Prisma.MdParentCompanyWhereInput>;
    accessLogs?: Prisma.LgUserAccessListRelationFilter;
}, "idDlkUserReo" | "codUserReo" | "userLogin">;
export type MdUserReoOrderByWithAggregationInput = {
    idDlkUserReo?: Prisma.SortOrder;
    codUserReo?: Prisma.SortOrder;
    idDlkParentCompany?: Prisma.SortOrder;
    codParentCompany?: Prisma.SortOrder;
    documentType?: Prisma.SortOrder;
    documentNumber?: Prisma.SortOrder;
    nameUser?: Prisma.SortOrder;
    paternalLastNameUser?: Prisma.SortOrder;
    maternalLastNameUser?: Prisma.SortOrder;
    sexUser?: Prisma.SortOrder;
    positionUser?: Prisma.SortOrder;
    rolUser?: Prisma.SortOrder;
    emailUser?: Prisma.SortOrder;
    cellularUser?: Prisma.SortOrder;
    userLogin?: Prisma.SortOrder;
    password?: Prisma.SortOrder;
    photograph?: Prisma.SortOrderInput | Prisma.SortOrder;
    failedAttempts?: Prisma.SortOrderInput | Prisma.SortOrder;
    isLocked?: Prisma.SortOrderInput | Prisma.SortOrder;
    lockedUntil?: Prisma.SortOrderInput | Prisma.SortOrder;
    lastLoginDate?: Prisma.SortOrderInput | Prisma.SortOrder;
    lastLoginIp?: Prisma.SortOrderInput | Prisma.SortOrder;
    passwordExpiresAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    twoFactorSecret?: Prisma.SortOrderInput | Prisma.SortOrder;
    stateUser?: Prisma.SortOrder;
    codUsuarioCargaDl?: Prisma.SortOrder;
    fehProcesoCargaDl?: Prisma.SortOrder;
    fehProcesoModifDl?: Prisma.SortOrder;
    desAccion?: Prisma.SortOrder;
    flgStatutActif?: Prisma.SortOrder;
    _count?: Prisma.MdUserReoCountOrderByAggregateInput;
    _avg?: Prisma.MdUserReoAvgOrderByAggregateInput;
    _max?: Prisma.MdUserReoMaxOrderByAggregateInput;
    _min?: Prisma.MdUserReoMinOrderByAggregateInput;
    _sum?: Prisma.MdUserReoSumOrderByAggregateInput;
};
export type MdUserReoScalarWhereWithAggregatesInput = {
    AND?: Prisma.MdUserReoScalarWhereWithAggregatesInput | Prisma.MdUserReoScalarWhereWithAggregatesInput[];
    OR?: Prisma.MdUserReoScalarWhereWithAggregatesInput[];
    NOT?: Prisma.MdUserReoScalarWhereWithAggregatesInput | Prisma.MdUserReoScalarWhereWithAggregatesInput[];
    idDlkUserReo?: Prisma.IntWithAggregatesFilter<"MdUserReo"> | number;
    codUserReo?: Prisma.StringWithAggregatesFilter<"MdUserReo"> | string;
    idDlkParentCompany?: Prisma.IntWithAggregatesFilter<"MdUserReo"> | number;
    codParentCompany?: Prisma.StringWithAggregatesFilter<"MdUserReo"> | string;
    documentType?: Prisma.IntWithAggregatesFilter<"MdUserReo"> | number;
    documentNumber?: Prisma.StringWithAggregatesFilter<"MdUserReo"> | string;
    nameUser?: Prisma.StringWithAggregatesFilter<"MdUserReo"> | string;
    paternalLastNameUser?: Prisma.StringWithAggregatesFilter<"MdUserReo"> | string;
    maternalLastNameUser?: Prisma.StringWithAggregatesFilter<"MdUserReo"> | string;
    sexUser?: Prisma.StringWithAggregatesFilter<"MdUserReo"> | string;
    positionUser?: Prisma.IntWithAggregatesFilter<"MdUserReo"> | number;
    rolUser?: Prisma.IntWithAggregatesFilter<"MdUserReo"> | number;
    emailUser?: Prisma.StringWithAggregatesFilter<"MdUserReo"> | string;
    cellularUser?: Prisma.StringWithAggregatesFilter<"MdUserReo"> | string;
    userLogin?: Prisma.StringWithAggregatesFilter<"MdUserReo"> | string;
    password?: Prisma.StringWithAggregatesFilter<"MdUserReo"> | string;
    photograph?: Prisma.BytesNullableWithAggregatesFilter<"MdUserReo"> | runtime.Bytes | null;
    failedAttempts?: Prisma.IntNullableWithAggregatesFilter<"MdUserReo"> | number | null;
    isLocked?: Prisma.IntNullableWithAggregatesFilter<"MdUserReo"> | number | null;
    lockedUntil?: Prisma.DateTimeNullableWithAggregatesFilter<"MdUserReo"> | Date | string | null;
    lastLoginDate?: Prisma.DateTimeNullableWithAggregatesFilter<"MdUserReo"> | Date | string | null;
    lastLoginIp?: Prisma.StringNullableWithAggregatesFilter<"MdUserReo"> | string | null;
    passwordExpiresAt?: Prisma.DateTimeNullableWithAggregatesFilter<"MdUserReo"> | Date | string | null;
    twoFactorSecret?: Prisma.StringNullableWithAggregatesFilter<"MdUserReo"> | string | null;
    stateUser?: Prisma.IntWithAggregatesFilter<"MdUserReo"> | number;
    codUsuarioCargaDl?: Prisma.StringWithAggregatesFilter<"MdUserReo"> | string;
    fehProcesoCargaDl?: Prisma.DateTimeWithAggregatesFilter<"MdUserReo"> | Date | string;
    fehProcesoModifDl?: Prisma.DateTimeWithAggregatesFilter<"MdUserReo"> | Date | string;
    desAccion?: Prisma.StringWithAggregatesFilter<"MdUserReo"> | string;
    flgStatutActif?: Prisma.IntWithAggregatesFilter<"MdUserReo"> | number;
};
export type MdUserReoCreateInput = {
    codUserReo: string;
    codParentCompany: string;
    documentType: number;
    documentNumber: string;
    nameUser: string;
    paternalLastNameUser: string;
    maternalLastNameUser: string;
    sexUser: string;
    positionUser: number;
    rolUser: number;
    emailUser: string;
    cellularUser: string;
    userLogin: string;
    password: string;
    photograph?: runtime.Bytes | null;
    failedAttempts?: number | null;
    isLocked?: number | null;
    lockedUntil?: Date | string | null;
    lastLoginDate?: Date | string | null;
    lastLoginIp?: string | null;
    passwordExpiresAt?: Date | string | null;
    twoFactorSecret?: string | null;
    stateUser?: number;
    codUsuarioCargaDl: string;
    fehProcesoCargaDl?: Date | string;
    fehProcesoModifDl?: Date | string;
    desAccion: string;
    flgStatutActif?: number;
    parentCompany: Prisma.MdParentCompanyCreateNestedOneWithoutUsersInput;
    accessLogs?: Prisma.LgUserAccessCreateNestedManyWithoutUserInput;
};
export type MdUserReoUncheckedCreateInput = {
    idDlkUserReo?: number;
    codUserReo: string;
    idDlkParentCompany: number;
    codParentCompany: string;
    documentType: number;
    documentNumber: string;
    nameUser: string;
    paternalLastNameUser: string;
    maternalLastNameUser: string;
    sexUser: string;
    positionUser: number;
    rolUser: number;
    emailUser: string;
    cellularUser: string;
    userLogin: string;
    password: string;
    photograph?: runtime.Bytes | null;
    failedAttempts?: number | null;
    isLocked?: number | null;
    lockedUntil?: Date | string | null;
    lastLoginDate?: Date | string | null;
    lastLoginIp?: string | null;
    passwordExpiresAt?: Date | string | null;
    twoFactorSecret?: string | null;
    stateUser?: number;
    codUsuarioCargaDl: string;
    fehProcesoCargaDl?: Date | string;
    fehProcesoModifDl?: Date | string;
    desAccion: string;
    flgStatutActif?: number;
    accessLogs?: Prisma.LgUserAccessUncheckedCreateNestedManyWithoutUserInput;
};
export type MdUserReoUpdateInput = {
    codUserReo?: Prisma.StringFieldUpdateOperationsInput | string;
    codParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    documentType?: Prisma.IntFieldUpdateOperationsInput | number;
    documentNumber?: Prisma.StringFieldUpdateOperationsInput | string;
    nameUser?: Prisma.StringFieldUpdateOperationsInput | string;
    paternalLastNameUser?: Prisma.StringFieldUpdateOperationsInput | string;
    maternalLastNameUser?: Prisma.StringFieldUpdateOperationsInput | string;
    sexUser?: Prisma.StringFieldUpdateOperationsInput | string;
    positionUser?: Prisma.IntFieldUpdateOperationsInput | number;
    rolUser?: Prisma.IntFieldUpdateOperationsInput | number;
    emailUser?: Prisma.StringFieldUpdateOperationsInput | string;
    cellularUser?: Prisma.StringFieldUpdateOperationsInput | string;
    userLogin?: Prisma.StringFieldUpdateOperationsInput | string;
    password?: Prisma.StringFieldUpdateOperationsInput | string;
    photograph?: Prisma.NullableBytesFieldUpdateOperationsInput | runtime.Bytes | null;
    failedAttempts?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    isLocked?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    lockedUntil?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lastLoginDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lastLoginIp?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    passwordExpiresAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    twoFactorSecret?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    stateUser?: Prisma.IntFieldUpdateOperationsInput | number;
    codUsuarioCargaDl?: Prisma.StringFieldUpdateOperationsInput | string;
    fehProcesoCargaDl?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    fehProcesoModifDl?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    desAccion?: Prisma.StringFieldUpdateOperationsInput | string;
    flgStatutActif?: Prisma.IntFieldUpdateOperationsInput | number;
    parentCompany?: Prisma.MdParentCompanyUpdateOneRequiredWithoutUsersNestedInput;
    accessLogs?: Prisma.LgUserAccessUpdateManyWithoutUserNestedInput;
};
export type MdUserReoUncheckedUpdateInput = {
    idDlkUserReo?: Prisma.IntFieldUpdateOperationsInput | number;
    codUserReo?: Prisma.StringFieldUpdateOperationsInput | string;
    idDlkParentCompany?: Prisma.IntFieldUpdateOperationsInput | number;
    codParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    documentType?: Prisma.IntFieldUpdateOperationsInput | number;
    documentNumber?: Prisma.StringFieldUpdateOperationsInput | string;
    nameUser?: Prisma.StringFieldUpdateOperationsInput | string;
    paternalLastNameUser?: Prisma.StringFieldUpdateOperationsInput | string;
    maternalLastNameUser?: Prisma.StringFieldUpdateOperationsInput | string;
    sexUser?: Prisma.StringFieldUpdateOperationsInput | string;
    positionUser?: Prisma.IntFieldUpdateOperationsInput | number;
    rolUser?: Prisma.IntFieldUpdateOperationsInput | number;
    emailUser?: Prisma.StringFieldUpdateOperationsInput | string;
    cellularUser?: Prisma.StringFieldUpdateOperationsInput | string;
    userLogin?: Prisma.StringFieldUpdateOperationsInput | string;
    password?: Prisma.StringFieldUpdateOperationsInput | string;
    photograph?: Prisma.NullableBytesFieldUpdateOperationsInput | runtime.Bytes | null;
    failedAttempts?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    isLocked?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    lockedUntil?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lastLoginDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lastLoginIp?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    passwordExpiresAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    twoFactorSecret?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    stateUser?: Prisma.IntFieldUpdateOperationsInput | number;
    codUsuarioCargaDl?: Prisma.StringFieldUpdateOperationsInput | string;
    fehProcesoCargaDl?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    fehProcesoModifDl?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    desAccion?: Prisma.StringFieldUpdateOperationsInput | string;
    flgStatutActif?: Prisma.IntFieldUpdateOperationsInput | number;
    accessLogs?: Prisma.LgUserAccessUncheckedUpdateManyWithoutUserNestedInput;
};
export type MdUserReoCreateManyInput = {
    idDlkUserReo?: number;
    codUserReo: string;
    idDlkParentCompany: number;
    codParentCompany: string;
    documentType: number;
    documentNumber: string;
    nameUser: string;
    paternalLastNameUser: string;
    maternalLastNameUser: string;
    sexUser: string;
    positionUser: number;
    rolUser: number;
    emailUser: string;
    cellularUser: string;
    userLogin: string;
    password: string;
    photograph?: runtime.Bytes | null;
    failedAttempts?: number | null;
    isLocked?: number | null;
    lockedUntil?: Date | string | null;
    lastLoginDate?: Date | string | null;
    lastLoginIp?: string | null;
    passwordExpiresAt?: Date | string | null;
    twoFactorSecret?: string | null;
    stateUser?: number;
    codUsuarioCargaDl: string;
    fehProcesoCargaDl?: Date | string;
    fehProcesoModifDl?: Date | string;
    desAccion: string;
    flgStatutActif?: number;
};
export type MdUserReoUpdateManyMutationInput = {
    codUserReo?: Prisma.StringFieldUpdateOperationsInput | string;
    codParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    documentType?: Prisma.IntFieldUpdateOperationsInput | number;
    documentNumber?: Prisma.StringFieldUpdateOperationsInput | string;
    nameUser?: Prisma.StringFieldUpdateOperationsInput | string;
    paternalLastNameUser?: Prisma.StringFieldUpdateOperationsInput | string;
    maternalLastNameUser?: Prisma.StringFieldUpdateOperationsInput | string;
    sexUser?: Prisma.StringFieldUpdateOperationsInput | string;
    positionUser?: Prisma.IntFieldUpdateOperationsInput | number;
    rolUser?: Prisma.IntFieldUpdateOperationsInput | number;
    emailUser?: Prisma.StringFieldUpdateOperationsInput | string;
    cellularUser?: Prisma.StringFieldUpdateOperationsInput | string;
    userLogin?: Prisma.StringFieldUpdateOperationsInput | string;
    password?: Prisma.StringFieldUpdateOperationsInput | string;
    photograph?: Prisma.NullableBytesFieldUpdateOperationsInput | runtime.Bytes | null;
    failedAttempts?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    isLocked?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    lockedUntil?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lastLoginDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lastLoginIp?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    passwordExpiresAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    twoFactorSecret?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    stateUser?: Prisma.IntFieldUpdateOperationsInput | number;
    codUsuarioCargaDl?: Prisma.StringFieldUpdateOperationsInput | string;
    fehProcesoCargaDl?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    fehProcesoModifDl?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    desAccion?: Prisma.StringFieldUpdateOperationsInput | string;
    flgStatutActif?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type MdUserReoUncheckedUpdateManyInput = {
    idDlkUserReo?: Prisma.IntFieldUpdateOperationsInput | number;
    codUserReo?: Prisma.StringFieldUpdateOperationsInput | string;
    idDlkParentCompany?: Prisma.IntFieldUpdateOperationsInput | number;
    codParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    documentType?: Prisma.IntFieldUpdateOperationsInput | number;
    documentNumber?: Prisma.StringFieldUpdateOperationsInput | string;
    nameUser?: Prisma.StringFieldUpdateOperationsInput | string;
    paternalLastNameUser?: Prisma.StringFieldUpdateOperationsInput | string;
    maternalLastNameUser?: Prisma.StringFieldUpdateOperationsInput | string;
    sexUser?: Prisma.StringFieldUpdateOperationsInput | string;
    positionUser?: Prisma.IntFieldUpdateOperationsInput | number;
    rolUser?: Prisma.IntFieldUpdateOperationsInput | number;
    emailUser?: Prisma.StringFieldUpdateOperationsInput | string;
    cellularUser?: Prisma.StringFieldUpdateOperationsInput | string;
    userLogin?: Prisma.StringFieldUpdateOperationsInput | string;
    password?: Prisma.StringFieldUpdateOperationsInput | string;
    photograph?: Prisma.NullableBytesFieldUpdateOperationsInput | runtime.Bytes | null;
    failedAttempts?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    isLocked?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    lockedUntil?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lastLoginDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lastLoginIp?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    passwordExpiresAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    twoFactorSecret?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    stateUser?: Prisma.IntFieldUpdateOperationsInput | number;
    codUsuarioCargaDl?: Prisma.StringFieldUpdateOperationsInput | string;
    fehProcesoCargaDl?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    fehProcesoModifDl?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    desAccion?: Prisma.StringFieldUpdateOperationsInput | string;
    flgStatutActif?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type MdUserReoListRelationFilter = {
    every?: Prisma.MdUserReoWhereInput;
    some?: Prisma.MdUserReoWhereInput;
    none?: Prisma.MdUserReoWhereInput;
};
export type MdUserReoOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type MdUserReoOrderByRelevanceInput = {
    fields: Prisma.MdUserReoOrderByRelevanceFieldEnum | Prisma.MdUserReoOrderByRelevanceFieldEnum[];
    sort: Prisma.SortOrder;
    search: string;
};
export type MdUserReoCountOrderByAggregateInput = {
    idDlkUserReo?: Prisma.SortOrder;
    codUserReo?: Prisma.SortOrder;
    idDlkParentCompany?: Prisma.SortOrder;
    codParentCompany?: Prisma.SortOrder;
    documentType?: Prisma.SortOrder;
    documentNumber?: Prisma.SortOrder;
    nameUser?: Prisma.SortOrder;
    paternalLastNameUser?: Prisma.SortOrder;
    maternalLastNameUser?: Prisma.SortOrder;
    sexUser?: Prisma.SortOrder;
    positionUser?: Prisma.SortOrder;
    rolUser?: Prisma.SortOrder;
    emailUser?: Prisma.SortOrder;
    cellularUser?: Prisma.SortOrder;
    userLogin?: Prisma.SortOrder;
    password?: Prisma.SortOrder;
    photograph?: Prisma.SortOrder;
    failedAttempts?: Prisma.SortOrder;
    isLocked?: Prisma.SortOrder;
    lockedUntil?: Prisma.SortOrder;
    lastLoginDate?: Prisma.SortOrder;
    lastLoginIp?: Prisma.SortOrder;
    passwordExpiresAt?: Prisma.SortOrder;
    twoFactorSecret?: Prisma.SortOrder;
    stateUser?: Prisma.SortOrder;
    codUsuarioCargaDl?: Prisma.SortOrder;
    fehProcesoCargaDl?: Prisma.SortOrder;
    fehProcesoModifDl?: Prisma.SortOrder;
    desAccion?: Prisma.SortOrder;
    flgStatutActif?: Prisma.SortOrder;
};
export type MdUserReoAvgOrderByAggregateInput = {
    idDlkUserReo?: Prisma.SortOrder;
    idDlkParentCompany?: Prisma.SortOrder;
    documentType?: Prisma.SortOrder;
    positionUser?: Prisma.SortOrder;
    rolUser?: Prisma.SortOrder;
    failedAttempts?: Prisma.SortOrder;
    isLocked?: Prisma.SortOrder;
    stateUser?: Prisma.SortOrder;
    flgStatutActif?: Prisma.SortOrder;
};
export type MdUserReoMaxOrderByAggregateInput = {
    idDlkUserReo?: Prisma.SortOrder;
    codUserReo?: Prisma.SortOrder;
    idDlkParentCompany?: Prisma.SortOrder;
    codParentCompany?: Prisma.SortOrder;
    documentType?: Prisma.SortOrder;
    documentNumber?: Prisma.SortOrder;
    nameUser?: Prisma.SortOrder;
    paternalLastNameUser?: Prisma.SortOrder;
    maternalLastNameUser?: Prisma.SortOrder;
    sexUser?: Prisma.SortOrder;
    positionUser?: Prisma.SortOrder;
    rolUser?: Prisma.SortOrder;
    emailUser?: Prisma.SortOrder;
    cellularUser?: Prisma.SortOrder;
    userLogin?: Prisma.SortOrder;
    password?: Prisma.SortOrder;
    photograph?: Prisma.SortOrder;
    failedAttempts?: Prisma.SortOrder;
    isLocked?: Prisma.SortOrder;
    lockedUntil?: Prisma.SortOrder;
    lastLoginDate?: Prisma.SortOrder;
    lastLoginIp?: Prisma.SortOrder;
    passwordExpiresAt?: Prisma.SortOrder;
    twoFactorSecret?: Prisma.SortOrder;
    stateUser?: Prisma.SortOrder;
    codUsuarioCargaDl?: Prisma.SortOrder;
    fehProcesoCargaDl?: Prisma.SortOrder;
    fehProcesoModifDl?: Prisma.SortOrder;
    desAccion?: Prisma.SortOrder;
    flgStatutActif?: Prisma.SortOrder;
};
export type MdUserReoMinOrderByAggregateInput = {
    idDlkUserReo?: Prisma.SortOrder;
    codUserReo?: Prisma.SortOrder;
    idDlkParentCompany?: Prisma.SortOrder;
    codParentCompany?: Prisma.SortOrder;
    documentType?: Prisma.SortOrder;
    documentNumber?: Prisma.SortOrder;
    nameUser?: Prisma.SortOrder;
    paternalLastNameUser?: Prisma.SortOrder;
    maternalLastNameUser?: Prisma.SortOrder;
    sexUser?: Prisma.SortOrder;
    positionUser?: Prisma.SortOrder;
    rolUser?: Prisma.SortOrder;
    emailUser?: Prisma.SortOrder;
    cellularUser?: Prisma.SortOrder;
    userLogin?: Prisma.SortOrder;
    password?: Prisma.SortOrder;
    photograph?: Prisma.SortOrder;
    failedAttempts?: Prisma.SortOrder;
    isLocked?: Prisma.SortOrder;
    lockedUntil?: Prisma.SortOrder;
    lastLoginDate?: Prisma.SortOrder;
    lastLoginIp?: Prisma.SortOrder;
    passwordExpiresAt?: Prisma.SortOrder;
    twoFactorSecret?: Prisma.SortOrder;
    stateUser?: Prisma.SortOrder;
    codUsuarioCargaDl?: Prisma.SortOrder;
    fehProcesoCargaDl?: Prisma.SortOrder;
    fehProcesoModifDl?: Prisma.SortOrder;
    desAccion?: Prisma.SortOrder;
    flgStatutActif?: Prisma.SortOrder;
};
export type MdUserReoSumOrderByAggregateInput = {
    idDlkUserReo?: Prisma.SortOrder;
    idDlkParentCompany?: Prisma.SortOrder;
    documentType?: Prisma.SortOrder;
    positionUser?: Prisma.SortOrder;
    rolUser?: Prisma.SortOrder;
    failedAttempts?: Prisma.SortOrder;
    isLocked?: Prisma.SortOrder;
    stateUser?: Prisma.SortOrder;
    flgStatutActif?: Prisma.SortOrder;
};
export type MdUserReoScalarRelationFilter = {
    is?: Prisma.MdUserReoWhereInput;
    isNot?: Prisma.MdUserReoWhereInput;
};
export type MdUserReoCreateNestedManyWithoutParentCompanyInput = {
    create?: Prisma.XOR<Prisma.MdUserReoCreateWithoutParentCompanyInput, Prisma.MdUserReoUncheckedCreateWithoutParentCompanyInput> | Prisma.MdUserReoCreateWithoutParentCompanyInput[] | Prisma.MdUserReoUncheckedCreateWithoutParentCompanyInput[];
    connectOrCreate?: Prisma.MdUserReoCreateOrConnectWithoutParentCompanyInput | Prisma.MdUserReoCreateOrConnectWithoutParentCompanyInput[];
    createMany?: Prisma.MdUserReoCreateManyParentCompanyInputEnvelope;
    connect?: Prisma.MdUserReoWhereUniqueInput | Prisma.MdUserReoWhereUniqueInput[];
};
export type MdUserReoUncheckedCreateNestedManyWithoutParentCompanyInput = {
    create?: Prisma.XOR<Prisma.MdUserReoCreateWithoutParentCompanyInput, Prisma.MdUserReoUncheckedCreateWithoutParentCompanyInput> | Prisma.MdUserReoCreateWithoutParentCompanyInput[] | Prisma.MdUserReoUncheckedCreateWithoutParentCompanyInput[];
    connectOrCreate?: Prisma.MdUserReoCreateOrConnectWithoutParentCompanyInput | Prisma.MdUserReoCreateOrConnectWithoutParentCompanyInput[];
    createMany?: Prisma.MdUserReoCreateManyParentCompanyInputEnvelope;
    connect?: Prisma.MdUserReoWhereUniqueInput | Prisma.MdUserReoWhereUniqueInput[];
};
export type MdUserReoUpdateManyWithoutParentCompanyNestedInput = {
    create?: Prisma.XOR<Prisma.MdUserReoCreateWithoutParentCompanyInput, Prisma.MdUserReoUncheckedCreateWithoutParentCompanyInput> | Prisma.MdUserReoCreateWithoutParentCompanyInput[] | Prisma.MdUserReoUncheckedCreateWithoutParentCompanyInput[];
    connectOrCreate?: Prisma.MdUserReoCreateOrConnectWithoutParentCompanyInput | Prisma.MdUserReoCreateOrConnectWithoutParentCompanyInput[];
    upsert?: Prisma.MdUserReoUpsertWithWhereUniqueWithoutParentCompanyInput | Prisma.MdUserReoUpsertWithWhereUniqueWithoutParentCompanyInput[];
    createMany?: Prisma.MdUserReoCreateManyParentCompanyInputEnvelope;
    set?: Prisma.MdUserReoWhereUniqueInput | Prisma.MdUserReoWhereUniqueInput[];
    disconnect?: Prisma.MdUserReoWhereUniqueInput | Prisma.MdUserReoWhereUniqueInput[];
    delete?: Prisma.MdUserReoWhereUniqueInput | Prisma.MdUserReoWhereUniqueInput[];
    connect?: Prisma.MdUserReoWhereUniqueInput | Prisma.MdUserReoWhereUniqueInput[];
    update?: Prisma.MdUserReoUpdateWithWhereUniqueWithoutParentCompanyInput | Prisma.MdUserReoUpdateWithWhereUniqueWithoutParentCompanyInput[];
    updateMany?: Prisma.MdUserReoUpdateManyWithWhereWithoutParentCompanyInput | Prisma.MdUserReoUpdateManyWithWhereWithoutParentCompanyInput[];
    deleteMany?: Prisma.MdUserReoScalarWhereInput | Prisma.MdUserReoScalarWhereInput[];
};
export type MdUserReoUncheckedUpdateManyWithoutParentCompanyNestedInput = {
    create?: Prisma.XOR<Prisma.MdUserReoCreateWithoutParentCompanyInput, Prisma.MdUserReoUncheckedCreateWithoutParentCompanyInput> | Prisma.MdUserReoCreateWithoutParentCompanyInput[] | Prisma.MdUserReoUncheckedCreateWithoutParentCompanyInput[];
    connectOrCreate?: Prisma.MdUserReoCreateOrConnectWithoutParentCompanyInput | Prisma.MdUserReoCreateOrConnectWithoutParentCompanyInput[];
    upsert?: Prisma.MdUserReoUpsertWithWhereUniqueWithoutParentCompanyInput | Prisma.MdUserReoUpsertWithWhereUniqueWithoutParentCompanyInput[];
    createMany?: Prisma.MdUserReoCreateManyParentCompanyInputEnvelope;
    set?: Prisma.MdUserReoWhereUniqueInput | Prisma.MdUserReoWhereUniqueInput[];
    disconnect?: Prisma.MdUserReoWhereUniqueInput | Prisma.MdUserReoWhereUniqueInput[];
    delete?: Prisma.MdUserReoWhereUniqueInput | Prisma.MdUserReoWhereUniqueInput[];
    connect?: Prisma.MdUserReoWhereUniqueInput | Prisma.MdUserReoWhereUniqueInput[];
    update?: Prisma.MdUserReoUpdateWithWhereUniqueWithoutParentCompanyInput | Prisma.MdUserReoUpdateWithWhereUniqueWithoutParentCompanyInput[];
    updateMany?: Prisma.MdUserReoUpdateManyWithWhereWithoutParentCompanyInput | Prisma.MdUserReoUpdateManyWithWhereWithoutParentCompanyInput[];
    deleteMany?: Prisma.MdUserReoScalarWhereInput | Prisma.MdUserReoScalarWhereInput[];
};
export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
};
export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null;
};
export type MdUserReoCreateNestedOneWithoutAccessLogsInput = {
    create?: Prisma.XOR<Prisma.MdUserReoCreateWithoutAccessLogsInput, Prisma.MdUserReoUncheckedCreateWithoutAccessLogsInput>;
    connectOrCreate?: Prisma.MdUserReoCreateOrConnectWithoutAccessLogsInput;
    connect?: Prisma.MdUserReoWhereUniqueInput;
};
export type MdUserReoUpdateOneRequiredWithoutAccessLogsNestedInput = {
    create?: Prisma.XOR<Prisma.MdUserReoCreateWithoutAccessLogsInput, Prisma.MdUserReoUncheckedCreateWithoutAccessLogsInput>;
    connectOrCreate?: Prisma.MdUserReoCreateOrConnectWithoutAccessLogsInput;
    upsert?: Prisma.MdUserReoUpsertWithoutAccessLogsInput;
    connect?: Prisma.MdUserReoWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.MdUserReoUpdateToOneWithWhereWithoutAccessLogsInput, Prisma.MdUserReoUpdateWithoutAccessLogsInput>, Prisma.MdUserReoUncheckedUpdateWithoutAccessLogsInput>;
};
export type MdUserReoCreateWithoutParentCompanyInput = {
    codUserReo: string;
    codParentCompany: string;
    documentType: number;
    documentNumber: string;
    nameUser: string;
    paternalLastNameUser: string;
    maternalLastNameUser: string;
    sexUser: string;
    positionUser: number;
    rolUser: number;
    emailUser: string;
    cellularUser: string;
    userLogin: string;
    password: string;
    photograph?: runtime.Bytes | null;
    failedAttempts?: number | null;
    isLocked?: number | null;
    lockedUntil?: Date | string | null;
    lastLoginDate?: Date | string | null;
    lastLoginIp?: string | null;
    passwordExpiresAt?: Date | string | null;
    twoFactorSecret?: string | null;
    stateUser?: number;
    codUsuarioCargaDl: string;
    fehProcesoCargaDl?: Date | string;
    fehProcesoModifDl?: Date | string;
    desAccion: string;
    flgStatutActif?: number;
    accessLogs?: Prisma.LgUserAccessCreateNestedManyWithoutUserInput;
};
export type MdUserReoUncheckedCreateWithoutParentCompanyInput = {
    idDlkUserReo?: number;
    codUserReo: string;
    codParentCompany: string;
    documentType: number;
    documentNumber: string;
    nameUser: string;
    paternalLastNameUser: string;
    maternalLastNameUser: string;
    sexUser: string;
    positionUser: number;
    rolUser: number;
    emailUser: string;
    cellularUser: string;
    userLogin: string;
    password: string;
    photograph?: runtime.Bytes | null;
    failedAttempts?: number | null;
    isLocked?: number | null;
    lockedUntil?: Date | string | null;
    lastLoginDate?: Date | string | null;
    lastLoginIp?: string | null;
    passwordExpiresAt?: Date | string | null;
    twoFactorSecret?: string | null;
    stateUser?: number;
    codUsuarioCargaDl: string;
    fehProcesoCargaDl?: Date | string;
    fehProcesoModifDl?: Date | string;
    desAccion: string;
    flgStatutActif?: number;
    accessLogs?: Prisma.LgUserAccessUncheckedCreateNestedManyWithoutUserInput;
};
export type MdUserReoCreateOrConnectWithoutParentCompanyInput = {
    where: Prisma.MdUserReoWhereUniqueInput;
    create: Prisma.XOR<Prisma.MdUserReoCreateWithoutParentCompanyInput, Prisma.MdUserReoUncheckedCreateWithoutParentCompanyInput>;
};
export type MdUserReoCreateManyParentCompanyInputEnvelope = {
    data: Prisma.MdUserReoCreateManyParentCompanyInput | Prisma.MdUserReoCreateManyParentCompanyInput[];
    skipDuplicates?: boolean;
};
export type MdUserReoUpsertWithWhereUniqueWithoutParentCompanyInput = {
    where: Prisma.MdUserReoWhereUniqueInput;
    update: Prisma.XOR<Prisma.MdUserReoUpdateWithoutParentCompanyInput, Prisma.MdUserReoUncheckedUpdateWithoutParentCompanyInput>;
    create: Prisma.XOR<Prisma.MdUserReoCreateWithoutParentCompanyInput, Prisma.MdUserReoUncheckedCreateWithoutParentCompanyInput>;
};
export type MdUserReoUpdateWithWhereUniqueWithoutParentCompanyInput = {
    where: Prisma.MdUserReoWhereUniqueInput;
    data: Prisma.XOR<Prisma.MdUserReoUpdateWithoutParentCompanyInput, Prisma.MdUserReoUncheckedUpdateWithoutParentCompanyInput>;
};
export type MdUserReoUpdateManyWithWhereWithoutParentCompanyInput = {
    where: Prisma.MdUserReoScalarWhereInput;
    data: Prisma.XOR<Prisma.MdUserReoUpdateManyMutationInput, Prisma.MdUserReoUncheckedUpdateManyWithoutParentCompanyInput>;
};
export type MdUserReoScalarWhereInput = {
    AND?: Prisma.MdUserReoScalarWhereInput | Prisma.MdUserReoScalarWhereInput[];
    OR?: Prisma.MdUserReoScalarWhereInput[];
    NOT?: Prisma.MdUserReoScalarWhereInput | Prisma.MdUserReoScalarWhereInput[];
    idDlkUserReo?: Prisma.IntFilter<"MdUserReo"> | number;
    codUserReo?: Prisma.StringFilter<"MdUserReo"> | string;
    idDlkParentCompany?: Prisma.IntFilter<"MdUserReo"> | number;
    codParentCompany?: Prisma.StringFilter<"MdUserReo"> | string;
    documentType?: Prisma.IntFilter<"MdUserReo"> | number;
    documentNumber?: Prisma.StringFilter<"MdUserReo"> | string;
    nameUser?: Prisma.StringFilter<"MdUserReo"> | string;
    paternalLastNameUser?: Prisma.StringFilter<"MdUserReo"> | string;
    maternalLastNameUser?: Prisma.StringFilter<"MdUserReo"> | string;
    sexUser?: Prisma.StringFilter<"MdUserReo"> | string;
    positionUser?: Prisma.IntFilter<"MdUserReo"> | number;
    rolUser?: Prisma.IntFilter<"MdUserReo"> | number;
    emailUser?: Prisma.StringFilter<"MdUserReo"> | string;
    cellularUser?: Prisma.StringFilter<"MdUserReo"> | string;
    userLogin?: Prisma.StringFilter<"MdUserReo"> | string;
    password?: Prisma.StringFilter<"MdUserReo"> | string;
    photograph?: Prisma.BytesNullableFilter<"MdUserReo"> | runtime.Bytes | null;
    failedAttempts?: Prisma.IntNullableFilter<"MdUserReo"> | number | null;
    isLocked?: Prisma.IntNullableFilter<"MdUserReo"> | number | null;
    lockedUntil?: Prisma.DateTimeNullableFilter<"MdUserReo"> | Date | string | null;
    lastLoginDate?: Prisma.DateTimeNullableFilter<"MdUserReo"> | Date | string | null;
    lastLoginIp?: Prisma.StringNullableFilter<"MdUserReo"> | string | null;
    passwordExpiresAt?: Prisma.DateTimeNullableFilter<"MdUserReo"> | Date | string | null;
    twoFactorSecret?: Prisma.StringNullableFilter<"MdUserReo"> | string | null;
    stateUser?: Prisma.IntFilter<"MdUserReo"> | number;
    codUsuarioCargaDl?: Prisma.StringFilter<"MdUserReo"> | string;
    fehProcesoCargaDl?: Prisma.DateTimeFilter<"MdUserReo"> | Date | string;
    fehProcesoModifDl?: Prisma.DateTimeFilter<"MdUserReo"> | Date | string;
    desAccion?: Prisma.StringFilter<"MdUserReo"> | string;
    flgStatutActif?: Prisma.IntFilter<"MdUserReo"> | number;
};
export type MdUserReoCreateWithoutAccessLogsInput = {
    codUserReo: string;
    codParentCompany: string;
    documentType: number;
    documentNumber: string;
    nameUser: string;
    paternalLastNameUser: string;
    maternalLastNameUser: string;
    sexUser: string;
    positionUser: number;
    rolUser: number;
    emailUser: string;
    cellularUser: string;
    userLogin: string;
    password: string;
    photograph?: runtime.Bytes | null;
    failedAttempts?: number | null;
    isLocked?: number | null;
    lockedUntil?: Date | string | null;
    lastLoginDate?: Date | string | null;
    lastLoginIp?: string | null;
    passwordExpiresAt?: Date | string | null;
    twoFactorSecret?: string | null;
    stateUser?: number;
    codUsuarioCargaDl: string;
    fehProcesoCargaDl?: Date | string;
    fehProcesoModifDl?: Date | string;
    desAccion: string;
    flgStatutActif?: number;
    parentCompany: Prisma.MdParentCompanyCreateNestedOneWithoutUsersInput;
};
export type MdUserReoUncheckedCreateWithoutAccessLogsInput = {
    idDlkUserReo?: number;
    codUserReo: string;
    idDlkParentCompany: number;
    codParentCompany: string;
    documentType: number;
    documentNumber: string;
    nameUser: string;
    paternalLastNameUser: string;
    maternalLastNameUser: string;
    sexUser: string;
    positionUser: number;
    rolUser: number;
    emailUser: string;
    cellularUser: string;
    userLogin: string;
    password: string;
    photograph?: runtime.Bytes | null;
    failedAttempts?: number | null;
    isLocked?: number | null;
    lockedUntil?: Date | string | null;
    lastLoginDate?: Date | string | null;
    lastLoginIp?: string | null;
    passwordExpiresAt?: Date | string | null;
    twoFactorSecret?: string | null;
    stateUser?: number;
    codUsuarioCargaDl: string;
    fehProcesoCargaDl?: Date | string;
    fehProcesoModifDl?: Date | string;
    desAccion: string;
    flgStatutActif?: number;
};
export type MdUserReoCreateOrConnectWithoutAccessLogsInput = {
    where: Prisma.MdUserReoWhereUniqueInput;
    create: Prisma.XOR<Prisma.MdUserReoCreateWithoutAccessLogsInput, Prisma.MdUserReoUncheckedCreateWithoutAccessLogsInput>;
};
export type MdUserReoUpsertWithoutAccessLogsInput = {
    update: Prisma.XOR<Prisma.MdUserReoUpdateWithoutAccessLogsInput, Prisma.MdUserReoUncheckedUpdateWithoutAccessLogsInput>;
    create: Prisma.XOR<Prisma.MdUserReoCreateWithoutAccessLogsInput, Prisma.MdUserReoUncheckedCreateWithoutAccessLogsInput>;
    where?: Prisma.MdUserReoWhereInput;
};
export type MdUserReoUpdateToOneWithWhereWithoutAccessLogsInput = {
    where?: Prisma.MdUserReoWhereInput;
    data: Prisma.XOR<Prisma.MdUserReoUpdateWithoutAccessLogsInput, Prisma.MdUserReoUncheckedUpdateWithoutAccessLogsInput>;
};
export type MdUserReoUpdateWithoutAccessLogsInput = {
    codUserReo?: Prisma.StringFieldUpdateOperationsInput | string;
    codParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    documentType?: Prisma.IntFieldUpdateOperationsInput | number;
    documentNumber?: Prisma.StringFieldUpdateOperationsInput | string;
    nameUser?: Prisma.StringFieldUpdateOperationsInput | string;
    paternalLastNameUser?: Prisma.StringFieldUpdateOperationsInput | string;
    maternalLastNameUser?: Prisma.StringFieldUpdateOperationsInput | string;
    sexUser?: Prisma.StringFieldUpdateOperationsInput | string;
    positionUser?: Prisma.IntFieldUpdateOperationsInput | number;
    rolUser?: Prisma.IntFieldUpdateOperationsInput | number;
    emailUser?: Prisma.StringFieldUpdateOperationsInput | string;
    cellularUser?: Prisma.StringFieldUpdateOperationsInput | string;
    userLogin?: Prisma.StringFieldUpdateOperationsInput | string;
    password?: Prisma.StringFieldUpdateOperationsInput | string;
    photograph?: Prisma.NullableBytesFieldUpdateOperationsInput | runtime.Bytes | null;
    failedAttempts?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    isLocked?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    lockedUntil?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lastLoginDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lastLoginIp?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    passwordExpiresAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    twoFactorSecret?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    stateUser?: Prisma.IntFieldUpdateOperationsInput | number;
    codUsuarioCargaDl?: Prisma.StringFieldUpdateOperationsInput | string;
    fehProcesoCargaDl?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    fehProcesoModifDl?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    desAccion?: Prisma.StringFieldUpdateOperationsInput | string;
    flgStatutActif?: Prisma.IntFieldUpdateOperationsInput | number;
    parentCompany?: Prisma.MdParentCompanyUpdateOneRequiredWithoutUsersNestedInput;
};
export type MdUserReoUncheckedUpdateWithoutAccessLogsInput = {
    idDlkUserReo?: Prisma.IntFieldUpdateOperationsInput | number;
    codUserReo?: Prisma.StringFieldUpdateOperationsInput | string;
    idDlkParentCompany?: Prisma.IntFieldUpdateOperationsInput | number;
    codParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    documentType?: Prisma.IntFieldUpdateOperationsInput | number;
    documentNumber?: Prisma.StringFieldUpdateOperationsInput | string;
    nameUser?: Prisma.StringFieldUpdateOperationsInput | string;
    paternalLastNameUser?: Prisma.StringFieldUpdateOperationsInput | string;
    maternalLastNameUser?: Prisma.StringFieldUpdateOperationsInput | string;
    sexUser?: Prisma.StringFieldUpdateOperationsInput | string;
    positionUser?: Prisma.IntFieldUpdateOperationsInput | number;
    rolUser?: Prisma.IntFieldUpdateOperationsInput | number;
    emailUser?: Prisma.StringFieldUpdateOperationsInput | string;
    cellularUser?: Prisma.StringFieldUpdateOperationsInput | string;
    userLogin?: Prisma.StringFieldUpdateOperationsInput | string;
    password?: Prisma.StringFieldUpdateOperationsInput | string;
    photograph?: Prisma.NullableBytesFieldUpdateOperationsInput | runtime.Bytes | null;
    failedAttempts?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    isLocked?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    lockedUntil?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lastLoginDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lastLoginIp?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    passwordExpiresAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    twoFactorSecret?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    stateUser?: Prisma.IntFieldUpdateOperationsInput | number;
    codUsuarioCargaDl?: Prisma.StringFieldUpdateOperationsInput | string;
    fehProcesoCargaDl?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    fehProcesoModifDl?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    desAccion?: Prisma.StringFieldUpdateOperationsInput | string;
    flgStatutActif?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type MdUserReoCreateManyParentCompanyInput = {
    idDlkUserReo?: number;
    codUserReo: string;
    codParentCompany: string;
    documentType: number;
    documentNumber: string;
    nameUser: string;
    paternalLastNameUser: string;
    maternalLastNameUser: string;
    sexUser: string;
    positionUser: number;
    rolUser: number;
    emailUser: string;
    cellularUser: string;
    userLogin: string;
    password: string;
    photograph?: runtime.Bytes | null;
    failedAttempts?: number | null;
    isLocked?: number | null;
    lockedUntil?: Date | string | null;
    lastLoginDate?: Date | string | null;
    lastLoginIp?: string | null;
    passwordExpiresAt?: Date | string | null;
    twoFactorSecret?: string | null;
    stateUser?: number;
    codUsuarioCargaDl: string;
    fehProcesoCargaDl?: Date | string;
    fehProcesoModifDl?: Date | string;
    desAccion: string;
    flgStatutActif?: number;
};
export type MdUserReoUpdateWithoutParentCompanyInput = {
    codUserReo?: Prisma.StringFieldUpdateOperationsInput | string;
    codParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    documentType?: Prisma.IntFieldUpdateOperationsInput | number;
    documentNumber?: Prisma.StringFieldUpdateOperationsInput | string;
    nameUser?: Prisma.StringFieldUpdateOperationsInput | string;
    paternalLastNameUser?: Prisma.StringFieldUpdateOperationsInput | string;
    maternalLastNameUser?: Prisma.StringFieldUpdateOperationsInput | string;
    sexUser?: Prisma.StringFieldUpdateOperationsInput | string;
    positionUser?: Prisma.IntFieldUpdateOperationsInput | number;
    rolUser?: Prisma.IntFieldUpdateOperationsInput | number;
    emailUser?: Prisma.StringFieldUpdateOperationsInput | string;
    cellularUser?: Prisma.StringFieldUpdateOperationsInput | string;
    userLogin?: Prisma.StringFieldUpdateOperationsInput | string;
    password?: Prisma.StringFieldUpdateOperationsInput | string;
    photograph?: Prisma.NullableBytesFieldUpdateOperationsInput | runtime.Bytes | null;
    failedAttempts?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    isLocked?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    lockedUntil?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lastLoginDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lastLoginIp?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    passwordExpiresAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    twoFactorSecret?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    stateUser?: Prisma.IntFieldUpdateOperationsInput | number;
    codUsuarioCargaDl?: Prisma.StringFieldUpdateOperationsInput | string;
    fehProcesoCargaDl?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    fehProcesoModifDl?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    desAccion?: Prisma.StringFieldUpdateOperationsInput | string;
    flgStatutActif?: Prisma.IntFieldUpdateOperationsInput | number;
    accessLogs?: Prisma.LgUserAccessUpdateManyWithoutUserNestedInput;
};
export type MdUserReoUncheckedUpdateWithoutParentCompanyInput = {
    idDlkUserReo?: Prisma.IntFieldUpdateOperationsInput | number;
    codUserReo?: Prisma.StringFieldUpdateOperationsInput | string;
    codParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    documentType?: Prisma.IntFieldUpdateOperationsInput | number;
    documentNumber?: Prisma.StringFieldUpdateOperationsInput | string;
    nameUser?: Prisma.StringFieldUpdateOperationsInput | string;
    paternalLastNameUser?: Prisma.StringFieldUpdateOperationsInput | string;
    maternalLastNameUser?: Prisma.StringFieldUpdateOperationsInput | string;
    sexUser?: Prisma.StringFieldUpdateOperationsInput | string;
    positionUser?: Prisma.IntFieldUpdateOperationsInput | number;
    rolUser?: Prisma.IntFieldUpdateOperationsInput | number;
    emailUser?: Prisma.StringFieldUpdateOperationsInput | string;
    cellularUser?: Prisma.StringFieldUpdateOperationsInput | string;
    userLogin?: Prisma.StringFieldUpdateOperationsInput | string;
    password?: Prisma.StringFieldUpdateOperationsInput | string;
    photograph?: Prisma.NullableBytesFieldUpdateOperationsInput | runtime.Bytes | null;
    failedAttempts?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    isLocked?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    lockedUntil?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lastLoginDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lastLoginIp?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    passwordExpiresAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    twoFactorSecret?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    stateUser?: Prisma.IntFieldUpdateOperationsInput | number;
    codUsuarioCargaDl?: Prisma.StringFieldUpdateOperationsInput | string;
    fehProcesoCargaDl?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    fehProcesoModifDl?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    desAccion?: Prisma.StringFieldUpdateOperationsInput | string;
    flgStatutActif?: Prisma.IntFieldUpdateOperationsInput | number;
    accessLogs?: Prisma.LgUserAccessUncheckedUpdateManyWithoutUserNestedInput;
};
export type MdUserReoUncheckedUpdateManyWithoutParentCompanyInput = {
    idDlkUserReo?: Prisma.IntFieldUpdateOperationsInput | number;
    codUserReo?: Prisma.StringFieldUpdateOperationsInput | string;
    codParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    documentType?: Prisma.IntFieldUpdateOperationsInput | number;
    documentNumber?: Prisma.StringFieldUpdateOperationsInput | string;
    nameUser?: Prisma.StringFieldUpdateOperationsInput | string;
    paternalLastNameUser?: Prisma.StringFieldUpdateOperationsInput | string;
    maternalLastNameUser?: Prisma.StringFieldUpdateOperationsInput | string;
    sexUser?: Prisma.StringFieldUpdateOperationsInput | string;
    positionUser?: Prisma.IntFieldUpdateOperationsInput | number;
    rolUser?: Prisma.IntFieldUpdateOperationsInput | number;
    emailUser?: Prisma.StringFieldUpdateOperationsInput | string;
    cellularUser?: Prisma.StringFieldUpdateOperationsInput | string;
    userLogin?: Prisma.StringFieldUpdateOperationsInput | string;
    password?: Prisma.StringFieldUpdateOperationsInput | string;
    photograph?: Prisma.NullableBytesFieldUpdateOperationsInput | runtime.Bytes | null;
    failedAttempts?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    isLocked?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    lockedUntil?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lastLoginDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lastLoginIp?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    passwordExpiresAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    twoFactorSecret?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    stateUser?: Prisma.IntFieldUpdateOperationsInput | number;
    codUsuarioCargaDl?: Prisma.StringFieldUpdateOperationsInput | string;
    fehProcesoCargaDl?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    fehProcesoModifDl?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    desAccion?: Prisma.StringFieldUpdateOperationsInput | string;
    flgStatutActif?: Prisma.IntFieldUpdateOperationsInput | number;
};
/**
 * Count Type MdUserReoCountOutputType
 */
export type MdUserReoCountOutputType = {
    accessLogs: number;
};
export type MdUserReoCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    accessLogs?: boolean | MdUserReoCountOutputTypeCountAccessLogsArgs;
};
/**
 * MdUserReoCountOutputType without action
 */
export type MdUserReoCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MdUserReoCountOutputType
     */
    select?: Prisma.MdUserReoCountOutputTypeSelect<ExtArgs> | null;
};
/**
 * MdUserReoCountOutputType without action
 */
export type MdUserReoCountOutputTypeCountAccessLogsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.LgUserAccessWhereInput;
};
export type MdUserReoSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    idDlkUserReo?: boolean;
    codUserReo?: boolean;
    idDlkParentCompany?: boolean;
    codParentCompany?: boolean;
    documentType?: boolean;
    documentNumber?: boolean;
    nameUser?: boolean;
    paternalLastNameUser?: boolean;
    maternalLastNameUser?: boolean;
    sexUser?: boolean;
    positionUser?: boolean;
    rolUser?: boolean;
    emailUser?: boolean;
    cellularUser?: boolean;
    userLogin?: boolean;
    password?: boolean;
    photograph?: boolean;
    failedAttempts?: boolean;
    isLocked?: boolean;
    lockedUntil?: boolean;
    lastLoginDate?: boolean;
    lastLoginIp?: boolean;
    passwordExpiresAt?: boolean;
    twoFactorSecret?: boolean;
    stateUser?: boolean;
    codUsuarioCargaDl?: boolean;
    fehProcesoCargaDl?: boolean;
    fehProcesoModifDl?: boolean;
    desAccion?: boolean;
    flgStatutActif?: boolean;
    parentCompany?: boolean | Prisma.MdParentCompanyDefaultArgs<ExtArgs>;
    accessLogs?: boolean | Prisma.MdUserReo$accessLogsArgs<ExtArgs>;
    _count?: boolean | Prisma.MdUserReoCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["mdUserReo"]>;
export type MdUserReoSelectScalar = {
    idDlkUserReo?: boolean;
    codUserReo?: boolean;
    idDlkParentCompany?: boolean;
    codParentCompany?: boolean;
    documentType?: boolean;
    documentNumber?: boolean;
    nameUser?: boolean;
    paternalLastNameUser?: boolean;
    maternalLastNameUser?: boolean;
    sexUser?: boolean;
    positionUser?: boolean;
    rolUser?: boolean;
    emailUser?: boolean;
    cellularUser?: boolean;
    userLogin?: boolean;
    password?: boolean;
    photograph?: boolean;
    failedAttempts?: boolean;
    isLocked?: boolean;
    lockedUntil?: boolean;
    lastLoginDate?: boolean;
    lastLoginIp?: boolean;
    passwordExpiresAt?: boolean;
    twoFactorSecret?: boolean;
    stateUser?: boolean;
    codUsuarioCargaDl?: boolean;
    fehProcesoCargaDl?: boolean;
    fehProcesoModifDl?: boolean;
    desAccion?: boolean;
    flgStatutActif?: boolean;
};
export type MdUserReoOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"idDlkUserReo" | "codUserReo" | "idDlkParentCompany" | "codParentCompany" | "documentType" | "documentNumber" | "nameUser" | "paternalLastNameUser" | "maternalLastNameUser" | "sexUser" | "positionUser" | "rolUser" | "emailUser" | "cellularUser" | "userLogin" | "password" | "photograph" | "failedAttempts" | "isLocked" | "lockedUntil" | "lastLoginDate" | "lastLoginIp" | "passwordExpiresAt" | "twoFactorSecret" | "stateUser" | "codUsuarioCargaDl" | "fehProcesoCargaDl" | "fehProcesoModifDl" | "desAccion" | "flgStatutActif", ExtArgs["result"]["mdUserReo"]>;
export type MdUserReoInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    parentCompany?: boolean | Prisma.MdParentCompanyDefaultArgs<ExtArgs>;
    accessLogs?: boolean | Prisma.MdUserReo$accessLogsArgs<ExtArgs>;
    _count?: boolean | Prisma.MdUserReoCountOutputTypeDefaultArgs<ExtArgs>;
};
export type $MdUserReoPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "MdUserReo";
    objects: {
        parentCompany: Prisma.$MdParentCompanyPayload<ExtArgs>;
        accessLogs: Prisma.$LgUserAccessPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        idDlkUserReo: number;
        codUserReo: string;
        idDlkParentCompany: number;
        codParentCompany: string;
        documentType: number;
        documentNumber: string;
        nameUser: string;
        paternalLastNameUser: string;
        maternalLastNameUser: string;
        sexUser: string;
        positionUser: number;
        rolUser: number;
        emailUser: string;
        cellularUser: string;
        userLogin: string;
        password: string;
        photograph: runtime.Bytes | null;
        failedAttempts: number | null;
        isLocked: number | null;
        lockedUntil: Date | null;
        lastLoginDate: Date | null;
        lastLoginIp: string | null;
        passwordExpiresAt: Date | null;
        twoFactorSecret: string | null;
        stateUser: number;
        codUsuarioCargaDl: string;
        fehProcesoCargaDl: Date;
        fehProcesoModifDl: Date;
        desAccion: string;
        flgStatutActif: number;
    }, ExtArgs["result"]["mdUserReo"]>;
    composites: {};
};
export type MdUserReoGetPayload<S extends boolean | null | undefined | MdUserReoDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$MdUserReoPayload, S>;
export type MdUserReoCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<MdUserReoFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: MdUserReoCountAggregateInputType | true;
};
export interface MdUserReoDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['MdUserReo'];
        meta: {
            name: 'MdUserReo';
        };
    };
    /**
     * Find zero or one MdUserReo that matches the filter.
     * @param {MdUserReoFindUniqueArgs} args - Arguments to find a MdUserReo
     * @example
     * // Get one MdUserReo
     * const mdUserReo = await prisma.mdUserReo.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MdUserReoFindUniqueArgs>(args: Prisma.SelectSubset<T, MdUserReoFindUniqueArgs<ExtArgs>>): Prisma.Prisma__MdUserReoClient<runtime.Types.Result.GetResult<Prisma.$MdUserReoPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one MdUserReo that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MdUserReoFindUniqueOrThrowArgs} args - Arguments to find a MdUserReo
     * @example
     * // Get one MdUserReo
     * const mdUserReo = await prisma.mdUserReo.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MdUserReoFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, MdUserReoFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__MdUserReoClient<runtime.Types.Result.GetResult<Prisma.$MdUserReoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first MdUserReo that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MdUserReoFindFirstArgs} args - Arguments to find a MdUserReo
     * @example
     * // Get one MdUserReo
     * const mdUserReo = await prisma.mdUserReo.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MdUserReoFindFirstArgs>(args?: Prisma.SelectSubset<T, MdUserReoFindFirstArgs<ExtArgs>>): Prisma.Prisma__MdUserReoClient<runtime.Types.Result.GetResult<Prisma.$MdUserReoPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first MdUserReo that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MdUserReoFindFirstOrThrowArgs} args - Arguments to find a MdUserReo
     * @example
     * // Get one MdUserReo
     * const mdUserReo = await prisma.mdUserReo.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MdUserReoFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, MdUserReoFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__MdUserReoClient<runtime.Types.Result.GetResult<Prisma.$MdUserReoPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more MdUserReos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MdUserReoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MdUserReos
     * const mdUserReos = await prisma.mdUserReo.findMany()
     *
     * // Get first 10 MdUserReos
     * const mdUserReos = await prisma.mdUserReo.findMany({ take: 10 })
     *
     * // Only select the `idDlkUserReo`
     * const mdUserReoWithIdDlkUserReoOnly = await prisma.mdUserReo.findMany({ select: { idDlkUserReo: true } })
     *
     */
    findMany<T extends MdUserReoFindManyArgs>(args?: Prisma.SelectSubset<T, MdUserReoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MdUserReoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a MdUserReo.
     * @param {MdUserReoCreateArgs} args - Arguments to create a MdUserReo.
     * @example
     * // Create one MdUserReo
     * const MdUserReo = await prisma.mdUserReo.create({
     *   data: {
     *     // ... data to create a MdUserReo
     *   }
     * })
     *
     */
    create<T extends MdUserReoCreateArgs>(args: Prisma.SelectSubset<T, MdUserReoCreateArgs<ExtArgs>>): Prisma.Prisma__MdUserReoClient<runtime.Types.Result.GetResult<Prisma.$MdUserReoPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many MdUserReos.
     * @param {MdUserReoCreateManyArgs} args - Arguments to create many MdUserReos.
     * @example
     * // Create many MdUserReos
     * const mdUserReo = await prisma.mdUserReo.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends MdUserReoCreateManyArgs>(args?: Prisma.SelectSubset<T, MdUserReoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Delete a MdUserReo.
     * @param {MdUserReoDeleteArgs} args - Arguments to delete one MdUserReo.
     * @example
     * // Delete one MdUserReo
     * const MdUserReo = await prisma.mdUserReo.delete({
     *   where: {
     *     // ... filter to delete one MdUserReo
     *   }
     * })
     *
     */
    delete<T extends MdUserReoDeleteArgs>(args: Prisma.SelectSubset<T, MdUserReoDeleteArgs<ExtArgs>>): Prisma.Prisma__MdUserReoClient<runtime.Types.Result.GetResult<Prisma.$MdUserReoPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one MdUserReo.
     * @param {MdUserReoUpdateArgs} args - Arguments to update one MdUserReo.
     * @example
     * // Update one MdUserReo
     * const mdUserReo = await prisma.mdUserReo.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends MdUserReoUpdateArgs>(args: Prisma.SelectSubset<T, MdUserReoUpdateArgs<ExtArgs>>): Prisma.Prisma__MdUserReoClient<runtime.Types.Result.GetResult<Prisma.$MdUserReoPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more MdUserReos.
     * @param {MdUserReoDeleteManyArgs} args - Arguments to filter MdUserReos to delete.
     * @example
     * // Delete a few MdUserReos
     * const { count } = await prisma.mdUserReo.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends MdUserReoDeleteManyArgs>(args?: Prisma.SelectSubset<T, MdUserReoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more MdUserReos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MdUserReoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MdUserReos
     * const mdUserReo = await prisma.mdUserReo.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends MdUserReoUpdateManyArgs>(args: Prisma.SelectSubset<T, MdUserReoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create or update one MdUserReo.
     * @param {MdUserReoUpsertArgs} args - Arguments to update or create a MdUserReo.
     * @example
     * // Update or create a MdUserReo
     * const mdUserReo = await prisma.mdUserReo.upsert({
     *   create: {
     *     // ... data to create a MdUserReo
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MdUserReo we want to update
     *   }
     * })
     */
    upsert<T extends MdUserReoUpsertArgs>(args: Prisma.SelectSubset<T, MdUserReoUpsertArgs<ExtArgs>>): Prisma.Prisma__MdUserReoClient<runtime.Types.Result.GetResult<Prisma.$MdUserReoPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of MdUserReos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MdUserReoCountArgs} args - Arguments to filter MdUserReos to count.
     * @example
     * // Count the number of MdUserReos
     * const count = await prisma.mdUserReo.count({
     *   where: {
     *     // ... the filter for the MdUserReos we want to count
     *   }
     * })
    **/
    count<T extends MdUserReoCountArgs>(args?: Prisma.Subset<T, MdUserReoCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], MdUserReoCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a MdUserReo.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MdUserReoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MdUserReoAggregateArgs>(args: Prisma.Subset<T, MdUserReoAggregateArgs>): Prisma.PrismaPromise<GetMdUserReoAggregateType<T>>;
    /**
     * Group by MdUserReo.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MdUserReoGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
    **/
    groupBy<T extends MdUserReoGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: MdUserReoGroupByArgs['orderBy'];
    } : {
        orderBy?: MdUserReoGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, MdUserReoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMdUserReoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the MdUserReo model
     */
    readonly fields: MdUserReoFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for MdUserReo.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__MdUserReoClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    parentCompany<T extends Prisma.MdParentCompanyDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.MdParentCompanyDefaultArgs<ExtArgs>>): Prisma.Prisma__MdParentCompanyClient<runtime.Types.Result.GetResult<Prisma.$MdParentCompanyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    accessLogs<T extends Prisma.MdUserReo$accessLogsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.MdUserReo$accessLogsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$LgUserAccessPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
/**
 * Fields of the MdUserReo model
 */
export interface MdUserReoFieldRefs {
    readonly idDlkUserReo: Prisma.FieldRef<"MdUserReo", 'Int'>;
    readonly codUserReo: Prisma.FieldRef<"MdUserReo", 'String'>;
    readonly idDlkParentCompany: Prisma.FieldRef<"MdUserReo", 'Int'>;
    readonly codParentCompany: Prisma.FieldRef<"MdUserReo", 'String'>;
    readonly documentType: Prisma.FieldRef<"MdUserReo", 'Int'>;
    readonly documentNumber: Prisma.FieldRef<"MdUserReo", 'String'>;
    readonly nameUser: Prisma.FieldRef<"MdUserReo", 'String'>;
    readonly paternalLastNameUser: Prisma.FieldRef<"MdUserReo", 'String'>;
    readonly maternalLastNameUser: Prisma.FieldRef<"MdUserReo", 'String'>;
    readonly sexUser: Prisma.FieldRef<"MdUserReo", 'String'>;
    readonly positionUser: Prisma.FieldRef<"MdUserReo", 'Int'>;
    readonly rolUser: Prisma.FieldRef<"MdUserReo", 'Int'>;
    readonly emailUser: Prisma.FieldRef<"MdUserReo", 'String'>;
    readonly cellularUser: Prisma.FieldRef<"MdUserReo", 'String'>;
    readonly userLogin: Prisma.FieldRef<"MdUserReo", 'String'>;
    readonly password: Prisma.FieldRef<"MdUserReo", 'String'>;
    readonly photograph: Prisma.FieldRef<"MdUserReo", 'Bytes'>;
    readonly failedAttempts: Prisma.FieldRef<"MdUserReo", 'Int'>;
    readonly isLocked: Prisma.FieldRef<"MdUserReo", 'Int'>;
    readonly lockedUntil: Prisma.FieldRef<"MdUserReo", 'DateTime'>;
    readonly lastLoginDate: Prisma.FieldRef<"MdUserReo", 'DateTime'>;
    readonly lastLoginIp: Prisma.FieldRef<"MdUserReo", 'String'>;
    readonly passwordExpiresAt: Prisma.FieldRef<"MdUserReo", 'DateTime'>;
    readonly twoFactorSecret: Prisma.FieldRef<"MdUserReo", 'String'>;
    readonly stateUser: Prisma.FieldRef<"MdUserReo", 'Int'>;
    readonly codUsuarioCargaDl: Prisma.FieldRef<"MdUserReo", 'String'>;
    readonly fehProcesoCargaDl: Prisma.FieldRef<"MdUserReo", 'DateTime'>;
    readonly fehProcesoModifDl: Prisma.FieldRef<"MdUserReo", 'DateTime'>;
    readonly desAccion: Prisma.FieldRef<"MdUserReo", 'String'>;
    readonly flgStatutActif: Prisma.FieldRef<"MdUserReo", 'Int'>;
}
/**
 * MdUserReo findUnique
 */
export type MdUserReoFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MdUserReo
     */
    select?: Prisma.MdUserReoSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the MdUserReo
     */
    omit?: Prisma.MdUserReoOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MdUserReoInclude<ExtArgs> | null;
    /**
     * Filter, which MdUserReo to fetch.
     */
    where: Prisma.MdUserReoWhereUniqueInput;
};
/**
 * MdUserReo findUniqueOrThrow
 */
export type MdUserReoFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MdUserReo
     */
    select?: Prisma.MdUserReoSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the MdUserReo
     */
    omit?: Prisma.MdUserReoOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MdUserReoInclude<ExtArgs> | null;
    /**
     * Filter, which MdUserReo to fetch.
     */
    where: Prisma.MdUserReoWhereUniqueInput;
};
/**
 * MdUserReo findFirst
 */
export type MdUserReoFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MdUserReo
     */
    select?: Prisma.MdUserReoSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the MdUserReo
     */
    omit?: Prisma.MdUserReoOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MdUserReoInclude<ExtArgs> | null;
    /**
     * Filter, which MdUserReo to fetch.
     */
    where?: Prisma.MdUserReoWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of MdUserReos to fetch.
     */
    orderBy?: Prisma.MdUserReoOrderByWithRelationInput | Prisma.MdUserReoOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for MdUserReos.
     */
    cursor?: Prisma.MdUserReoWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` MdUserReos from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` MdUserReos.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of MdUserReos.
     */
    distinct?: Prisma.MdUserReoScalarFieldEnum | Prisma.MdUserReoScalarFieldEnum[];
};
/**
 * MdUserReo findFirstOrThrow
 */
export type MdUserReoFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MdUserReo
     */
    select?: Prisma.MdUserReoSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the MdUserReo
     */
    omit?: Prisma.MdUserReoOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MdUserReoInclude<ExtArgs> | null;
    /**
     * Filter, which MdUserReo to fetch.
     */
    where?: Prisma.MdUserReoWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of MdUserReos to fetch.
     */
    orderBy?: Prisma.MdUserReoOrderByWithRelationInput | Prisma.MdUserReoOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for MdUserReos.
     */
    cursor?: Prisma.MdUserReoWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` MdUserReos from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` MdUserReos.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of MdUserReos.
     */
    distinct?: Prisma.MdUserReoScalarFieldEnum | Prisma.MdUserReoScalarFieldEnum[];
};
/**
 * MdUserReo findMany
 */
export type MdUserReoFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MdUserReo
     */
    select?: Prisma.MdUserReoSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the MdUserReo
     */
    omit?: Prisma.MdUserReoOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MdUserReoInclude<ExtArgs> | null;
    /**
     * Filter, which MdUserReos to fetch.
     */
    where?: Prisma.MdUserReoWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of MdUserReos to fetch.
     */
    orderBy?: Prisma.MdUserReoOrderByWithRelationInput | Prisma.MdUserReoOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing MdUserReos.
     */
    cursor?: Prisma.MdUserReoWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` MdUserReos from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` MdUserReos.
     */
    skip?: number;
    distinct?: Prisma.MdUserReoScalarFieldEnum | Prisma.MdUserReoScalarFieldEnum[];
};
/**
 * MdUserReo create
 */
export type MdUserReoCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MdUserReo
     */
    select?: Prisma.MdUserReoSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the MdUserReo
     */
    omit?: Prisma.MdUserReoOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MdUserReoInclude<ExtArgs> | null;
    /**
     * The data needed to create a MdUserReo.
     */
    data: Prisma.XOR<Prisma.MdUserReoCreateInput, Prisma.MdUserReoUncheckedCreateInput>;
};
/**
 * MdUserReo createMany
 */
export type MdUserReoCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many MdUserReos.
     */
    data: Prisma.MdUserReoCreateManyInput | Prisma.MdUserReoCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * MdUserReo update
 */
export type MdUserReoUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MdUserReo
     */
    select?: Prisma.MdUserReoSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the MdUserReo
     */
    omit?: Prisma.MdUserReoOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MdUserReoInclude<ExtArgs> | null;
    /**
     * The data needed to update a MdUserReo.
     */
    data: Prisma.XOR<Prisma.MdUserReoUpdateInput, Prisma.MdUserReoUncheckedUpdateInput>;
    /**
     * Choose, which MdUserReo to update.
     */
    where: Prisma.MdUserReoWhereUniqueInput;
};
/**
 * MdUserReo updateMany
 */
export type MdUserReoUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update MdUserReos.
     */
    data: Prisma.XOR<Prisma.MdUserReoUpdateManyMutationInput, Prisma.MdUserReoUncheckedUpdateManyInput>;
    /**
     * Filter which MdUserReos to update
     */
    where?: Prisma.MdUserReoWhereInput;
    /**
     * Limit how many MdUserReos to update.
     */
    limit?: number;
};
/**
 * MdUserReo upsert
 */
export type MdUserReoUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MdUserReo
     */
    select?: Prisma.MdUserReoSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the MdUserReo
     */
    omit?: Prisma.MdUserReoOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MdUserReoInclude<ExtArgs> | null;
    /**
     * The filter to search for the MdUserReo to update in case it exists.
     */
    where: Prisma.MdUserReoWhereUniqueInput;
    /**
     * In case the MdUserReo found by the `where` argument doesn't exist, create a new MdUserReo with this data.
     */
    create: Prisma.XOR<Prisma.MdUserReoCreateInput, Prisma.MdUserReoUncheckedCreateInput>;
    /**
     * In case the MdUserReo was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.MdUserReoUpdateInput, Prisma.MdUserReoUncheckedUpdateInput>;
};
/**
 * MdUserReo delete
 */
export type MdUserReoDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MdUserReo
     */
    select?: Prisma.MdUserReoSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the MdUserReo
     */
    omit?: Prisma.MdUserReoOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MdUserReoInclude<ExtArgs> | null;
    /**
     * Filter which MdUserReo to delete.
     */
    where: Prisma.MdUserReoWhereUniqueInput;
};
/**
 * MdUserReo deleteMany
 */
export type MdUserReoDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which MdUserReos to delete
     */
    where?: Prisma.MdUserReoWhereInput;
    /**
     * Limit how many MdUserReos to delete.
     */
    limit?: number;
};
/**
 * MdUserReo.accessLogs
 */
export type MdUserReo$accessLogsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LgUserAccess
     */
    select?: Prisma.LgUserAccessSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the LgUserAccess
     */
    omit?: Prisma.LgUserAccessOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.LgUserAccessInclude<ExtArgs> | null;
    where?: Prisma.LgUserAccessWhereInput;
    orderBy?: Prisma.LgUserAccessOrderByWithRelationInput | Prisma.LgUserAccessOrderByWithRelationInput[];
    cursor?: Prisma.LgUserAccessWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.LgUserAccessScalarFieldEnum | Prisma.LgUserAccessScalarFieldEnum[];
};
/**
 * MdUserReo without action
 */
export type MdUserReoDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MdUserReo
     */
    select?: Prisma.MdUserReoSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the MdUserReo
     */
    omit?: Prisma.MdUserReoOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MdUserReoInclude<ExtArgs> | null;
};
export {};
