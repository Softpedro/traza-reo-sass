import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model MdParentCompany
 *
 */
export type MdParentCompanyModel = runtime.Types.Result.DefaultSelection<Prisma.$MdParentCompanyPayload>;
export type AggregateMdParentCompany = {
    _count: MdParentCompanyCountAggregateOutputType | null;
    _avg: MdParentCompanyAvgAggregateOutputType | null;
    _sum: MdParentCompanySumAggregateOutputType | null;
    _min: MdParentCompanyMinAggregateOutputType | null;
    _max: MdParentCompanyMaxAggregateOutputType | null;
};
export type MdParentCompanyAvgAggregateOutputType = {
    idDlkParentCompany: number | null;
    categoryParentCompany: number | null;
    codUbigeoParentCompany: number | null;
    stateParentCompany: number | null;
    flgStatutActif: number | null;
};
export type MdParentCompanySumAggregateOutputType = {
    idDlkParentCompany: number | null;
    categoryParentCompany: number | null;
    codUbigeoParentCompany: number | null;
    stateParentCompany: number | null;
    flgStatutActif: number | null;
};
export type MdParentCompanyMinAggregateOutputType = {
    idDlkParentCompany: number | null;
    codParentCompany: string | null;
    codGlnParentCompany: string | null;
    nameParentCompany: string | null;
    categoryParentCompany: number | null;
    numRucParentCompany: string | null;
    codUbigeoParentCompany: number | null;
    addressParentCompany: string | null;
    gpsLocationParentCompany: string | null;
    emailParentCompany: string | null;
    cellularParentCompany: string | null;
    webParentCompany: string | null;
    canisterDataParentCompany: string | null;
    canisterAssetsParentCompany: string | null;
    logoParentCompany: runtime.Bytes | null;
    stateParentCompany: number | null;
    codUsuarioCargaDl: string | null;
    fehProcesoCargaDl: Date | null;
    fehProcesoModifDl: Date | null;
    desAccion: string | null;
    flgStatutActif: number | null;
};
export type MdParentCompanyMaxAggregateOutputType = {
    idDlkParentCompany: number | null;
    codParentCompany: string | null;
    codGlnParentCompany: string | null;
    nameParentCompany: string | null;
    categoryParentCompany: number | null;
    numRucParentCompany: string | null;
    codUbigeoParentCompany: number | null;
    addressParentCompany: string | null;
    gpsLocationParentCompany: string | null;
    emailParentCompany: string | null;
    cellularParentCompany: string | null;
    webParentCompany: string | null;
    canisterDataParentCompany: string | null;
    canisterAssetsParentCompany: string | null;
    logoParentCompany: runtime.Bytes | null;
    stateParentCompany: number | null;
    codUsuarioCargaDl: string | null;
    fehProcesoCargaDl: Date | null;
    fehProcesoModifDl: Date | null;
    desAccion: string | null;
    flgStatutActif: number | null;
};
export type MdParentCompanyCountAggregateOutputType = {
    idDlkParentCompany: number;
    codParentCompany: number;
    codGlnParentCompany: number;
    nameParentCompany: number;
    categoryParentCompany: number;
    numRucParentCompany: number;
    codUbigeoParentCompany: number;
    addressParentCompany: number;
    gpsLocationParentCompany: number;
    emailParentCompany: number;
    cellularParentCompany: number;
    webParentCompany: number;
    canisterDataParentCompany: number;
    canisterAssetsParentCompany: number;
    logoParentCompany: number;
    stateParentCompany: number;
    codUsuarioCargaDl: number;
    fehProcesoCargaDl: number;
    fehProcesoModifDl: number;
    desAccion: number;
    flgStatutActif: number;
    _all: number;
};
export type MdParentCompanyAvgAggregateInputType = {
    idDlkParentCompany?: true;
    categoryParentCompany?: true;
    codUbigeoParentCompany?: true;
    stateParentCompany?: true;
    flgStatutActif?: true;
};
export type MdParentCompanySumAggregateInputType = {
    idDlkParentCompany?: true;
    categoryParentCompany?: true;
    codUbigeoParentCompany?: true;
    stateParentCompany?: true;
    flgStatutActif?: true;
};
export type MdParentCompanyMinAggregateInputType = {
    idDlkParentCompany?: true;
    codParentCompany?: true;
    codGlnParentCompany?: true;
    nameParentCompany?: true;
    categoryParentCompany?: true;
    numRucParentCompany?: true;
    codUbigeoParentCompany?: true;
    addressParentCompany?: true;
    gpsLocationParentCompany?: true;
    emailParentCompany?: true;
    cellularParentCompany?: true;
    webParentCompany?: true;
    canisterDataParentCompany?: true;
    canisterAssetsParentCompany?: true;
    logoParentCompany?: true;
    stateParentCompany?: true;
    codUsuarioCargaDl?: true;
    fehProcesoCargaDl?: true;
    fehProcesoModifDl?: true;
    desAccion?: true;
    flgStatutActif?: true;
};
export type MdParentCompanyMaxAggregateInputType = {
    idDlkParentCompany?: true;
    codParentCompany?: true;
    codGlnParentCompany?: true;
    nameParentCompany?: true;
    categoryParentCompany?: true;
    numRucParentCompany?: true;
    codUbigeoParentCompany?: true;
    addressParentCompany?: true;
    gpsLocationParentCompany?: true;
    emailParentCompany?: true;
    cellularParentCompany?: true;
    webParentCompany?: true;
    canisterDataParentCompany?: true;
    canisterAssetsParentCompany?: true;
    logoParentCompany?: true;
    stateParentCompany?: true;
    codUsuarioCargaDl?: true;
    fehProcesoCargaDl?: true;
    fehProcesoModifDl?: true;
    desAccion?: true;
    flgStatutActif?: true;
};
export type MdParentCompanyCountAggregateInputType = {
    idDlkParentCompany?: true;
    codParentCompany?: true;
    codGlnParentCompany?: true;
    nameParentCompany?: true;
    categoryParentCompany?: true;
    numRucParentCompany?: true;
    codUbigeoParentCompany?: true;
    addressParentCompany?: true;
    gpsLocationParentCompany?: true;
    emailParentCompany?: true;
    cellularParentCompany?: true;
    webParentCompany?: true;
    canisterDataParentCompany?: true;
    canisterAssetsParentCompany?: true;
    logoParentCompany?: true;
    stateParentCompany?: true;
    codUsuarioCargaDl?: true;
    fehProcesoCargaDl?: true;
    fehProcesoModifDl?: true;
    desAccion?: true;
    flgStatutActif?: true;
    _all?: true;
};
export type MdParentCompanyAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which MdParentCompany to aggregate.
     */
    where?: Prisma.MdParentCompanyWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of MdParentCompanies to fetch.
     */
    orderBy?: Prisma.MdParentCompanyOrderByWithRelationInput | Prisma.MdParentCompanyOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.MdParentCompanyWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` MdParentCompanies from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` MdParentCompanies.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned MdParentCompanies
    **/
    _count?: true | MdParentCompanyCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: MdParentCompanyAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: MdParentCompanySumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: MdParentCompanyMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: MdParentCompanyMaxAggregateInputType;
};
export type GetMdParentCompanyAggregateType<T extends MdParentCompanyAggregateArgs> = {
    [P in keyof T & keyof AggregateMdParentCompany]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateMdParentCompany[P]> : Prisma.GetScalarType<T[P], AggregateMdParentCompany[P]>;
};
export type MdParentCompanyGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MdParentCompanyWhereInput;
    orderBy?: Prisma.MdParentCompanyOrderByWithAggregationInput | Prisma.MdParentCompanyOrderByWithAggregationInput[];
    by: Prisma.MdParentCompanyScalarFieldEnum[] | Prisma.MdParentCompanyScalarFieldEnum;
    having?: Prisma.MdParentCompanyScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: MdParentCompanyCountAggregateInputType | true;
    _avg?: MdParentCompanyAvgAggregateInputType;
    _sum?: MdParentCompanySumAggregateInputType;
    _min?: MdParentCompanyMinAggregateInputType;
    _max?: MdParentCompanyMaxAggregateInputType;
};
export type MdParentCompanyGroupByOutputType = {
    idDlkParentCompany: number;
    codParentCompany: string;
    codGlnParentCompany: string;
    nameParentCompany: string;
    categoryParentCompany: number;
    numRucParentCompany: string;
    codUbigeoParentCompany: number;
    addressParentCompany: string;
    gpsLocationParentCompany: string | null;
    emailParentCompany: string;
    cellularParentCompany: string;
    webParentCompany: string | null;
    canisterDataParentCompany: string | null;
    canisterAssetsParentCompany: string | null;
    logoParentCompany: runtime.Bytes | null;
    stateParentCompany: number;
    codUsuarioCargaDl: string;
    fehProcesoCargaDl: Date;
    fehProcesoModifDl: Date;
    desAccion: string;
    flgStatutActif: number;
    _count: MdParentCompanyCountAggregateOutputType | null;
    _avg: MdParentCompanyAvgAggregateOutputType | null;
    _sum: MdParentCompanySumAggregateOutputType | null;
    _min: MdParentCompanyMinAggregateOutputType | null;
    _max: MdParentCompanyMaxAggregateOutputType | null;
};
type GetMdParentCompanyGroupByPayload<T extends MdParentCompanyGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<MdParentCompanyGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof MdParentCompanyGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], MdParentCompanyGroupByOutputType[P]> : Prisma.GetScalarType<T[P], MdParentCompanyGroupByOutputType[P]>;
}>>;
export type MdParentCompanyWhereInput = {
    AND?: Prisma.MdParentCompanyWhereInput | Prisma.MdParentCompanyWhereInput[];
    OR?: Prisma.MdParentCompanyWhereInput[];
    NOT?: Prisma.MdParentCompanyWhereInput | Prisma.MdParentCompanyWhereInput[];
    idDlkParentCompany?: Prisma.IntFilter<"MdParentCompany"> | number;
    codParentCompany?: Prisma.StringFilter<"MdParentCompany"> | string;
    codGlnParentCompany?: Prisma.StringFilter<"MdParentCompany"> | string;
    nameParentCompany?: Prisma.StringFilter<"MdParentCompany"> | string;
    categoryParentCompany?: Prisma.IntFilter<"MdParentCompany"> | number;
    numRucParentCompany?: Prisma.StringFilter<"MdParentCompany"> | string;
    codUbigeoParentCompany?: Prisma.IntFilter<"MdParentCompany"> | number;
    addressParentCompany?: Prisma.StringFilter<"MdParentCompany"> | string;
    gpsLocationParentCompany?: Prisma.StringNullableFilter<"MdParentCompany"> | string | null;
    emailParentCompany?: Prisma.StringFilter<"MdParentCompany"> | string;
    cellularParentCompany?: Prisma.StringFilter<"MdParentCompany"> | string;
    webParentCompany?: Prisma.StringNullableFilter<"MdParentCompany"> | string | null;
    canisterDataParentCompany?: Prisma.StringNullableFilter<"MdParentCompany"> | string | null;
    canisterAssetsParentCompany?: Prisma.StringNullableFilter<"MdParentCompany"> | string | null;
    logoParentCompany?: Prisma.BytesNullableFilter<"MdParentCompany"> | runtime.Bytes | null;
    stateParentCompany?: Prisma.IntFilter<"MdParentCompany"> | number;
    codUsuarioCargaDl?: Prisma.StringFilter<"MdParentCompany"> | string;
    fehProcesoCargaDl?: Prisma.DateTimeFilter<"MdParentCompany"> | Date | string;
    fehProcesoModifDl?: Prisma.DateTimeFilter<"MdParentCompany"> | Date | string;
    desAccion?: Prisma.StringFilter<"MdParentCompany"> | string;
    flgStatutActif?: Prisma.IntFilter<"MdParentCompany"> | number;
    brands?: Prisma.MdBrandListRelationFilter;
    ordenes?: Prisma.MdOrdenPedidoListRelationFilter;
    facilities?: Prisma.MdFacilityListRelationFilter;
    maquilaRelations?: Prisma.MdParentCompanyMaquilaListRelationFilter;
    users?: Prisma.MdUserReoListRelationFilter;
    auditLogs?: Prisma.LgParentCompanyListRelationFilter;
};
export type MdParentCompanyOrderByWithRelationInput = {
    idDlkParentCompany?: Prisma.SortOrder;
    codParentCompany?: Prisma.SortOrder;
    codGlnParentCompany?: Prisma.SortOrder;
    nameParentCompany?: Prisma.SortOrder;
    categoryParentCompany?: Prisma.SortOrder;
    numRucParentCompany?: Prisma.SortOrder;
    codUbigeoParentCompany?: Prisma.SortOrder;
    addressParentCompany?: Prisma.SortOrder;
    gpsLocationParentCompany?: Prisma.SortOrderInput | Prisma.SortOrder;
    emailParentCompany?: Prisma.SortOrder;
    cellularParentCompany?: Prisma.SortOrder;
    webParentCompany?: Prisma.SortOrderInput | Prisma.SortOrder;
    canisterDataParentCompany?: Prisma.SortOrderInput | Prisma.SortOrder;
    canisterAssetsParentCompany?: Prisma.SortOrderInput | Prisma.SortOrder;
    logoParentCompany?: Prisma.SortOrderInput | Prisma.SortOrder;
    stateParentCompany?: Prisma.SortOrder;
    codUsuarioCargaDl?: Prisma.SortOrder;
    fehProcesoCargaDl?: Prisma.SortOrder;
    fehProcesoModifDl?: Prisma.SortOrder;
    desAccion?: Prisma.SortOrder;
    flgStatutActif?: Prisma.SortOrder;
    brands?: Prisma.MdBrandOrderByRelationAggregateInput;
    ordenes?: Prisma.MdOrdenPedidoOrderByRelationAggregateInput;
    facilities?: Prisma.MdFacilityOrderByRelationAggregateInput;
    maquilaRelations?: Prisma.MdParentCompanyMaquilaOrderByRelationAggregateInput;
    users?: Prisma.MdUserReoOrderByRelationAggregateInput;
    auditLogs?: Prisma.LgParentCompanyOrderByRelationAggregateInput;
    _relevance?: Prisma.MdParentCompanyOrderByRelevanceInput;
};
export type MdParentCompanyWhereUniqueInput = Prisma.AtLeast<{
    idDlkParentCompany?: number;
    codParentCompany?: string;
    numRucParentCompany?: string;
    AND?: Prisma.MdParentCompanyWhereInput | Prisma.MdParentCompanyWhereInput[];
    OR?: Prisma.MdParentCompanyWhereInput[];
    NOT?: Prisma.MdParentCompanyWhereInput | Prisma.MdParentCompanyWhereInput[];
    codGlnParentCompany?: Prisma.StringFilter<"MdParentCompany"> | string;
    nameParentCompany?: Prisma.StringFilter<"MdParentCompany"> | string;
    categoryParentCompany?: Prisma.IntFilter<"MdParentCompany"> | number;
    codUbigeoParentCompany?: Prisma.IntFilter<"MdParentCompany"> | number;
    addressParentCompany?: Prisma.StringFilter<"MdParentCompany"> | string;
    gpsLocationParentCompany?: Prisma.StringNullableFilter<"MdParentCompany"> | string | null;
    emailParentCompany?: Prisma.StringFilter<"MdParentCompany"> | string;
    cellularParentCompany?: Prisma.StringFilter<"MdParentCompany"> | string;
    webParentCompany?: Prisma.StringNullableFilter<"MdParentCompany"> | string | null;
    canisterDataParentCompany?: Prisma.StringNullableFilter<"MdParentCompany"> | string | null;
    canisterAssetsParentCompany?: Prisma.StringNullableFilter<"MdParentCompany"> | string | null;
    logoParentCompany?: Prisma.BytesNullableFilter<"MdParentCompany"> | runtime.Bytes | null;
    stateParentCompany?: Prisma.IntFilter<"MdParentCompany"> | number;
    codUsuarioCargaDl?: Prisma.StringFilter<"MdParentCompany"> | string;
    fehProcesoCargaDl?: Prisma.DateTimeFilter<"MdParentCompany"> | Date | string;
    fehProcesoModifDl?: Prisma.DateTimeFilter<"MdParentCompany"> | Date | string;
    desAccion?: Prisma.StringFilter<"MdParentCompany"> | string;
    flgStatutActif?: Prisma.IntFilter<"MdParentCompany"> | number;
    brands?: Prisma.MdBrandListRelationFilter;
    ordenes?: Prisma.MdOrdenPedidoListRelationFilter;
    facilities?: Prisma.MdFacilityListRelationFilter;
    maquilaRelations?: Prisma.MdParentCompanyMaquilaListRelationFilter;
    users?: Prisma.MdUserReoListRelationFilter;
    auditLogs?: Prisma.LgParentCompanyListRelationFilter;
}, "idDlkParentCompany" | "codParentCompany" | "numRucParentCompany">;
export type MdParentCompanyOrderByWithAggregationInput = {
    idDlkParentCompany?: Prisma.SortOrder;
    codParentCompany?: Prisma.SortOrder;
    codGlnParentCompany?: Prisma.SortOrder;
    nameParentCompany?: Prisma.SortOrder;
    categoryParentCompany?: Prisma.SortOrder;
    numRucParentCompany?: Prisma.SortOrder;
    codUbigeoParentCompany?: Prisma.SortOrder;
    addressParentCompany?: Prisma.SortOrder;
    gpsLocationParentCompany?: Prisma.SortOrderInput | Prisma.SortOrder;
    emailParentCompany?: Prisma.SortOrder;
    cellularParentCompany?: Prisma.SortOrder;
    webParentCompany?: Prisma.SortOrderInput | Prisma.SortOrder;
    canisterDataParentCompany?: Prisma.SortOrderInput | Prisma.SortOrder;
    canisterAssetsParentCompany?: Prisma.SortOrderInput | Prisma.SortOrder;
    logoParentCompany?: Prisma.SortOrderInput | Prisma.SortOrder;
    stateParentCompany?: Prisma.SortOrder;
    codUsuarioCargaDl?: Prisma.SortOrder;
    fehProcesoCargaDl?: Prisma.SortOrder;
    fehProcesoModifDl?: Prisma.SortOrder;
    desAccion?: Prisma.SortOrder;
    flgStatutActif?: Prisma.SortOrder;
    _count?: Prisma.MdParentCompanyCountOrderByAggregateInput;
    _avg?: Prisma.MdParentCompanyAvgOrderByAggregateInput;
    _max?: Prisma.MdParentCompanyMaxOrderByAggregateInput;
    _min?: Prisma.MdParentCompanyMinOrderByAggregateInput;
    _sum?: Prisma.MdParentCompanySumOrderByAggregateInput;
};
export type MdParentCompanyScalarWhereWithAggregatesInput = {
    AND?: Prisma.MdParentCompanyScalarWhereWithAggregatesInput | Prisma.MdParentCompanyScalarWhereWithAggregatesInput[];
    OR?: Prisma.MdParentCompanyScalarWhereWithAggregatesInput[];
    NOT?: Prisma.MdParentCompanyScalarWhereWithAggregatesInput | Prisma.MdParentCompanyScalarWhereWithAggregatesInput[];
    idDlkParentCompany?: Prisma.IntWithAggregatesFilter<"MdParentCompany"> | number;
    codParentCompany?: Prisma.StringWithAggregatesFilter<"MdParentCompany"> | string;
    codGlnParentCompany?: Prisma.StringWithAggregatesFilter<"MdParentCompany"> | string;
    nameParentCompany?: Prisma.StringWithAggregatesFilter<"MdParentCompany"> | string;
    categoryParentCompany?: Prisma.IntWithAggregatesFilter<"MdParentCompany"> | number;
    numRucParentCompany?: Prisma.StringWithAggregatesFilter<"MdParentCompany"> | string;
    codUbigeoParentCompany?: Prisma.IntWithAggregatesFilter<"MdParentCompany"> | number;
    addressParentCompany?: Prisma.StringWithAggregatesFilter<"MdParentCompany"> | string;
    gpsLocationParentCompany?: Prisma.StringNullableWithAggregatesFilter<"MdParentCompany"> | string | null;
    emailParentCompany?: Prisma.StringWithAggregatesFilter<"MdParentCompany"> | string;
    cellularParentCompany?: Prisma.StringWithAggregatesFilter<"MdParentCompany"> | string;
    webParentCompany?: Prisma.StringNullableWithAggregatesFilter<"MdParentCompany"> | string | null;
    canisterDataParentCompany?: Prisma.StringNullableWithAggregatesFilter<"MdParentCompany"> | string | null;
    canisterAssetsParentCompany?: Prisma.StringNullableWithAggregatesFilter<"MdParentCompany"> | string | null;
    logoParentCompany?: Prisma.BytesNullableWithAggregatesFilter<"MdParentCompany"> | runtime.Bytes | null;
    stateParentCompany?: Prisma.IntWithAggregatesFilter<"MdParentCompany"> | number;
    codUsuarioCargaDl?: Prisma.StringWithAggregatesFilter<"MdParentCompany"> | string;
    fehProcesoCargaDl?: Prisma.DateTimeWithAggregatesFilter<"MdParentCompany"> | Date | string;
    fehProcesoModifDl?: Prisma.DateTimeWithAggregatesFilter<"MdParentCompany"> | Date | string;
    desAccion?: Prisma.StringWithAggregatesFilter<"MdParentCompany"> | string;
    flgStatutActif?: Prisma.IntWithAggregatesFilter<"MdParentCompany"> | number;
};
export type MdParentCompanyCreateInput = {
    codParentCompany: string;
    codGlnParentCompany: string;
    nameParentCompany: string;
    categoryParentCompany: number;
    numRucParentCompany: string;
    codUbigeoParentCompany: number;
    addressParentCompany: string;
    gpsLocationParentCompany?: string | null;
    emailParentCompany: string;
    cellularParentCompany: string;
    webParentCompany?: string | null;
    canisterDataParentCompany?: string | null;
    canisterAssetsParentCompany?: string | null;
    logoParentCompany?: runtime.Bytes | null;
    stateParentCompany?: number;
    codUsuarioCargaDl: string;
    fehProcesoCargaDl?: Date | string;
    fehProcesoModifDl?: Date | string;
    desAccion: string;
    flgStatutActif?: number;
    brands?: Prisma.MdBrandCreateNestedManyWithoutParentCompanyInput;
    ordenes?: Prisma.MdOrdenPedidoCreateNestedManyWithoutParentCompanyInput;
    facilities?: Prisma.MdFacilityCreateNestedManyWithoutParentCompanyInput;
    maquilaRelations?: Prisma.MdParentCompanyMaquilaCreateNestedManyWithoutParentCompanyInput;
    users?: Prisma.MdUserReoCreateNestedManyWithoutParentCompanyInput;
    auditLogs?: Prisma.LgParentCompanyCreateNestedManyWithoutParentCompanyInput;
};
export type MdParentCompanyUncheckedCreateInput = {
    idDlkParentCompany?: number;
    codParentCompany: string;
    codGlnParentCompany: string;
    nameParentCompany: string;
    categoryParentCompany: number;
    numRucParentCompany: string;
    codUbigeoParentCompany: number;
    addressParentCompany: string;
    gpsLocationParentCompany?: string | null;
    emailParentCompany: string;
    cellularParentCompany: string;
    webParentCompany?: string | null;
    canisterDataParentCompany?: string | null;
    canisterAssetsParentCompany?: string | null;
    logoParentCompany?: runtime.Bytes | null;
    stateParentCompany?: number;
    codUsuarioCargaDl: string;
    fehProcesoCargaDl?: Date | string;
    fehProcesoModifDl?: Date | string;
    desAccion: string;
    flgStatutActif?: number;
    brands?: Prisma.MdBrandUncheckedCreateNestedManyWithoutParentCompanyInput;
    ordenes?: Prisma.MdOrdenPedidoUncheckedCreateNestedManyWithoutParentCompanyInput;
    facilities?: Prisma.MdFacilityUncheckedCreateNestedManyWithoutParentCompanyInput;
    maquilaRelations?: Prisma.MdParentCompanyMaquilaUncheckedCreateNestedManyWithoutParentCompanyInput;
    users?: Prisma.MdUserReoUncheckedCreateNestedManyWithoutParentCompanyInput;
    auditLogs?: Prisma.LgParentCompanyUncheckedCreateNestedManyWithoutParentCompanyInput;
};
export type MdParentCompanyUpdateInput = {
    codParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    codGlnParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    nameParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    categoryParentCompany?: Prisma.IntFieldUpdateOperationsInput | number;
    numRucParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    codUbigeoParentCompany?: Prisma.IntFieldUpdateOperationsInput | number;
    addressParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    gpsLocationParentCompany?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    emailParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    cellularParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    webParentCompany?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    canisterDataParentCompany?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    canisterAssetsParentCompany?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logoParentCompany?: Prisma.NullableBytesFieldUpdateOperationsInput | runtime.Bytes | null;
    stateParentCompany?: Prisma.IntFieldUpdateOperationsInput | number;
    codUsuarioCargaDl?: Prisma.StringFieldUpdateOperationsInput | string;
    fehProcesoCargaDl?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    fehProcesoModifDl?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    desAccion?: Prisma.StringFieldUpdateOperationsInput | string;
    flgStatutActif?: Prisma.IntFieldUpdateOperationsInput | number;
    brands?: Prisma.MdBrandUpdateManyWithoutParentCompanyNestedInput;
    ordenes?: Prisma.MdOrdenPedidoUpdateManyWithoutParentCompanyNestedInput;
    facilities?: Prisma.MdFacilityUpdateManyWithoutParentCompanyNestedInput;
    maquilaRelations?: Prisma.MdParentCompanyMaquilaUpdateManyWithoutParentCompanyNestedInput;
    users?: Prisma.MdUserReoUpdateManyWithoutParentCompanyNestedInput;
    auditLogs?: Prisma.LgParentCompanyUpdateManyWithoutParentCompanyNestedInput;
};
export type MdParentCompanyUncheckedUpdateInput = {
    idDlkParentCompany?: Prisma.IntFieldUpdateOperationsInput | number;
    codParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    codGlnParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    nameParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    categoryParentCompany?: Prisma.IntFieldUpdateOperationsInput | number;
    numRucParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    codUbigeoParentCompany?: Prisma.IntFieldUpdateOperationsInput | number;
    addressParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    gpsLocationParentCompany?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    emailParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    cellularParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    webParentCompany?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    canisterDataParentCompany?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    canisterAssetsParentCompany?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logoParentCompany?: Prisma.NullableBytesFieldUpdateOperationsInput | runtime.Bytes | null;
    stateParentCompany?: Prisma.IntFieldUpdateOperationsInput | number;
    codUsuarioCargaDl?: Prisma.StringFieldUpdateOperationsInput | string;
    fehProcesoCargaDl?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    fehProcesoModifDl?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    desAccion?: Prisma.StringFieldUpdateOperationsInput | string;
    flgStatutActif?: Prisma.IntFieldUpdateOperationsInput | number;
    brands?: Prisma.MdBrandUncheckedUpdateManyWithoutParentCompanyNestedInput;
    ordenes?: Prisma.MdOrdenPedidoUncheckedUpdateManyWithoutParentCompanyNestedInput;
    facilities?: Prisma.MdFacilityUncheckedUpdateManyWithoutParentCompanyNestedInput;
    maquilaRelations?: Prisma.MdParentCompanyMaquilaUncheckedUpdateManyWithoutParentCompanyNestedInput;
    users?: Prisma.MdUserReoUncheckedUpdateManyWithoutParentCompanyNestedInput;
    auditLogs?: Prisma.LgParentCompanyUncheckedUpdateManyWithoutParentCompanyNestedInput;
};
export type MdParentCompanyCreateManyInput = {
    idDlkParentCompany?: number;
    codParentCompany: string;
    codGlnParentCompany: string;
    nameParentCompany: string;
    categoryParentCompany: number;
    numRucParentCompany: string;
    codUbigeoParentCompany: number;
    addressParentCompany: string;
    gpsLocationParentCompany?: string | null;
    emailParentCompany: string;
    cellularParentCompany: string;
    webParentCompany?: string | null;
    canisterDataParentCompany?: string | null;
    canisterAssetsParentCompany?: string | null;
    logoParentCompany?: runtime.Bytes | null;
    stateParentCompany?: number;
    codUsuarioCargaDl: string;
    fehProcesoCargaDl?: Date | string;
    fehProcesoModifDl?: Date | string;
    desAccion: string;
    flgStatutActif?: number;
};
export type MdParentCompanyUpdateManyMutationInput = {
    codParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    codGlnParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    nameParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    categoryParentCompany?: Prisma.IntFieldUpdateOperationsInput | number;
    numRucParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    codUbigeoParentCompany?: Prisma.IntFieldUpdateOperationsInput | number;
    addressParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    gpsLocationParentCompany?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    emailParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    cellularParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    webParentCompany?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    canisterDataParentCompany?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    canisterAssetsParentCompany?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logoParentCompany?: Prisma.NullableBytesFieldUpdateOperationsInput | runtime.Bytes | null;
    stateParentCompany?: Prisma.IntFieldUpdateOperationsInput | number;
    codUsuarioCargaDl?: Prisma.StringFieldUpdateOperationsInput | string;
    fehProcesoCargaDl?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    fehProcesoModifDl?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    desAccion?: Prisma.StringFieldUpdateOperationsInput | string;
    flgStatutActif?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type MdParentCompanyUncheckedUpdateManyInput = {
    idDlkParentCompany?: Prisma.IntFieldUpdateOperationsInput | number;
    codParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    codGlnParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    nameParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    categoryParentCompany?: Prisma.IntFieldUpdateOperationsInput | number;
    numRucParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    codUbigeoParentCompany?: Prisma.IntFieldUpdateOperationsInput | number;
    addressParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    gpsLocationParentCompany?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    emailParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    cellularParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    webParentCompany?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    canisterDataParentCompany?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    canisterAssetsParentCompany?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logoParentCompany?: Prisma.NullableBytesFieldUpdateOperationsInput | runtime.Bytes | null;
    stateParentCompany?: Prisma.IntFieldUpdateOperationsInput | number;
    codUsuarioCargaDl?: Prisma.StringFieldUpdateOperationsInput | string;
    fehProcesoCargaDl?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    fehProcesoModifDl?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    desAccion?: Prisma.StringFieldUpdateOperationsInput | string;
    flgStatutActif?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type MdParentCompanyOrderByRelevanceInput = {
    fields: Prisma.MdParentCompanyOrderByRelevanceFieldEnum | Prisma.MdParentCompanyOrderByRelevanceFieldEnum[];
    sort: Prisma.SortOrder;
    search: string;
};
export type MdParentCompanyCountOrderByAggregateInput = {
    idDlkParentCompany?: Prisma.SortOrder;
    codParentCompany?: Prisma.SortOrder;
    codGlnParentCompany?: Prisma.SortOrder;
    nameParentCompany?: Prisma.SortOrder;
    categoryParentCompany?: Prisma.SortOrder;
    numRucParentCompany?: Prisma.SortOrder;
    codUbigeoParentCompany?: Prisma.SortOrder;
    addressParentCompany?: Prisma.SortOrder;
    gpsLocationParentCompany?: Prisma.SortOrder;
    emailParentCompany?: Prisma.SortOrder;
    cellularParentCompany?: Prisma.SortOrder;
    webParentCompany?: Prisma.SortOrder;
    canisterDataParentCompany?: Prisma.SortOrder;
    canisterAssetsParentCompany?: Prisma.SortOrder;
    logoParentCompany?: Prisma.SortOrder;
    stateParentCompany?: Prisma.SortOrder;
    codUsuarioCargaDl?: Prisma.SortOrder;
    fehProcesoCargaDl?: Prisma.SortOrder;
    fehProcesoModifDl?: Prisma.SortOrder;
    desAccion?: Prisma.SortOrder;
    flgStatutActif?: Prisma.SortOrder;
};
export type MdParentCompanyAvgOrderByAggregateInput = {
    idDlkParentCompany?: Prisma.SortOrder;
    categoryParentCompany?: Prisma.SortOrder;
    codUbigeoParentCompany?: Prisma.SortOrder;
    stateParentCompany?: Prisma.SortOrder;
    flgStatutActif?: Prisma.SortOrder;
};
export type MdParentCompanyMaxOrderByAggregateInput = {
    idDlkParentCompany?: Prisma.SortOrder;
    codParentCompany?: Prisma.SortOrder;
    codGlnParentCompany?: Prisma.SortOrder;
    nameParentCompany?: Prisma.SortOrder;
    categoryParentCompany?: Prisma.SortOrder;
    numRucParentCompany?: Prisma.SortOrder;
    codUbigeoParentCompany?: Prisma.SortOrder;
    addressParentCompany?: Prisma.SortOrder;
    gpsLocationParentCompany?: Prisma.SortOrder;
    emailParentCompany?: Prisma.SortOrder;
    cellularParentCompany?: Prisma.SortOrder;
    webParentCompany?: Prisma.SortOrder;
    canisterDataParentCompany?: Prisma.SortOrder;
    canisterAssetsParentCompany?: Prisma.SortOrder;
    logoParentCompany?: Prisma.SortOrder;
    stateParentCompany?: Prisma.SortOrder;
    codUsuarioCargaDl?: Prisma.SortOrder;
    fehProcesoCargaDl?: Prisma.SortOrder;
    fehProcesoModifDl?: Prisma.SortOrder;
    desAccion?: Prisma.SortOrder;
    flgStatutActif?: Prisma.SortOrder;
};
export type MdParentCompanyMinOrderByAggregateInput = {
    idDlkParentCompany?: Prisma.SortOrder;
    codParentCompany?: Prisma.SortOrder;
    codGlnParentCompany?: Prisma.SortOrder;
    nameParentCompany?: Prisma.SortOrder;
    categoryParentCompany?: Prisma.SortOrder;
    numRucParentCompany?: Prisma.SortOrder;
    codUbigeoParentCompany?: Prisma.SortOrder;
    addressParentCompany?: Prisma.SortOrder;
    gpsLocationParentCompany?: Prisma.SortOrder;
    emailParentCompany?: Prisma.SortOrder;
    cellularParentCompany?: Prisma.SortOrder;
    webParentCompany?: Prisma.SortOrder;
    canisterDataParentCompany?: Prisma.SortOrder;
    canisterAssetsParentCompany?: Prisma.SortOrder;
    logoParentCompany?: Prisma.SortOrder;
    stateParentCompany?: Prisma.SortOrder;
    codUsuarioCargaDl?: Prisma.SortOrder;
    fehProcesoCargaDl?: Prisma.SortOrder;
    fehProcesoModifDl?: Prisma.SortOrder;
    desAccion?: Prisma.SortOrder;
    flgStatutActif?: Prisma.SortOrder;
};
export type MdParentCompanySumOrderByAggregateInput = {
    idDlkParentCompany?: Prisma.SortOrder;
    categoryParentCompany?: Prisma.SortOrder;
    codUbigeoParentCompany?: Prisma.SortOrder;
    stateParentCompany?: Prisma.SortOrder;
    flgStatutActif?: Prisma.SortOrder;
};
export type MdParentCompanyScalarRelationFilter = {
    is?: Prisma.MdParentCompanyWhereInput;
    isNot?: Prisma.MdParentCompanyWhereInput;
};
export type MdParentCompanyNullableScalarRelationFilter = {
    is?: Prisma.MdParentCompanyWhereInput | null;
    isNot?: Prisma.MdParentCompanyWhereInput | null;
};
export type StringFieldUpdateOperationsInput = {
    set?: string;
};
export type IntFieldUpdateOperationsInput = {
    set?: number;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
};
export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null;
};
export type NullableBytesFieldUpdateOperationsInput = {
    set?: runtime.Bytes | null;
};
export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string;
};
export type MdParentCompanyCreateNestedOneWithoutBrandsInput = {
    create?: Prisma.XOR<Prisma.MdParentCompanyCreateWithoutBrandsInput, Prisma.MdParentCompanyUncheckedCreateWithoutBrandsInput>;
    connectOrCreate?: Prisma.MdParentCompanyCreateOrConnectWithoutBrandsInput;
    connect?: Prisma.MdParentCompanyWhereUniqueInput;
};
export type MdParentCompanyUpdateOneRequiredWithoutBrandsNestedInput = {
    create?: Prisma.XOR<Prisma.MdParentCompanyCreateWithoutBrandsInput, Prisma.MdParentCompanyUncheckedCreateWithoutBrandsInput>;
    connectOrCreate?: Prisma.MdParentCompanyCreateOrConnectWithoutBrandsInput;
    upsert?: Prisma.MdParentCompanyUpsertWithoutBrandsInput;
    connect?: Prisma.MdParentCompanyWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.MdParentCompanyUpdateToOneWithWhereWithoutBrandsInput, Prisma.MdParentCompanyUpdateWithoutBrandsInput>, Prisma.MdParentCompanyUncheckedUpdateWithoutBrandsInput>;
};
export type MdParentCompanyCreateNestedOneWithoutOrdenesInput = {
    create?: Prisma.XOR<Prisma.MdParentCompanyCreateWithoutOrdenesInput, Prisma.MdParentCompanyUncheckedCreateWithoutOrdenesInput>;
    connectOrCreate?: Prisma.MdParentCompanyCreateOrConnectWithoutOrdenesInput;
    connect?: Prisma.MdParentCompanyWhereUniqueInput;
};
export type MdParentCompanyUpdateOneRequiredWithoutOrdenesNestedInput = {
    create?: Prisma.XOR<Prisma.MdParentCompanyCreateWithoutOrdenesInput, Prisma.MdParentCompanyUncheckedCreateWithoutOrdenesInput>;
    connectOrCreate?: Prisma.MdParentCompanyCreateOrConnectWithoutOrdenesInput;
    upsert?: Prisma.MdParentCompanyUpsertWithoutOrdenesInput;
    connect?: Prisma.MdParentCompanyWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.MdParentCompanyUpdateToOneWithWhereWithoutOrdenesInput, Prisma.MdParentCompanyUpdateWithoutOrdenesInput>, Prisma.MdParentCompanyUncheckedUpdateWithoutOrdenesInput>;
};
export type MdParentCompanyCreateNestedOneWithoutFacilitiesInput = {
    create?: Prisma.XOR<Prisma.MdParentCompanyCreateWithoutFacilitiesInput, Prisma.MdParentCompanyUncheckedCreateWithoutFacilitiesInput>;
    connectOrCreate?: Prisma.MdParentCompanyCreateOrConnectWithoutFacilitiesInput;
    connect?: Prisma.MdParentCompanyWhereUniqueInput;
};
export type MdParentCompanyUpdateOneRequiredWithoutFacilitiesNestedInput = {
    create?: Prisma.XOR<Prisma.MdParentCompanyCreateWithoutFacilitiesInput, Prisma.MdParentCompanyUncheckedCreateWithoutFacilitiesInput>;
    connectOrCreate?: Prisma.MdParentCompanyCreateOrConnectWithoutFacilitiesInput;
    upsert?: Prisma.MdParentCompanyUpsertWithoutFacilitiesInput;
    connect?: Prisma.MdParentCompanyWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.MdParentCompanyUpdateToOneWithWhereWithoutFacilitiesInput, Prisma.MdParentCompanyUpdateWithoutFacilitiesInput>, Prisma.MdParentCompanyUncheckedUpdateWithoutFacilitiesInput>;
};
export type MdParentCompanyCreateNestedOneWithoutMaquilaRelationsInput = {
    create?: Prisma.XOR<Prisma.MdParentCompanyCreateWithoutMaquilaRelationsInput, Prisma.MdParentCompanyUncheckedCreateWithoutMaquilaRelationsInput>;
    connectOrCreate?: Prisma.MdParentCompanyCreateOrConnectWithoutMaquilaRelationsInput;
    connect?: Prisma.MdParentCompanyWhereUniqueInput;
};
export type MdParentCompanyUpdateOneRequiredWithoutMaquilaRelationsNestedInput = {
    create?: Prisma.XOR<Prisma.MdParentCompanyCreateWithoutMaquilaRelationsInput, Prisma.MdParentCompanyUncheckedCreateWithoutMaquilaRelationsInput>;
    connectOrCreate?: Prisma.MdParentCompanyCreateOrConnectWithoutMaquilaRelationsInput;
    upsert?: Prisma.MdParentCompanyUpsertWithoutMaquilaRelationsInput;
    connect?: Prisma.MdParentCompanyWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.MdParentCompanyUpdateToOneWithWhereWithoutMaquilaRelationsInput, Prisma.MdParentCompanyUpdateWithoutMaquilaRelationsInput>, Prisma.MdParentCompanyUncheckedUpdateWithoutMaquilaRelationsInput>;
};
export type MdParentCompanyCreateNestedOneWithoutUsersInput = {
    create?: Prisma.XOR<Prisma.MdParentCompanyCreateWithoutUsersInput, Prisma.MdParentCompanyUncheckedCreateWithoutUsersInput>;
    connectOrCreate?: Prisma.MdParentCompanyCreateOrConnectWithoutUsersInput;
    connect?: Prisma.MdParentCompanyWhereUniqueInput;
};
export type MdParentCompanyUpdateOneRequiredWithoutUsersNestedInput = {
    create?: Prisma.XOR<Prisma.MdParentCompanyCreateWithoutUsersInput, Prisma.MdParentCompanyUncheckedCreateWithoutUsersInput>;
    connectOrCreate?: Prisma.MdParentCompanyCreateOrConnectWithoutUsersInput;
    upsert?: Prisma.MdParentCompanyUpsertWithoutUsersInput;
    connect?: Prisma.MdParentCompanyWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.MdParentCompanyUpdateToOneWithWhereWithoutUsersInput, Prisma.MdParentCompanyUpdateWithoutUsersInput>, Prisma.MdParentCompanyUncheckedUpdateWithoutUsersInput>;
};
export type MdParentCompanyCreateNestedOneWithoutAuditLogsInput = {
    create?: Prisma.XOR<Prisma.MdParentCompanyCreateWithoutAuditLogsInput, Prisma.MdParentCompanyUncheckedCreateWithoutAuditLogsInput>;
    connectOrCreate?: Prisma.MdParentCompanyCreateOrConnectWithoutAuditLogsInput;
    connect?: Prisma.MdParentCompanyWhereUniqueInput;
};
export type MdParentCompanyUpdateOneWithoutAuditLogsNestedInput = {
    create?: Prisma.XOR<Prisma.MdParentCompanyCreateWithoutAuditLogsInput, Prisma.MdParentCompanyUncheckedCreateWithoutAuditLogsInput>;
    connectOrCreate?: Prisma.MdParentCompanyCreateOrConnectWithoutAuditLogsInput;
    upsert?: Prisma.MdParentCompanyUpsertWithoutAuditLogsInput;
    disconnect?: Prisma.MdParentCompanyWhereInput | boolean;
    delete?: Prisma.MdParentCompanyWhereInput | boolean;
    connect?: Prisma.MdParentCompanyWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.MdParentCompanyUpdateToOneWithWhereWithoutAuditLogsInput, Prisma.MdParentCompanyUpdateWithoutAuditLogsInput>, Prisma.MdParentCompanyUncheckedUpdateWithoutAuditLogsInput>;
};
export type MdParentCompanyCreateWithoutBrandsInput = {
    codParentCompany: string;
    codGlnParentCompany: string;
    nameParentCompany: string;
    categoryParentCompany: number;
    numRucParentCompany: string;
    codUbigeoParentCompany: number;
    addressParentCompany: string;
    gpsLocationParentCompany?: string | null;
    emailParentCompany: string;
    cellularParentCompany: string;
    webParentCompany?: string | null;
    canisterDataParentCompany?: string | null;
    canisterAssetsParentCompany?: string | null;
    logoParentCompany?: runtime.Bytes | null;
    stateParentCompany?: number;
    codUsuarioCargaDl: string;
    fehProcesoCargaDl?: Date | string;
    fehProcesoModifDl?: Date | string;
    desAccion: string;
    flgStatutActif?: number;
    ordenes?: Prisma.MdOrdenPedidoCreateNestedManyWithoutParentCompanyInput;
    facilities?: Prisma.MdFacilityCreateNestedManyWithoutParentCompanyInput;
    maquilaRelations?: Prisma.MdParentCompanyMaquilaCreateNestedManyWithoutParentCompanyInput;
    users?: Prisma.MdUserReoCreateNestedManyWithoutParentCompanyInput;
    auditLogs?: Prisma.LgParentCompanyCreateNestedManyWithoutParentCompanyInput;
};
export type MdParentCompanyUncheckedCreateWithoutBrandsInput = {
    idDlkParentCompany?: number;
    codParentCompany: string;
    codGlnParentCompany: string;
    nameParentCompany: string;
    categoryParentCompany: number;
    numRucParentCompany: string;
    codUbigeoParentCompany: number;
    addressParentCompany: string;
    gpsLocationParentCompany?: string | null;
    emailParentCompany: string;
    cellularParentCompany: string;
    webParentCompany?: string | null;
    canisterDataParentCompany?: string | null;
    canisterAssetsParentCompany?: string | null;
    logoParentCompany?: runtime.Bytes | null;
    stateParentCompany?: number;
    codUsuarioCargaDl: string;
    fehProcesoCargaDl?: Date | string;
    fehProcesoModifDl?: Date | string;
    desAccion: string;
    flgStatutActif?: number;
    ordenes?: Prisma.MdOrdenPedidoUncheckedCreateNestedManyWithoutParentCompanyInput;
    facilities?: Prisma.MdFacilityUncheckedCreateNestedManyWithoutParentCompanyInput;
    maquilaRelations?: Prisma.MdParentCompanyMaquilaUncheckedCreateNestedManyWithoutParentCompanyInput;
    users?: Prisma.MdUserReoUncheckedCreateNestedManyWithoutParentCompanyInput;
    auditLogs?: Prisma.LgParentCompanyUncheckedCreateNestedManyWithoutParentCompanyInput;
};
export type MdParentCompanyCreateOrConnectWithoutBrandsInput = {
    where: Prisma.MdParentCompanyWhereUniqueInput;
    create: Prisma.XOR<Prisma.MdParentCompanyCreateWithoutBrandsInput, Prisma.MdParentCompanyUncheckedCreateWithoutBrandsInput>;
};
export type MdParentCompanyUpsertWithoutBrandsInput = {
    update: Prisma.XOR<Prisma.MdParentCompanyUpdateWithoutBrandsInput, Prisma.MdParentCompanyUncheckedUpdateWithoutBrandsInput>;
    create: Prisma.XOR<Prisma.MdParentCompanyCreateWithoutBrandsInput, Prisma.MdParentCompanyUncheckedCreateWithoutBrandsInput>;
    where?: Prisma.MdParentCompanyWhereInput;
};
export type MdParentCompanyUpdateToOneWithWhereWithoutBrandsInput = {
    where?: Prisma.MdParentCompanyWhereInput;
    data: Prisma.XOR<Prisma.MdParentCompanyUpdateWithoutBrandsInput, Prisma.MdParentCompanyUncheckedUpdateWithoutBrandsInput>;
};
export type MdParentCompanyUpdateWithoutBrandsInput = {
    codParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    codGlnParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    nameParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    categoryParentCompany?: Prisma.IntFieldUpdateOperationsInput | number;
    numRucParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    codUbigeoParentCompany?: Prisma.IntFieldUpdateOperationsInput | number;
    addressParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    gpsLocationParentCompany?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    emailParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    cellularParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    webParentCompany?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    canisterDataParentCompany?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    canisterAssetsParentCompany?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logoParentCompany?: Prisma.NullableBytesFieldUpdateOperationsInput | runtime.Bytes | null;
    stateParentCompany?: Prisma.IntFieldUpdateOperationsInput | number;
    codUsuarioCargaDl?: Prisma.StringFieldUpdateOperationsInput | string;
    fehProcesoCargaDl?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    fehProcesoModifDl?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    desAccion?: Prisma.StringFieldUpdateOperationsInput | string;
    flgStatutActif?: Prisma.IntFieldUpdateOperationsInput | number;
    ordenes?: Prisma.MdOrdenPedidoUpdateManyWithoutParentCompanyNestedInput;
    facilities?: Prisma.MdFacilityUpdateManyWithoutParentCompanyNestedInput;
    maquilaRelations?: Prisma.MdParentCompanyMaquilaUpdateManyWithoutParentCompanyNestedInput;
    users?: Prisma.MdUserReoUpdateManyWithoutParentCompanyNestedInput;
    auditLogs?: Prisma.LgParentCompanyUpdateManyWithoutParentCompanyNestedInput;
};
export type MdParentCompanyUncheckedUpdateWithoutBrandsInput = {
    idDlkParentCompany?: Prisma.IntFieldUpdateOperationsInput | number;
    codParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    codGlnParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    nameParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    categoryParentCompany?: Prisma.IntFieldUpdateOperationsInput | number;
    numRucParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    codUbigeoParentCompany?: Prisma.IntFieldUpdateOperationsInput | number;
    addressParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    gpsLocationParentCompany?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    emailParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    cellularParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    webParentCompany?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    canisterDataParentCompany?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    canisterAssetsParentCompany?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logoParentCompany?: Prisma.NullableBytesFieldUpdateOperationsInput | runtime.Bytes | null;
    stateParentCompany?: Prisma.IntFieldUpdateOperationsInput | number;
    codUsuarioCargaDl?: Prisma.StringFieldUpdateOperationsInput | string;
    fehProcesoCargaDl?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    fehProcesoModifDl?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    desAccion?: Prisma.StringFieldUpdateOperationsInput | string;
    flgStatutActif?: Prisma.IntFieldUpdateOperationsInput | number;
    ordenes?: Prisma.MdOrdenPedidoUncheckedUpdateManyWithoutParentCompanyNestedInput;
    facilities?: Prisma.MdFacilityUncheckedUpdateManyWithoutParentCompanyNestedInput;
    maquilaRelations?: Prisma.MdParentCompanyMaquilaUncheckedUpdateManyWithoutParentCompanyNestedInput;
    users?: Prisma.MdUserReoUncheckedUpdateManyWithoutParentCompanyNestedInput;
    auditLogs?: Prisma.LgParentCompanyUncheckedUpdateManyWithoutParentCompanyNestedInput;
};
export type MdParentCompanyCreateWithoutOrdenesInput = {
    codParentCompany: string;
    codGlnParentCompany: string;
    nameParentCompany: string;
    categoryParentCompany: number;
    numRucParentCompany: string;
    codUbigeoParentCompany: number;
    addressParentCompany: string;
    gpsLocationParentCompany?: string | null;
    emailParentCompany: string;
    cellularParentCompany: string;
    webParentCompany?: string | null;
    canisterDataParentCompany?: string | null;
    canisterAssetsParentCompany?: string | null;
    logoParentCompany?: runtime.Bytes | null;
    stateParentCompany?: number;
    codUsuarioCargaDl: string;
    fehProcesoCargaDl?: Date | string;
    fehProcesoModifDl?: Date | string;
    desAccion: string;
    flgStatutActif?: number;
    brands?: Prisma.MdBrandCreateNestedManyWithoutParentCompanyInput;
    facilities?: Prisma.MdFacilityCreateNestedManyWithoutParentCompanyInput;
    maquilaRelations?: Prisma.MdParentCompanyMaquilaCreateNestedManyWithoutParentCompanyInput;
    users?: Prisma.MdUserReoCreateNestedManyWithoutParentCompanyInput;
    auditLogs?: Prisma.LgParentCompanyCreateNestedManyWithoutParentCompanyInput;
};
export type MdParentCompanyUncheckedCreateWithoutOrdenesInput = {
    idDlkParentCompany?: number;
    codParentCompany: string;
    codGlnParentCompany: string;
    nameParentCompany: string;
    categoryParentCompany: number;
    numRucParentCompany: string;
    codUbigeoParentCompany: number;
    addressParentCompany: string;
    gpsLocationParentCompany?: string | null;
    emailParentCompany: string;
    cellularParentCompany: string;
    webParentCompany?: string | null;
    canisterDataParentCompany?: string | null;
    canisterAssetsParentCompany?: string | null;
    logoParentCompany?: runtime.Bytes | null;
    stateParentCompany?: number;
    codUsuarioCargaDl: string;
    fehProcesoCargaDl?: Date | string;
    fehProcesoModifDl?: Date | string;
    desAccion: string;
    flgStatutActif?: number;
    brands?: Prisma.MdBrandUncheckedCreateNestedManyWithoutParentCompanyInput;
    facilities?: Prisma.MdFacilityUncheckedCreateNestedManyWithoutParentCompanyInput;
    maquilaRelations?: Prisma.MdParentCompanyMaquilaUncheckedCreateNestedManyWithoutParentCompanyInput;
    users?: Prisma.MdUserReoUncheckedCreateNestedManyWithoutParentCompanyInput;
    auditLogs?: Prisma.LgParentCompanyUncheckedCreateNestedManyWithoutParentCompanyInput;
};
export type MdParentCompanyCreateOrConnectWithoutOrdenesInput = {
    where: Prisma.MdParentCompanyWhereUniqueInput;
    create: Prisma.XOR<Prisma.MdParentCompanyCreateWithoutOrdenesInput, Prisma.MdParentCompanyUncheckedCreateWithoutOrdenesInput>;
};
export type MdParentCompanyUpsertWithoutOrdenesInput = {
    update: Prisma.XOR<Prisma.MdParentCompanyUpdateWithoutOrdenesInput, Prisma.MdParentCompanyUncheckedUpdateWithoutOrdenesInput>;
    create: Prisma.XOR<Prisma.MdParentCompanyCreateWithoutOrdenesInput, Prisma.MdParentCompanyUncheckedCreateWithoutOrdenesInput>;
    where?: Prisma.MdParentCompanyWhereInput;
};
export type MdParentCompanyUpdateToOneWithWhereWithoutOrdenesInput = {
    where?: Prisma.MdParentCompanyWhereInput;
    data: Prisma.XOR<Prisma.MdParentCompanyUpdateWithoutOrdenesInput, Prisma.MdParentCompanyUncheckedUpdateWithoutOrdenesInput>;
};
export type MdParentCompanyUpdateWithoutOrdenesInput = {
    codParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    codGlnParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    nameParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    categoryParentCompany?: Prisma.IntFieldUpdateOperationsInput | number;
    numRucParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    codUbigeoParentCompany?: Prisma.IntFieldUpdateOperationsInput | number;
    addressParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    gpsLocationParentCompany?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    emailParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    cellularParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    webParentCompany?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    canisterDataParentCompany?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    canisterAssetsParentCompany?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logoParentCompany?: Prisma.NullableBytesFieldUpdateOperationsInput | runtime.Bytes | null;
    stateParentCompany?: Prisma.IntFieldUpdateOperationsInput | number;
    codUsuarioCargaDl?: Prisma.StringFieldUpdateOperationsInput | string;
    fehProcesoCargaDl?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    fehProcesoModifDl?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    desAccion?: Prisma.StringFieldUpdateOperationsInput | string;
    flgStatutActif?: Prisma.IntFieldUpdateOperationsInput | number;
    brands?: Prisma.MdBrandUpdateManyWithoutParentCompanyNestedInput;
    facilities?: Prisma.MdFacilityUpdateManyWithoutParentCompanyNestedInput;
    maquilaRelations?: Prisma.MdParentCompanyMaquilaUpdateManyWithoutParentCompanyNestedInput;
    users?: Prisma.MdUserReoUpdateManyWithoutParentCompanyNestedInput;
    auditLogs?: Prisma.LgParentCompanyUpdateManyWithoutParentCompanyNestedInput;
};
export type MdParentCompanyUncheckedUpdateWithoutOrdenesInput = {
    idDlkParentCompany?: Prisma.IntFieldUpdateOperationsInput | number;
    codParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    codGlnParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    nameParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    categoryParentCompany?: Prisma.IntFieldUpdateOperationsInput | number;
    numRucParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    codUbigeoParentCompany?: Prisma.IntFieldUpdateOperationsInput | number;
    addressParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    gpsLocationParentCompany?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    emailParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    cellularParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    webParentCompany?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    canisterDataParentCompany?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    canisterAssetsParentCompany?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logoParentCompany?: Prisma.NullableBytesFieldUpdateOperationsInput | runtime.Bytes | null;
    stateParentCompany?: Prisma.IntFieldUpdateOperationsInput | number;
    codUsuarioCargaDl?: Prisma.StringFieldUpdateOperationsInput | string;
    fehProcesoCargaDl?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    fehProcesoModifDl?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    desAccion?: Prisma.StringFieldUpdateOperationsInput | string;
    flgStatutActif?: Prisma.IntFieldUpdateOperationsInput | number;
    brands?: Prisma.MdBrandUncheckedUpdateManyWithoutParentCompanyNestedInput;
    facilities?: Prisma.MdFacilityUncheckedUpdateManyWithoutParentCompanyNestedInput;
    maquilaRelations?: Prisma.MdParentCompanyMaquilaUncheckedUpdateManyWithoutParentCompanyNestedInput;
    users?: Prisma.MdUserReoUncheckedUpdateManyWithoutParentCompanyNestedInput;
    auditLogs?: Prisma.LgParentCompanyUncheckedUpdateManyWithoutParentCompanyNestedInput;
};
export type MdParentCompanyCreateWithoutFacilitiesInput = {
    codParentCompany: string;
    codGlnParentCompany: string;
    nameParentCompany: string;
    categoryParentCompany: number;
    numRucParentCompany: string;
    codUbigeoParentCompany: number;
    addressParentCompany: string;
    gpsLocationParentCompany?: string | null;
    emailParentCompany: string;
    cellularParentCompany: string;
    webParentCompany?: string | null;
    canisterDataParentCompany?: string | null;
    canisterAssetsParentCompany?: string | null;
    logoParentCompany?: runtime.Bytes | null;
    stateParentCompany?: number;
    codUsuarioCargaDl: string;
    fehProcesoCargaDl?: Date | string;
    fehProcesoModifDl?: Date | string;
    desAccion: string;
    flgStatutActif?: number;
    brands?: Prisma.MdBrandCreateNestedManyWithoutParentCompanyInput;
    ordenes?: Prisma.MdOrdenPedidoCreateNestedManyWithoutParentCompanyInput;
    maquilaRelations?: Prisma.MdParentCompanyMaquilaCreateNestedManyWithoutParentCompanyInput;
    users?: Prisma.MdUserReoCreateNestedManyWithoutParentCompanyInput;
    auditLogs?: Prisma.LgParentCompanyCreateNestedManyWithoutParentCompanyInput;
};
export type MdParentCompanyUncheckedCreateWithoutFacilitiesInput = {
    idDlkParentCompany?: number;
    codParentCompany: string;
    codGlnParentCompany: string;
    nameParentCompany: string;
    categoryParentCompany: number;
    numRucParentCompany: string;
    codUbigeoParentCompany: number;
    addressParentCompany: string;
    gpsLocationParentCompany?: string | null;
    emailParentCompany: string;
    cellularParentCompany: string;
    webParentCompany?: string | null;
    canisterDataParentCompany?: string | null;
    canisterAssetsParentCompany?: string | null;
    logoParentCompany?: runtime.Bytes | null;
    stateParentCompany?: number;
    codUsuarioCargaDl: string;
    fehProcesoCargaDl?: Date | string;
    fehProcesoModifDl?: Date | string;
    desAccion: string;
    flgStatutActif?: number;
    brands?: Prisma.MdBrandUncheckedCreateNestedManyWithoutParentCompanyInput;
    ordenes?: Prisma.MdOrdenPedidoUncheckedCreateNestedManyWithoutParentCompanyInput;
    maquilaRelations?: Prisma.MdParentCompanyMaquilaUncheckedCreateNestedManyWithoutParentCompanyInput;
    users?: Prisma.MdUserReoUncheckedCreateNestedManyWithoutParentCompanyInput;
    auditLogs?: Prisma.LgParentCompanyUncheckedCreateNestedManyWithoutParentCompanyInput;
};
export type MdParentCompanyCreateOrConnectWithoutFacilitiesInput = {
    where: Prisma.MdParentCompanyWhereUniqueInput;
    create: Prisma.XOR<Prisma.MdParentCompanyCreateWithoutFacilitiesInput, Prisma.MdParentCompanyUncheckedCreateWithoutFacilitiesInput>;
};
export type MdParentCompanyUpsertWithoutFacilitiesInput = {
    update: Prisma.XOR<Prisma.MdParentCompanyUpdateWithoutFacilitiesInput, Prisma.MdParentCompanyUncheckedUpdateWithoutFacilitiesInput>;
    create: Prisma.XOR<Prisma.MdParentCompanyCreateWithoutFacilitiesInput, Prisma.MdParentCompanyUncheckedCreateWithoutFacilitiesInput>;
    where?: Prisma.MdParentCompanyWhereInput;
};
export type MdParentCompanyUpdateToOneWithWhereWithoutFacilitiesInput = {
    where?: Prisma.MdParentCompanyWhereInput;
    data: Prisma.XOR<Prisma.MdParentCompanyUpdateWithoutFacilitiesInput, Prisma.MdParentCompanyUncheckedUpdateWithoutFacilitiesInput>;
};
export type MdParentCompanyUpdateWithoutFacilitiesInput = {
    codParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    codGlnParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    nameParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    categoryParentCompany?: Prisma.IntFieldUpdateOperationsInput | number;
    numRucParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    codUbigeoParentCompany?: Prisma.IntFieldUpdateOperationsInput | number;
    addressParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    gpsLocationParentCompany?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    emailParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    cellularParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    webParentCompany?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    canisterDataParentCompany?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    canisterAssetsParentCompany?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logoParentCompany?: Prisma.NullableBytesFieldUpdateOperationsInput | runtime.Bytes | null;
    stateParentCompany?: Prisma.IntFieldUpdateOperationsInput | number;
    codUsuarioCargaDl?: Prisma.StringFieldUpdateOperationsInput | string;
    fehProcesoCargaDl?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    fehProcesoModifDl?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    desAccion?: Prisma.StringFieldUpdateOperationsInput | string;
    flgStatutActif?: Prisma.IntFieldUpdateOperationsInput | number;
    brands?: Prisma.MdBrandUpdateManyWithoutParentCompanyNestedInput;
    ordenes?: Prisma.MdOrdenPedidoUpdateManyWithoutParentCompanyNestedInput;
    maquilaRelations?: Prisma.MdParentCompanyMaquilaUpdateManyWithoutParentCompanyNestedInput;
    users?: Prisma.MdUserReoUpdateManyWithoutParentCompanyNestedInput;
    auditLogs?: Prisma.LgParentCompanyUpdateManyWithoutParentCompanyNestedInput;
};
export type MdParentCompanyUncheckedUpdateWithoutFacilitiesInput = {
    idDlkParentCompany?: Prisma.IntFieldUpdateOperationsInput | number;
    codParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    codGlnParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    nameParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    categoryParentCompany?: Prisma.IntFieldUpdateOperationsInput | number;
    numRucParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    codUbigeoParentCompany?: Prisma.IntFieldUpdateOperationsInput | number;
    addressParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    gpsLocationParentCompany?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    emailParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    cellularParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    webParentCompany?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    canisterDataParentCompany?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    canisterAssetsParentCompany?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logoParentCompany?: Prisma.NullableBytesFieldUpdateOperationsInput | runtime.Bytes | null;
    stateParentCompany?: Prisma.IntFieldUpdateOperationsInput | number;
    codUsuarioCargaDl?: Prisma.StringFieldUpdateOperationsInput | string;
    fehProcesoCargaDl?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    fehProcesoModifDl?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    desAccion?: Prisma.StringFieldUpdateOperationsInput | string;
    flgStatutActif?: Prisma.IntFieldUpdateOperationsInput | number;
    brands?: Prisma.MdBrandUncheckedUpdateManyWithoutParentCompanyNestedInput;
    ordenes?: Prisma.MdOrdenPedidoUncheckedUpdateManyWithoutParentCompanyNestedInput;
    maquilaRelations?: Prisma.MdParentCompanyMaquilaUncheckedUpdateManyWithoutParentCompanyNestedInput;
    users?: Prisma.MdUserReoUncheckedUpdateManyWithoutParentCompanyNestedInput;
    auditLogs?: Prisma.LgParentCompanyUncheckedUpdateManyWithoutParentCompanyNestedInput;
};
export type MdParentCompanyCreateWithoutMaquilaRelationsInput = {
    codParentCompany: string;
    codGlnParentCompany: string;
    nameParentCompany: string;
    categoryParentCompany: number;
    numRucParentCompany: string;
    codUbigeoParentCompany: number;
    addressParentCompany: string;
    gpsLocationParentCompany?: string | null;
    emailParentCompany: string;
    cellularParentCompany: string;
    webParentCompany?: string | null;
    canisterDataParentCompany?: string | null;
    canisterAssetsParentCompany?: string | null;
    logoParentCompany?: runtime.Bytes | null;
    stateParentCompany?: number;
    codUsuarioCargaDl: string;
    fehProcesoCargaDl?: Date | string;
    fehProcesoModifDl?: Date | string;
    desAccion: string;
    flgStatutActif?: number;
    brands?: Prisma.MdBrandCreateNestedManyWithoutParentCompanyInput;
    ordenes?: Prisma.MdOrdenPedidoCreateNestedManyWithoutParentCompanyInput;
    facilities?: Prisma.MdFacilityCreateNestedManyWithoutParentCompanyInput;
    users?: Prisma.MdUserReoCreateNestedManyWithoutParentCompanyInput;
    auditLogs?: Prisma.LgParentCompanyCreateNestedManyWithoutParentCompanyInput;
};
export type MdParentCompanyUncheckedCreateWithoutMaquilaRelationsInput = {
    idDlkParentCompany?: number;
    codParentCompany: string;
    codGlnParentCompany: string;
    nameParentCompany: string;
    categoryParentCompany: number;
    numRucParentCompany: string;
    codUbigeoParentCompany: number;
    addressParentCompany: string;
    gpsLocationParentCompany?: string | null;
    emailParentCompany: string;
    cellularParentCompany: string;
    webParentCompany?: string | null;
    canisterDataParentCompany?: string | null;
    canisterAssetsParentCompany?: string | null;
    logoParentCompany?: runtime.Bytes | null;
    stateParentCompany?: number;
    codUsuarioCargaDl: string;
    fehProcesoCargaDl?: Date | string;
    fehProcesoModifDl?: Date | string;
    desAccion: string;
    flgStatutActif?: number;
    brands?: Prisma.MdBrandUncheckedCreateNestedManyWithoutParentCompanyInput;
    ordenes?: Prisma.MdOrdenPedidoUncheckedCreateNestedManyWithoutParentCompanyInput;
    facilities?: Prisma.MdFacilityUncheckedCreateNestedManyWithoutParentCompanyInput;
    users?: Prisma.MdUserReoUncheckedCreateNestedManyWithoutParentCompanyInput;
    auditLogs?: Prisma.LgParentCompanyUncheckedCreateNestedManyWithoutParentCompanyInput;
};
export type MdParentCompanyCreateOrConnectWithoutMaquilaRelationsInput = {
    where: Prisma.MdParentCompanyWhereUniqueInput;
    create: Prisma.XOR<Prisma.MdParentCompanyCreateWithoutMaquilaRelationsInput, Prisma.MdParentCompanyUncheckedCreateWithoutMaquilaRelationsInput>;
};
export type MdParentCompanyUpsertWithoutMaquilaRelationsInput = {
    update: Prisma.XOR<Prisma.MdParentCompanyUpdateWithoutMaquilaRelationsInput, Prisma.MdParentCompanyUncheckedUpdateWithoutMaquilaRelationsInput>;
    create: Prisma.XOR<Prisma.MdParentCompanyCreateWithoutMaquilaRelationsInput, Prisma.MdParentCompanyUncheckedCreateWithoutMaquilaRelationsInput>;
    where?: Prisma.MdParentCompanyWhereInput;
};
export type MdParentCompanyUpdateToOneWithWhereWithoutMaquilaRelationsInput = {
    where?: Prisma.MdParentCompanyWhereInput;
    data: Prisma.XOR<Prisma.MdParentCompanyUpdateWithoutMaquilaRelationsInput, Prisma.MdParentCompanyUncheckedUpdateWithoutMaquilaRelationsInput>;
};
export type MdParentCompanyUpdateWithoutMaquilaRelationsInput = {
    codParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    codGlnParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    nameParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    categoryParentCompany?: Prisma.IntFieldUpdateOperationsInput | number;
    numRucParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    codUbigeoParentCompany?: Prisma.IntFieldUpdateOperationsInput | number;
    addressParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    gpsLocationParentCompany?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    emailParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    cellularParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    webParentCompany?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    canisterDataParentCompany?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    canisterAssetsParentCompany?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logoParentCompany?: Prisma.NullableBytesFieldUpdateOperationsInput | runtime.Bytes | null;
    stateParentCompany?: Prisma.IntFieldUpdateOperationsInput | number;
    codUsuarioCargaDl?: Prisma.StringFieldUpdateOperationsInput | string;
    fehProcesoCargaDl?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    fehProcesoModifDl?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    desAccion?: Prisma.StringFieldUpdateOperationsInput | string;
    flgStatutActif?: Prisma.IntFieldUpdateOperationsInput | number;
    brands?: Prisma.MdBrandUpdateManyWithoutParentCompanyNestedInput;
    ordenes?: Prisma.MdOrdenPedidoUpdateManyWithoutParentCompanyNestedInput;
    facilities?: Prisma.MdFacilityUpdateManyWithoutParentCompanyNestedInput;
    users?: Prisma.MdUserReoUpdateManyWithoutParentCompanyNestedInput;
    auditLogs?: Prisma.LgParentCompanyUpdateManyWithoutParentCompanyNestedInput;
};
export type MdParentCompanyUncheckedUpdateWithoutMaquilaRelationsInput = {
    idDlkParentCompany?: Prisma.IntFieldUpdateOperationsInput | number;
    codParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    codGlnParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    nameParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    categoryParentCompany?: Prisma.IntFieldUpdateOperationsInput | number;
    numRucParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    codUbigeoParentCompany?: Prisma.IntFieldUpdateOperationsInput | number;
    addressParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    gpsLocationParentCompany?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    emailParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    cellularParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    webParentCompany?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    canisterDataParentCompany?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    canisterAssetsParentCompany?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logoParentCompany?: Prisma.NullableBytesFieldUpdateOperationsInput | runtime.Bytes | null;
    stateParentCompany?: Prisma.IntFieldUpdateOperationsInput | number;
    codUsuarioCargaDl?: Prisma.StringFieldUpdateOperationsInput | string;
    fehProcesoCargaDl?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    fehProcesoModifDl?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    desAccion?: Prisma.StringFieldUpdateOperationsInput | string;
    flgStatutActif?: Prisma.IntFieldUpdateOperationsInput | number;
    brands?: Prisma.MdBrandUncheckedUpdateManyWithoutParentCompanyNestedInput;
    ordenes?: Prisma.MdOrdenPedidoUncheckedUpdateManyWithoutParentCompanyNestedInput;
    facilities?: Prisma.MdFacilityUncheckedUpdateManyWithoutParentCompanyNestedInput;
    users?: Prisma.MdUserReoUncheckedUpdateManyWithoutParentCompanyNestedInput;
    auditLogs?: Prisma.LgParentCompanyUncheckedUpdateManyWithoutParentCompanyNestedInput;
};
export type MdParentCompanyCreateWithoutUsersInput = {
    codParentCompany: string;
    codGlnParentCompany: string;
    nameParentCompany: string;
    categoryParentCompany: number;
    numRucParentCompany: string;
    codUbigeoParentCompany: number;
    addressParentCompany: string;
    gpsLocationParentCompany?: string | null;
    emailParentCompany: string;
    cellularParentCompany: string;
    webParentCompany?: string | null;
    canisterDataParentCompany?: string | null;
    canisterAssetsParentCompany?: string | null;
    logoParentCompany?: runtime.Bytes | null;
    stateParentCompany?: number;
    codUsuarioCargaDl: string;
    fehProcesoCargaDl?: Date | string;
    fehProcesoModifDl?: Date | string;
    desAccion: string;
    flgStatutActif?: number;
    brands?: Prisma.MdBrandCreateNestedManyWithoutParentCompanyInput;
    ordenes?: Prisma.MdOrdenPedidoCreateNestedManyWithoutParentCompanyInput;
    facilities?: Prisma.MdFacilityCreateNestedManyWithoutParentCompanyInput;
    maquilaRelations?: Prisma.MdParentCompanyMaquilaCreateNestedManyWithoutParentCompanyInput;
    auditLogs?: Prisma.LgParentCompanyCreateNestedManyWithoutParentCompanyInput;
};
export type MdParentCompanyUncheckedCreateWithoutUsersInput = {
    idDlkParentCompany?: number;
    codParentCompany: string;
    codGlnParentCompany: string;
    nameParentCompany: string;
    categoryParentCompany: number;
    numRucParentCompany: string;
    codUbigeoParentCompany: number;
    addressParentCompany: string;
    gpsLocationParentCompany?: string | null;
    emailParentCompany: string;
    cellularParentCompany: string;
    webParentCompany?: string | null;
    canisterDataParentCompany?: string | null;
    canisterAssetsParentCompany?: string | null;
    logoParentCompany?: runtime.Bytes | null;
    stateParentCompany?: number;
    codUsuarioCargaDl: string;
    fehProcesoCargaDl?: Date | string;
    fehProcesoModifDl?: Date | string;
    desAccion: string;
    flgStatutActif?: number;
    brands?: Prisma.MdBrandUncheckedCreateNestedManyWithoutParentCompanyInput;
    ordenes?: Prisma.MdOrdenPedidoUncheckedCreateNestedManyWithoutParentCompanyInput;
    facilities?: Prisma.MdFacilityUncheckedCreateNestedManyWithoutParentCompanyInput;
    maquilaRelations?: Prisma.MdParentCompanyMaquilaUncheckedCreateNestedManyWithoutParentCompanyInput;
    auditLogs?: Prisma.LgParentCompanyUncheckedCreateNestedManyWithoutParentCompanyInput;
};
export type MdParentCompanyCreateOrConnectWithoutUsersInput = {
    where: Prisma.MdParentCompanyWhereUniqueInput;
    create: Prisma.XOR<Prisma.MdParentCompanyCreateWithoutUsersInput, Prisma.MdParentCompanyUncheckedCreateWithoutUsersInput>;
};
export type MdParentCompanyUpsertWithoutUsersInput = {
    update: Prisma.XOR<Prisma.MdParentCompanyUpdateWithoutUsersInput, Prisma.MdParentCompanyUncheckedUpdateWithoutUsersInput>;
    create: Prisma.XOR<Prisma.MdParentCompanyCreateWithoutUsersInput, Prisma.MdParentCompanyUncheckedCreateWithoutUsersInput>;
    where?: Prisma.MdParentCompanyWhereInput;
};
export type MdParentCompanyUpdateToOneWithWhereWithoutUsersInput = {
    where?: Prisma.MdParentCompanyWhereInput;
    data: Prisma.XOR<Prisma.MdParentCompanyUpdateWithoutUsersInput, Prisma.MdParentCompanyUncheckedUpdateWithoutUsersInput>;
};
export type MdParentCompanyUpdateWithoutUsersInput = {
    codParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    codGlnParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    nameParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    categoryParentCompany?: Prisma.IntFieldUpdateOperationsInput | number;
    numRucParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    codUbigeoParentCompany?: Prisma.IntFieldUpdateOperationsInput | number;
    addressParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    gpsLocationParentCompany?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    emailParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    cellularParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    webParentCompany?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    canisterDataParentCompany?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    canisterAssetsParentCompany?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logoParentCompany?: Prisma.NullableBytesFieldUpdateOperationsInput | runtime.Bytes | null;
    stateParentCompany?: Prisma.IntFieldUpdateOperationsInput | number;
    codUsuarioCargaDl?: Prisma.StringFieldUpdateOperationsInput | string;
    fehProcesoCargaDl?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    fehProcesoModifDl?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    desAccion?: Prisma.StringFieldUpdateOperationsInput | string;
    flgStatutActif?: Prisma.IntFieldUpdateOperationsInput | number;
    brands?: Prisma.MdBrandUpdateManyWithoutParentCompanyNestedInput;
    ordenes?: Prisma.MdOrdenPedidoUpdateManyWithoutParentCompanyNestedInput;
    facilities?: Prisma.MdFacilityUpdateManyWithoutParentCompanyNestedInput;
    maquilaRelations?: Prisma.MdParentCompanyMaquilaUpdateManyWithoutParentCompanyNestedInput;
    auditLogs?: Prisma.LgParentCompanyUpdateManyWithoutParentCompanyNestedInput;
};
export type MdParentCompanyUncheckedUpdateWithoutUsersInput = {
    idDlkParentCompany?: Prisma.IntFieldUpdateOperationsInput | number;
    codParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    codGlnParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    nameParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    categoryParentCompany?: Prisma.IntFieldUpdateOperationsInput | number;
    numRucParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    codUbigeoParentCompany?: Prisma.IntFieldUpdateOperationsInput | number;
    addressParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    gpsLocationParentCompany?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    emailParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    cellularParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    webParentCompany?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    canisterDataParentCompany?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    canisterAssetsParentCompany?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logoParentCompany?: Prisma.NullableBytesFieldUpdateOperationsInput | runtime.Bytes | null;
    stateParentCompany?: Prisma.IntFieldUpdateOperationsInput | number;
    codUsuarioCargaDl?: Prisma.StringFieldUpdateOperationsInput | string;
    fehProcesoCargaDl?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    fehProcesoModifDl?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    desAccion?: Prisma.StringFieldUpdateOperationsInput | string;
    flgStatutActif?: Prisma.IntFieldUpdateOperationsInput | number;
    brands?: Prisma.MdBrandUncheckedUpdateManyWithoutParentCompanyNestedInput;
    ordenes?: Prisma.MdOrdenPedidoUncheckedUpdateManyWithoutParentCompanyNestedInput;
    facilities?: Prisma.MdFacilityUncheckedUpdateManyWithoutParentCompanyNestedInput;
    maquilaRelations?: Prisma.MdParentCompanyMaquilaUncheckedUpdateManyWithoutParentCompanyNestedInput;
    auditLogs?: Prisma.LgParentCompanyUncheckedUpdateManyWithoutParentCompanyNestedInput;
};
export type MdParentCompanyCreateWithoutAuditLogsInput = {
    codParentCompany: string;
    codGlnParentCompany: string;
    nameParentCompany: string;
    categoryParentCompany: number;
    numRucParentCompany: string;
    codUbigeoParentCompany: number;
    addressParentCompany: string;
    gpsLocationParentCompany?: string | null;
    emailParentCompany: string;
    cellularParentCompany: string;
    webParentCompany?: string | null;
    canisterDataParentCompany?: string | null;
    canisterAssetsParentCompany?: string | null;
    logoParentCompany?: runtime.Bytes | null;
    stateParentCompany?: number;
    codUsuarioCargaDl: string;
    fehProcesoCargaDl?: Date | string;
    fehProcesoModifDl?: Date | string;
    desAccion: string;
    flgStatutActif?: number;
    brands?: Prisma.MdBrandCreateNestedManyWithoutParentCompanyInput;
    ordenes?: Prisma.MdOrdenPedidoCreateNestedManyWithoutParentCompanyInput;
    facilities?: Prisma.MdFacilityCreateNestedManyWithoutParentCompanyInput;
    maquilaRelations?: Prisma.MdParentCompanyMaquilaCreateNestedManyWithoutParentCompanyInput;
    users?: Prisma.MdUserReoCreateNestedManyWithoutParentCompanyInput;
};
export type MdParentCompanyUncheckedCreateWithoutAuditLogsInput = {
    idDlkParentCompany?: number;
    codParentCompany: string;
    codGlnParentCompany: string;
    nameParentCompany: string;
    categoryParentCompany: number;
    numRucParentCompany: string;
    codUbigeoParentCompany: number;
    addressParentCompany: string;
    gpsLocationParentCompany?: string | null;
    emailParentCompany: string;
    cellularParentCompany: string;
    webParentCompany?: string | null;
    canisterDataParentCompany?: string | null;
    canisterAssetsParentCompany?: string | null;
    logoParentCompany?: runtime.Bytes | null;
    stateParentCompany?: number;
    codUsuarioCargaDl: string;
    fehProcesoCargaDl?: Date | string;
    fehProcesoModifDl?: Date | string;
    desAccion: string;
    flgStatutActif?: number;
    brands?: Prisma.MdBrandUncheckedCreateNestedManyWithoutParentCompanyInput;
    ordenes?: Prisma.MdOrdenPedidoUncheckedCreateNestedManyWithoutParentCompanyInput;
    facilities?: Prisma.MdFacilityUncheckedCreateNestedManyWithoutParentCompanyInput;
    maquilaRelations?: Prisma.MdParentCompanyMaquilaUncheckedCreateNestedManyWithoutParentCompanyInput;
    users?: Prisma.MdUserReoUncheckedCreateNestedManyWithoutParentCompanyInput;
};
export type MdParentCompanyCreateOrConnectWithoutAuditLogsInput = {
    where: Prisma.MdParentCompanyWhereUniqueInput;
    create: Prisma.XOR<Prisma.MdParentCompanyCreateWithoutAuditLogsInput, Prisma.MdParentCompanyUncheckedCreateWithoutAuditLogsInput>;
};
export type MdParentCompanyUpsertWithoutAuditLogsInput = {
    update: Prisma.XOR<Prisma.MdParentCompanyUpdateWithoutAuditLogsInput, Prisma.MdParentCompanyUncheckedUpdateWithoutAuditLogsInput>;
    create: Prisma.XOR<Prisma.MdParentCompanyCreateWithoutAuditLogsInput, Prisma.MdParentCompanyUncheckedCreateWithoutAuditLogsInput>;
    where?: Prisma.MdParentCompanyWhereInput;
};
export type MdParentCompanyUpdateToOneWithWhereWithoutAuditLogsInput = {
    where?: Prisma.MdParentCompanyWhereInput;
    data: Prisma.XOR<Prisma.MdParentCompanyUpdateWithoutAuditLogsInput, Prisma.MdParentCompanyUncheckedUpdateWithoutAuditLogsInput>;
};
export type MdParentCompanyUpdateWithoutAuditLogsInput = {
    codParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    codGlnParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    nameParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    categoryParentCompany?: Prisma.IntFieldUpdateOperationsInput | number;
    numRucParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    codUbigeoParentCompany?: Prisma.IntFieldUpdateOperationsInput | number;
    addressParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    gpsLocationParentCompany?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    emailParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    cellularParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    webParentCompany?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    canisterDataParentCompany?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    canisterAssetsParentCompany?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logoParentCompany?: Prisma.NullableBytesFieldUpdateOperationsInput | runtime.Bytes | null;
    stateParentCompany?: Prisma.IntFieldUpdateOperationsInput | number;
    codUsuarioCargaDl?: Prisma.StringFieldUpdateOperationsInput | string;
    fehProcesoCargaDl?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    fehProcesoModifDl?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    desAccion?: Prisma.StringFieldUpdateOperationsInput | string;
    flgStatutActif?: Prisma.IntFieldUpdateOperationsInput | number;
    brands?: Prisma.MdBrandUpdateManyWithoutParentCompanyNestedInput;
    ordenes?: Prisma.MdOrdenPedidoUpdateManyWithoutParentCompanyNestedInput;
    facilities?: Prisma.MdFacilityUpdateManyWithoutParentCompanyNestedInput;
    maquilaRelations?: Prisma.MdParentCompanyMaquilaUpdateManyWithoutParentCompanyNestedInput;
    users?: Prisma.MdUserReoUpdateManyWithoutParentCompanyNestedInput;
};
export type MdParentCompanyUncheckedUpdateWithoutAuditLogsInput = {
    idDlkParentCompany?: Prisma.IntFieldUpdateOperationsInput | number;
    codParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    codGlnParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    nameParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    categoryParentCompany?: Prisma.IntFieldUpdateOperationsInput | number;
    numRucParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    codUbigeoParentCompany?: Prisma.IntFieldUpdateOperationsInput | number;
    addressParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    gpsLocationParentCompany?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    emailParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    cellularParentCompany?: Prisma.StringFieldUpdateOperationsInput | string;
    webParentCompany?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    canisterDataParentCompany?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    canisterAssetsParentCompany?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logoParentCompany?: Prisma.NullableBytesFieldUpdateOperationsInput | runtime.Bytes | null;
    stateParentCompany?: Prisma.IntFieldUpdateOperationsInput | number;
    codUsuarioCargaDl?: Prisma.StringFieldUpdateOperationsInput | string;
    fehProcesoCargaDl?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    fehProcesoModifDl?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    desAccion?: Prisma.StringFieldUpdateOperationsInput | string;
    flgStatutActif?: Prisma.IntFieldUpdateOperationsInput | number;
    brands?: Prisma.MdBrandUncheckedUpdateManyWithoutParentCompanyNestedInput;
    ordenes?: Prisma.MdOrdenPedidoUncheckedUpdateManyWithoutParentCompanyNestedInput;
    facilities?: Prisma.MdFacilityUncheckedUpdateManyWithoutParentCompanyNestedInput;
    maquilaRelations?: Prisma.MdParentCompanyMaquilaUncheckedUpdateManyWithoutParentCompanyNestedInput;
    users?: Prisma.MdUserReoUncheckedUpdateManyWithoutParentCompanyNestedInput;
};
/**
 * Count Type MdParentCompanyCountOutputType
 */
export type MdParentCompanyCountOutputType = {
    brands: number;
    ordenes: number;
    facilities: number;
    maquilaRelations: number;
    users: number;
    auditLogs: number;
};
export type MdParentCompanyCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    brands?: boolean | MdParentCompanyCountOutputTypeCountBrandsArgs;
    ordenes?: boolean | MdParentCompanyCountOutputTypeCountOrdenesArgs;
    facilities?: boolean | MdParentCompanyCountOutputTypeCountFacilitiesArgs;
    maquilaRelations?: boolean | MdParentCompanyCountOutputTypeCountMaquilaRelationsArgs;
    users?: boolean | MdParentCompanyCountOutputTypeCountUsersArgs;
    auditLogs?: boolean | MdParentCompanyCountOutputTypeCountAuditLogsArgs;
};
/**
 * MdParentCompanyCountOutputType without action
 */
export type MdParentCompanyCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MdParentCompanyCountOutputType
     */
    select?: Prisma.MdParentCompanyCountOutputTypeSelect<ExtArgs> | null;
};
/**
 * MdParentCompanyCountOutputType without action
 */
export type MdParentCompanyCountOutputTypeCountBrandsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MdBrandWhereInput;
};
/**
 * MdParentCompanyCountOutputType without action
 */
export type MdParentCompanyCountOutputTypeCountOrdenesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MdOrdenPedidoWhereInput;
};
/**
 * MdParentCompanyCountOutputType without action
 */
export type MdParentCompanyCountOutputTypeCountFacilitiesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MdFacilityWhereInput;
};
/**
 * MdParentCompanyCountOutputType without action
 */
export type MdParentCompanyCountOutputTypeCountMaquilaRelationsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MdParentCompanyMaquilaWhereInput;
};
/**
 * MdParentCompanyCountOutputType without action
 */
export type MdParentCompanyCountOutputTypeCountUsersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MdUserReoWhereInput;
};
/**
 * MdParentCompanyCountOutputType without action
 */
export type MdParentCompanyCountOutputTypeCountAuditLogsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.LgParentCompanyWhereInput;
};
export type MdParentCompanySelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    idDlkParentCompany?: boolean;
    codParentCompany?: boolean;
    codGlnParentCompany?: boolean;
    nameParentCompany?: boolean;
    categoryParentCompany?: boolean;
    numRucParentCompany?: boolean;
    codUbigeoParentCompany?: boolean;
    addressParentCompany?: boolean;
    gpsLocationParentCompany?: boolean;
    emailParentCompany?: boolean;
    cellularParentCompany?: boolean;
    webParentCompany?: boolean;
    canisterDataParentCompany?: boolean;
    canisterAssetsParentCompany?: boolean;
    logoParentCompany?: boolean;
    stateParentCompany?: boolean;
    codUsuarioCargaDl?: boolean;
    fehProcesoCargaDl?: boolean;
    fehProcesoModifDl?: boolean;
    desAccion?: boolean;
    flgStatutActif?: boolean;
    brands?: boolean | Prisma.MdParentCompany$brandsArgs<ExtArgs>;
    ordenes?: boolean | Prisma.MdParentCompany$ordenesArgs<ExtArgs>;
    facilities?: boolean | Prisma.MdParentCompany$facilitiesArgs<ExtArgs>;
    maquilaRelations?: boolean | Prisma.MdParentCompany$maquilaRelationsArgs<ExtArgs>;
    users?: boolean | Prisma.MdParentCompany$usersArgs<ExtArgs>;
    auditLogs?: boolean | Prisma.MdParentCompany$auditLogsArgs<ExtArgs>;
    _count?: boolean | Prisma.MdParentCompanyCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["mdParentCompany"]>;
export type MdParentCompanySelectScalar = {
    idDlkParentCompany?: boolean;
    codParentCompany?: boolean;
    codGlnParentCompany?: boolean;
    nameParentCompany?: boolean;
    categoryParentCompany?: boolean;
    numRucParentCompany?: boolean;
    codUbigeoParentCompany?: boolean;
    addressParentCompany?: boolean;
    gpsLocationParentCompany?: boolean;
    emailParentCompany?: boolean;
    cellularParentCompany?: boolean;
    webParentCompany?: boolean;
    canisterDataParentCompany?: boolean;
    canisterAssetsParentCompany?: boolean;
    logoParentCompany?: boolean;
    stateParentCompany?: boolean;
    codUsuarioCargaDl?: boolean;
    fehProcesoCargaDl?: boolean;
    fehProcesoModifDl?: boolean;
    desAccion?: boolean;
    flgStatutActif?: boolean;
};
export type MdParentCompanyOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"idDlkParentCompany" | "codParentCompany" | "codGlnParentCompany" | "nameParentCompany" | "categoryParentCompany" | "numRucParentCompany" | "codUbigeoParentCompany" | "addressParentCompany" | "gpsLocationParentCompany" | "emailParentCompany" | "cellularParentCompany" | "webParentCompany" | "canisterDataParentCompany" | "canisterAssetsParentCompany" | "logoParentCompany" | "stateParentCompany" | "codUsuarioCargaDl" | "fehProcesoCargaDl" | "fehProcesoModifDl" | "desAccion" | "flgStatutActif", ExtArgs["result"]["mdParentCompany"]>;
export type MdParentCompanyInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    brands?: boolean | Prisma.MdParentCompany$brandsArgs<ExtArgs>;
    ordenes?: boolean | Prisma.MdParentCompany$ordenesArgs<ExtArgs>;
    facilities?: boolean | Prisma.MdParentCompany$facilitiesArgs<ExtArgs>;
    maquilaRelations?: boolean | Prisma.MdParentCompany$maquilaRelationsArgs<ExtArgs>;
    users?: boolean | Prisma.MdParentCompany$usersArgs<ExtArgs>;
    auditLogs?: boolean | Prisma.MdParentCompany$auditLogsArgs<ExtArgs>;
    _count?: boolean | Prisma.MdParentCompanyCountOutputTypeDefaultArgs<ExtArgs>;
};
export type $MdParentCompanyPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "MdParentCompany";
    objects: {
        brands: Prisma.$MdBrandPayload<ExtArgs>[];
        ordenes: Prisma.$MdOrdenPedidoPayload<ExtArgs>[];
        facilities: Prisma.$MdFacilityPayload<ExtArgs>[];
        maquilaRelations: Prisma.$MdParentCompanyMaquilaPayload<ExtArgs>[];
        users: Prisma.$MdUserReoPayload<ExtArgs>[];
        auditLogs: Prisma.$LgParentCompanyPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        idDlkParentCompany: number;
        codParentCompany: string;
        codGlnParentCompany: string;
        nameParentCompany: string;
        categoryParentCompany: number;
        numRucParentCompany: string;
        codUbigeoParentCompany: number;
        addressParentCompany: string;
        gpsLocationParentCompany: string | null;
        emailParentCompany: string;
        cellularParentCompany: string;
        webParentCompany: string | null;
        canisterDataParentCompany: string | null;
        canisterAssetsParentCompany: string | null;
        logoParentCompany: runtime.Bytes | null;
        stateParentCompany: number;
        codUsuarioCargaDl: string;
        fehProcesoCargaDl: Date;
        fehProcesoModifDl: Date;
        desAccion: string;
        flgStatutActif: number;
    }, ExtArgs["result"]["mdParentCompany"]>;
    composites: {};
};
export type MdParentCompanyGetPayload<S extends boolean | null | undefined | MdParentCompanyDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$MdParentCompanyPayload, S>;
export type MdParentCompanyCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<MdParentCompanyFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: MdParentCompanyCountAggregateInputType | true;
};
export interface MdParentCompanyDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['MdParentCompany'];
        meta: {
            name: 'MdParentCompany';
        };
    };
    /**
     * Find zero or one MdParentCompany that matches the filter.
     * @param {MdParentCompanyFindUniqueArgs} args - Arguments to find a MdParentCompany
     * @example
     * // Get one MdParentCompany
     * const mdParentCompany = await prisma.mdParentCompany.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MdParentCompanyFindUniqueArgs>(args: Prisma.SelectSubset<T, MdParentCompanyFindUniqueArgs<ExtArgs>>): Prisma.Prisma__MdParentCompanyClient<runtime.Types.Result.GetResult<Prisma.$MdParentCompanyPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one MdParentCompany that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MdParentCompanyFindUniqueOrThrowArgs} args - Arguments to find a MdParentCompany
     * @example
     * // Get one MdParentCompany
     * const mdParentCompany = await prisma.mdParentCompany.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MdParentCompanyFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, MdParentCompanyFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__MdParentCompanyClient<runtime.Types.Result.GetResult<Prisma.$MdParentCompanyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first MdParentCompany that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MdParentCompanyFindFirstArgs} args - Arguments to find a MdParentCompany
     * @example
     * // Get one MdParentCompany
     * const mdParentCompany = await prisma.mdParentCompany.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MdParentCompanyFindFirstArgs>(args?: Prisma.SelectSubset<T, MdParentCompanyFindFirstArgs<ExtArgs>>): Prisma.Prisma__MdParentCompanyClient<runtime.Types.Result.GetResult<Prisma.$MdParentCompanyPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first MdParentCompany that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MdParentCompanyFindFirstOrThrowArgs} args - Arguments to find a MdParentCompany
     * @example
     * // Get one MdParentCompany
     * const mdParentCompany = await prisma.mdParentCompany.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MdParentCompanyFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, MdParentCompanyFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__MdParentCompanyClient<runtime.Types.Result.GetResult<Prisma.$MdParentCompanyPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more MdParentCompanies that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MdParentCompanyFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MdParentCompanies
     * const mdParentCompanies = await prisma.mdParentCompany.findMany()
     *
     * // Get first 10 MdParentCompanies
     * const mdParentCompanies = await prisma.mdParentCompany.findMany({ take: 10 })
     *
     * // Only select the `idDlkParentCompany`
     * const mdParentCompanyWithIdDlkParentCompanyOnly = await prisma.mdParentCompany.findMany({ select: { idDlkParentCompany: true } })
     *
     */
    findMany<T extends MdParentCompanyFindManyArgs>(args?: Prisma.SelectSubset<T, MdParentCompanyFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MdParentCompanyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a MdParentCompany.
     * @param {MdParentCompanyCreateArgs} args - Arguments to create a MdParentCompany.
     * @example
     * // Create one MdParentCompany
     * const MdParentCompany = await prisma.mdParentCompany.create({
     *   data: {
     *     // ... data to create a MdParentCompany
     *   }
     * })
     *
     */
    create<T extends MdParentCompanyCreateArgs>(args: Prisma.SelectSubset<T, MdParentCompanyCreateArgs<ExtArgs>>): Prisma.Prisma__MdParentCompanyClient<runtime.Types.Result.GetResult<Prisma.$MdParentCompanyPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many MdParentCompanies.
     * @param {MdParentCompanyCreateManyArgs} args - Arguments to create many MdParentCompanies.
     * @example
     * // Create many MdParentCompanies
     * const mdParentCompany = await prisma.mdParentCompany.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends MdParentCompanyCreateManyArgs>(args?: Prisma.SelectSubset<T, MdParentCompanyCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Delete a MdParentCompany.
     * @param {MdParentCompanyDeleteArgs} args - Arguments to delete one MdParentCompany.
     * @example
     * // Delete one MdParentCompany
     * const MdParentCompany = await prisma.mdParentCompany.delete({
     *   where: {
     *     // ... filter to delete one MdParentCompany
     *   }
     * })
     *
     */
    delete<T extends MdParentCompanyDeleteArgs>(args: Prisma.SelectSubset<T, MdParentCompanyDeleteArgs<ExtArgs>>): Prisma.Prisma__MdParentCompanyClient<runtime.Types.Result.GetResult<Prisma.$MdParentCompanyPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one MdParentCompany.
     * @param {MdParentCompanyUpdateArgs} args - Arguments to update one MdParentCompany.
     * @example
     * // Update one MdParentCompany
     * const mdParentCompany = await prisma.mdParentCompany.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends MdParentCompanyUpdateArgs>(args: Prisma.SelectSubset<T, MdParentCompanyUpdateArgs<ExtArgs>>): Prisma.Prisma__MdParentCompanyClient<runtime.Types.Result.GetResult<Prisma.$MdParentCompanyPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more MdParentCompanies.
     * @param {MdParentCompanyDeleteManyArgs} args - Arguments to filter MdParentCompanies to delete.
     * @example
     * // Delete a few MdParentCompanies
     * const { count } = await prisma.mdParentCompany.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends MdParentCompanyDeleteManyArgs>(args?: Prisma.SelectSubset<T, MdParentCompanyDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more MdParentCompanies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MdParentCompanyUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MdParentCompanies
     * const mdParentCompany = await prisma.mdParentCompany.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends MdParentCompanyUpdateManyArgs>(args: Prisma.SelectSubset<T, MdParentCompanyUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create or update one MdParentCompany.
     * @param {MdParentCompanyUpsertArgs} args - Arguments to update or create a MdParentCompany.
     * @example
     * // Update or create a MdParentCompany
     * const mdParentCompany = await prisma.mdParentCompany.upsert({
     *   create: {
     *     // ... data to create a MdParentCompany
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MdParentCompany we want to update
     *   }
     * })
     */
    upsert<T extends MdParentCompanyUpsertArgs>(args: Prisma.SelectSubset<T, MdParentCompanyUpsertArgs<ExtArgs>>): Prisma.Prisma__MdParentCompanyClient<runtime.Types.Result.GetResult<Prisma.$MdParentCompanyPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of MdParentCompanies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MdParentCompanyCountArgs} args - Arguments to filter MdParentCompanies to count.
     * @example
     * // Count the number of MdParentCompanies
     * const count = await prisma.mdParentCompany.count({
     *   where: {
     *     // ... the filter for the MdParentCompanies we want to count
     *   }
     * })
    **/
    count<T extends MdParentCompanyCountArgs>(args?: Prisma.Subset<T, MdParentCompanyCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], MdParentCompanyCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a MdParentCompany.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MdParentCompanyAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends MdParentCompanyAggregateArgs>(args: Prisma.Subset<T, MdParentCompanyAggregateArgs>): Prisma.PrismaPromise<GetMdParentCompanyAggregateType<T>>;
    /**
     * Group by MdParentCompany.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MdParentCompanyGroupByArgs} args - Group by arguments.
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
    groupBy<T extends MdParentCompanyGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: MdParentCompanyGroupByArgs['orderBy'];
    } : {
        orderBy?: MdParentCompanyGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, MdParentCompanyGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMdParentCompanyGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the MdParentCompany model
     */
    readonly fields: MdParentCompanyFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for MdParentCompany.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__MdParentCompanyClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    brands<T extends Prisma.MdParentCompany$brandsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.MdParentCompany$brandsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MdBrandPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    ordenes<T extends Prisma.MdParentCompany$ordenesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.MdParentCompany$ordenesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MdOrdenPedidoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    facilities<T extends Prisma.MdParentCompany$facilitiesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.MdParentCompany$facilitiesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MdFacilityPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    maquilaRelations<T extends Prisma.MdParentCompany$maquilaRelationsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.MdParentCompany$maquilaRelationsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MdParentCompanyMaquilaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    users<T extends Prisma.MdParentCompany$usersArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.MdParentCompany$usersArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MdUserReoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    auditLogs<T extends Prisma.MdParentCompany$auditLogsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.MdParentCompany$auditLogsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$LgParentCompanyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
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
 * Fields of the MdParentCompany model
 */
export interface MdParentCompanyFieldRefs {
    readonly idDlkParentCompany: Prisma.FieldRef<"MdParentCompany", 'Int'>;
    readonly codParentCompany: Prisma.FieldRef<"MdParentCompany", 'String'>;
    readonly codGlnParentCompany: Prisma.FieldRef<"MdParentCompany", 'String'>;
    readonly nameParentCompany: Prisma.FieldRef<"MdParentCompany", 'String'>;
    readonly categoryParentCompany: Prisma.FieldRef<"MdParentCompany", 'Int'>;
    readonly numRucParentCompany: Prisma.FieldRef<"MdParentCompany", 'String'>;
    readonly codUbigeoParentCompany: Prisma.FieldRef<"MdParentCompany", 'Int'>;
    readonly addressParentCompany: Prisma.FieldRef<"MdParentCompany", 'String'>;
    readonly gpsLocationParentCompany: Prisma.FieldRef<"MdParentCompany", 'String'>;
    readonly emailParentCompany: Prisma.FieldRef<"MdParentCompany", 'String'>;
    readonly cellularParentCompany: Prisma.FieldRef<"MdParentCompany", 'String'>;
    readonly webParentCompany: Prisma.FieldRef<"MdParentCompany", 'String'>;
    readonly canisterDataParentCompany: Prisma.FieldRef<"MdParentCompany", 'String'>;
    readonly canisterAssetsParentCompany: Prisma.FieldRef<"MdParentCompany", 'String'>;
    readonly logoParentCompany: Prisma.FieldRef<"MdParentCompany", 'Bytes'>;
    readonly stateParentCompany: Prisma.FieldRef<"MdParentCompany", 'Int'>;
    readonly codUsuarioCargaDl: Prisma.FieldRef<"MdParentCompany", 'String'>;
    readonly fehProcesoCargaDl: Prisma.FieldRef<"MdParentCompany", 'DateTime'>;
    readonly fehProcesoModifDl: Prisma.FieldRef<"MdParentCompany", 'DateTime'>;
    readonly desAccion: Prisma.FieldRef<"MdParentCompany", 'String'>;
    readonly flgStatutActif: Prisma.FieldRef<"MdParentCompany", 'Int'>;
}
/**
 * MdParentCompany findUnique
 */
export type MdParentCompanyFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MdParentCompany
     */
    select?: Prisma.MdParentCompanySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the MdParentCompany
     */
    omit?: Prisma.MdParentCompanyOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MdParentCompanyInclude<ExtArgs> | null;
    /**
     * Filter, which MdParentCompany to fetch.
     */
    where: Prisma.MdParentCompanyWhereUniqueInput;
};
/**
 * MdParentCompany findUniqueOrThrow
 */
export type MdParentCompanyFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MdParentCompany
     */
    select?: Prisma.MdParentCompanySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the MdParentCompany
     */
    omit?: Prisma.MdParentCompanyOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MdParentCompanyInclude<ExtArgs> | null;
    /**
     * Filter, which MdParentCompany to fetch.
     */
    where: Prisma.MdParentCompanyWhereUniqueInput;
};
/**
 * MdParentCompany findFirst
 */
export type MdParentCompanyFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MdParentCompany
     */
    select?: Prisma.MdParentCompanySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the MdParentCompany
     */
    omit?: Prisma.MdParentCompanyOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MdParentCompanyInclude<ExtArgs> | null;
    /**
     * Filter, which MdParentCompany to fetch.
     */
    where?: Prisma.MdParentCompanyWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of MdParentCompanies to fetch.
     */
    orderBy?: Prisma.MdParentCompanyOrderByWithRelationInput | Prisma.MdParentCompanyOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for MdParentCompanies.
     */
    cursor?: Prisma.MdParentCompanyWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` MdParentCompanies from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` MdParentCompanies.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of MdParentCompanies.
     */
    distinct?: Prisma.MdParentCompanyScalarFieldEnum | Prisma.MdParentCompanyScalarFieldEnum[];
};
/**
 * MdParentCompany findFirstOrThrow
 */
export type MdParentCompanyFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MdParentCompany
     */
    select?: Prisma.MdParentCompanySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the MdParentCompany
     */
    omit?: Prisma.MdParentCompanyOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MdParentCompanyInclude<ExtArgs> | null;
    /**
     * Filter, which MdParentCompany to fetch.
     */
    where?: Prisma.MdParentCompanyWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of MdParentCompanies to fetch.
     */
    orderBy?: Prisma.MdParentCompanyOrderByWithRelationInput | Prisma.MdParentCompanyOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for MdParentCompanies.
     */
    cursor?: Prisma.MdParentCompanyWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` MdParentCompanies from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` MdParentCompanies.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of MdParentCompanies.
     */
    distinct?: Prisma.MdParentCompanyScalarFieldEnum | Prisma.MdParentCompanyScalarFieldEnum[];
};
/**
 * MdParentCompany findMany
 */
export type MdParentCompanyFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MdParentCompany
     */
    select?: Prisma.MdParentCompanySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the MdParentCompany
     */
    omit?: Prisma.MdParentCompanyOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MdParentCompanyInclude<ExtArgs> | null;
    /**
     * Filter, which MdParentCompanies to fetch.
     */
    where?: Prisma.MdParentCompanyWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of MdParentCompanies to fetch.
     */
    orderBy?: Prisma.MdParentCompanyOrderByWithRelationInput | Prisma.MdParentCompanyOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing MdParentCompanies.
     */
    cursor?: Prisma.MdParentCompanyWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` MdParentCompanies from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` MdParentCompanies.
     */
    skip?: number;
    distinct?: Prisma.MdParentCompanyScalarFieldEnum | Prisma.MdParentCompanyScalarFieldEnum[];
};
/**
 * MdParentCompany create
 */
export type MdParentCompanyCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MdParentCompany
     */
    select?: Prisma.MdParentCompanySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the MdParentCompany
     */
    omit?: Prisma.MdParentCompanyOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MdParentCompanyInclude<ExtArgs> | null;
    /**
     * The data needed to create a MdParentCompany.
     */
    data: Prisma.XOR<Prisma.MdParentCompanyCreateInput, Prisma.MdParentCompanyUncheckedCreateInput>;
};
/**
 * MdParentCompany createMany
 */
export type MdParentCompanyCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many MdParentCompanies.
     */
    data: Prisma.MdParentCompanyCreateManyInput | Prisma.MdParentCompanyCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * MdParentCompany update
 */
export type MdParentCompanyUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MdParentCompany
     */
    select?: Prisma.MdParentCompanySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the MdParentCompany
     */
    omit?: Prisma.MdParentCompanyOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MdParentCompanyInclude<ExtArgs> | null;
    /**
     * The data needed to update a MdParentCompany.
     */
    data: Prisma.XOR<Prisma.MdParentCompanyUpdateInput, Prisma.MdParentCompanyUncheckedUpdateInput>;
    /**
     * Choose, which MdParentCompany to update.
     */
    where: Prisma.MdParentCompanyWhereUniqueInput;
};
/**
 * MdParentCompany updateMany
 */
export type MdParentCompanyUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update MdParentCompanies.
     */
    data: Prisma.XOR<Prisma.MdParentCompanyUpdateManyMutationInput, Prisma.MdParentCompanyUncheckedUpdateManyInput>;
    /**
     * Filter which MdParentCompanies to update
     */
    where?: Prisma.MdParentCompanyWhereInput;
    /**
     * Limit how many MdParentCompanies to update.
     */
    limit?: number;
};
/**
 * MdParentCompany upsert
 */
export type MdParentCompanyUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MdParentCompany
     */
    select?: Prisma.MdParentCompanySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the MdParentCompany
     */
    omit?: Prisma.MdParentCompanyOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MdParentCompanyInclude<ExtArgs> | null;
    /**
     * The filter to search for the MdParentCompany to update in case it exists.
     */
    where: Prisma.MdParentCompanyWhereUniqueInput;
    /**
     * In case the MdParentCompany found by the `where` argument doesn't exist, create a new MdParentCompany with this data.
     */
    create: Prisma.XOR<Prisma.MdParentCompanyCreateInput, Prisma.MdParentCompanyUncheckedCreateInput>;
    /**
     * In case the MdParentCompany was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.MdParentCompanyUpdateInput, Prisma.MdParentCompanyUncheckedUpdateInput>;
};
/**
 * MdParentCompany delete
 */
export type MdParentCompanyDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MdParentCompany
     */
    select?: Prisma.MdParentCompanySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the MdParentCompany
     */
    omit?: Prisma.MdParentCompanyOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MdParentCompanyInclude<ExtArgs> | null;
    /**
     * Filter which MdParentCompany to delete.
     */
    where: Prisma.MdParentCompanyWhereUniqueInput;
};
/**
 * MdParentCompany deleteMany
 */
export type MdParentCompanyDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which MdParentCompanies to delete
     */
    where?: Prisma.MdParentCompanyWhereInput;
    /**
     * Limit how many MdParentCompanies to delete.
     */
    limit?: number;
};
/**
 * MdParentCompany.brands
 */
export type MdParentCompany$brandsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MdBrand
     */
    select?: Prisma.MdBrandSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the MdBrand
     */
    omit?: Prisma.MdBrandOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MdBrandInclude<ExtArgs> | null;
    where?: Prisma.MdBrandWhereInput;
    orderBy?: Prisma.MdBrandOrderByWithRelationInput | Prisma.MdBrandOrderByWithRelationInput[];
    cursor?: Prisma.MdBrandWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.MdBrandScalarFieldEnum | Prisma.MdBrandScalarFieldEnum[];
};
/**
 * MdParentCompany.ordenes
 */
export type MdParentCompany$ordenesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MdOrdenPedido
     */
    select?: Prisma.MdOrdenPedidoSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the MdOrdenPedido
     */
    omit?: Prisma.MdOrdenPedidoOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MdOrdenPedidoInclude<ExtArgs> | null;
    where?: Prisma.MdOrdenPedidoWhereInput;
    orderBy?: Prisma.MdOrdenPedidoOrderByWithRelationInput | Prisma.MdOrdenPedidoOrderByWithRelationInput[];
    cursor?: Prisma.MdOrdenPedidoWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.MdOrdenPedidoScalarFieldEnum | Prisma.MdOrdenPedidoScalarFieldEnum[];
};
/**
 * MdParentCompany.facilities
 */
export type MdParentCompany$facilitiesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MdFacility
     */
    select?: Prisma.MdFacilitySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the MdFacility
     */
    omit?: Prisma.MdFacilityOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MdFacilityInclude<ExtArgs> | null;
    where?: Prisma.MdFacilityWhereInput;
    orderBy?: Prisma.MdFacilityOrderByWithRelationInput | Prisma.MdFacilityOrderByWithRelationInput[];
    cursor?: Prisma.MdFacilityWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.MdFacilityScalarFieldEnum | Prisma.MdFacilityScalarFieldEnum[];
};
/**
 * MdParentCompany.maquilaRelations
 */
export type MdParentCompany$maquilaRelationsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MdParentCompanyMaquila
     */
    select?: Prisma.MdParentCompanyMaquilaSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the MdParentCompanyMaquila
     */
    omit?: Prisma.MdParentCompanyMaquilaOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MdParentCompanyMaquilaInclude<ExtArgs> | null;
    where?: Prisma.MdParentCompanyMaquilaWhereInput;
    orderBy?: Prisma.MdParentCompanyMaquilaOrderByWithRelationInput | Prisma.MdParentCompanyMaquilaOrderByWithRelationInput[];
    cursor?: Prisma.MdParentCompanyMaquilaWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.MdParentCompanyMaquilaScalarFieldEnum | Prisma.MdParentCompanyMaquilaScalarFieldEnum[];
};
/**
 * MdParentCompany.users
 */
export type MdParentCompany$usersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    where?: Prisma.MdUserReoWhereInput;
    orderBy?: Prisma.MdUserReoOrderByWithRelationInput | Prisma.MdUserReoOrderByWithRelationInput[];
    cursor?: Prisma.MdUserReoWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.MdUserReoScalarFieldEnum | Prisma.MdUserReoScalarFieldEnum[];
};
/**
 * MdParentCompany.auditLogs
 */
export type MdParentCompany$auditLogsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LgParentCompany
     */
    select?: Prisma.LgParentCompanySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the LgParentCompany
     */
    omit?: Prisma.LgParentCompanyOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.LgParentCompanyInclude<ExtArgs> | null;
    where?: Prisma.LgParentCompanyWhereInput;
    orderBy?: Prisma.LgParentCompanyOrderByWithRelationInput | Prisma.LgParentCompanyOrderByWithRelationInput[];
    cursor?: Prisma.LgParentCompanyWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.LgParentCompanyScalarFieldEnum | Prisma.LgParentCompanyScalarFieldEnum[];
};
/**
 * MdParentCompany without action
 */
export type MdParentCompanyDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MdParentCompany
     */
    select?: Prisma.MdParentCompanySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the MdParentCompany
     */
    omit?: Prisma.MdParentCompanyOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MdParentCompanyInclude<ExtArgs> | null;
};
export {};
