import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model MdFacilityMaquila
 *
 */
export type MdFacilityMaquilaModel = runtime.Types.Result.DefaultSelection<Prisma.$MdFacilityMaquilaPayload>;
export type AggregateMdFacilityMaquila = {
    _count: MdFacilityMaquilaCountAggregateOutputType | null;
    _avg: MdFacilityMaquilaAvgAggregateOutputType | null;
    _sum: MdFacilityMaquilaSumAggregateOutputType | null;
    _min: MdFacilityMaquilaMinAggregateOutputType | null;
    _max: MdFacilityMaquilaMaxAggregateOutputType | null;
};
export type MdFacilityMaquilaAvgAggregateOutputType = {
    idDlkFacilityMaquila: number | null;
    idDlkMaquila: number | null;
    codUbigeo: number | null;
    stateFacilityMaquila: number | null;
    flgStatutActif: number | null;
};
export type MdFacilityMaquilaSumAggregateOutputType = {
    idDlkFacilityMaquila: number | null;
    idDlkMaquila: number | null;
    codUbigeo: number | null;
    stateFacilityMaquila: number | null;
    flgStatutActif: number | null;
};
export type MdFacilityMaquilaMinAggregateOutputType = {
    idDlkFacilityMaquila: number | null;
    codFacilityMaquila: string | null;
    idDlkMaquila: number | null;
    codMaquila: string | null;
    codUbigeo: number | null;
    codGlnFacilityMaquila: string | null;
    registryFacilityMaquila: string | null;
    identifierFacilityMaquila: string | null;
    nameFacilityMaquila: string | null;
    addressFacilityMaquila: string | null;
    gpsLocationFacilityMaquila: string | null;
    emailFacilityMaquila: string | null;
    cellularFacilityMaquila: string | null;
    stateFacilityMaquila: number | null;
    codUsuarioCargaDl: string | null;
    fehProcesoCargaDl: Date | null;
    fehProcesoModifDl: Date | null;
    desAccion: string | null;
    flgStatutActif: number | null;
};
export type MdFacilityMaquilaMaxAggregateOutputType = {
    idDlkFacilityMaquila: number | null;
    codFacilityMaquila: string | null;
    idDlkMaquila: number | null;
    codMaquila: string | null;
    codUbigeo: number | null;
    codGlnFacilityMaquila: string | null;
    registryFacilityMaquila: string | null;
    identifierFacilityMaquila: string | null;
    nameFacilityMaquila: string | null;
    addressFacilityMaquila: string | null;
    gpsLocationFacilityMaquila: string | null;
    emailFacilityMaquila: string | null;
    cellularFacilityMaquila: string | null;
    stateFacilityMaquila: number | null;
    codUsuarioCargaDl: string | null;
    fehProcesoCargaDl: Date | null;
    fehProcesoModifDl: Date | null;
    desAccion: string | null;
    flgStatutActif: number | null;
};
export type MdFacilityMaquilaCountAggregateOutputType = {
    idDlkFacilityMaquila: number;
    codFacilityMaquila: number;
    idDlkMaquila: number;
    codMaquila: number;
    codUbigeo: number;
    codGlnFacilityMaquila: number;
    registryFacilityMaquila: number;
    identifierFacilityMaquila: number;
    nameFacilityMaquila: number;
    addressFacilityMaquila: number;
    gpsLocationFacilityMaquila: number;
    emailFacilityMaquila: number;
    cellularFacilityMaquila: number;
    stateFacilityMaquila: number;
    codUsuarioCargaDl: number;
    fehProcesoCargaDl: number;
    fehProcesoModifDl: number;
    desAccion: number;
    flgStatutActif: number;
    _all: number;
};
export type MdFacilityMaquilaAvgAggregateInputType = {
    idDlkFacilityMaquila?: true;
    idDlkMaquila?: true;
    codUbigeo?: true;
    stateFacilityMaquila?: true;
    flgStatutActif?: true;
};
export type MdFacilityMaquilaSumAggregateInputType = {
    idDlkFacilityMaquila?: true;
    idDlkMaquila?: true;
    codUbigeo?: true;
    stateFacilityMaquila?: true;
    flgStatutActif?: true;
};
export type MdFacilityMaquilaMinAggregateInputType = {
    idDlkFacilityMaquila?: true;
    codFacilityMaquila?: true;
    idDlkMaquila?: true;
    codMaquila?: true;
    codUbigeo?: true;
    codGlnFacilityMaquila?: true;
    registryFacilityMaquila?: true;
    identifierFacilityMaquila?: true;
    nameFacilityMaquila?: true;
    addressFacilityMaquila?: true;
    gpsLocationFacilityMaquila?: true;
    emailFacilityMaquila?: true;
    cellularFacilityMaquila?: true;
    stateFacilityMaquila?: true;
    codUsuarioCargaDl?: true;
    fehProcesoCargaDl?: true;
    fehProcesoModifDl?: true;
    desAccion?: true;
    flgStatutActif?: true;
};
export type MdFacilityMaquilaMaxAggregateInputType = {
    idDlkFacilityMaquila?: true;
    codFacilityMaquila?: true;
    idDlkMaquila?: true;
    codMaquila?: true;
    codUbigeo?: true;
    codGlnFacilityMaquila?: true;
    registryFacilityMaquila?: true;
    identifierFacilityMaquila?: true;
    nameFacilityMaquila?: true;
    addressFacilityMaquila?: true;
    gpsLocationFacilityMaquila?: true;
    emailFacilityMaquila?: true;
    cellularFacilityMaquila?: true;
    stateFacilityMaquila?: true;
    codUsuarioCargaDl?: true;
    fehProcesoCargaDl?: true;
    fehProcesoModifDl?: true;
    desAccion?: true;
    flgStatutActif?: true;
};
export type MdFacilityMaquilaCountAggregateInputType = {
    idDlkFacilityMaquila?: true;
    codFacilityMaquila?: true;
    idDlkMaquila?: true;
    codMaquila?: true;
    codUbigeo?: true;
    codGlnFacilityMaquila?: true;
    registryFacilityMaquila?: true;
    identifierFacilityMaquila?: true;
    nameFacilityMaquila?: true;
    addressFacilityMaquila?: true;
    gpsLocationFacilityMaquila?: true;
    emailFacilityMaquila?: true;
    cellularFacilityMaquila?: true;
    stateFacilityMaquila?: true;
    codUsuarioCargaDl?: true;
    fehProcesoCargaDl?: true;
    fehProcesoModifDl?: true;
    desAccion?: true;
    flgStatutActif?: true;
    _all?: true;
};
export type MdFacilityMaquilaAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which MdFacilityMaquila to aggregate.
     */
    where?: Prisma.MdFacilityMaquilaWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of MdFacilityMaquilas to fetch.
     */
    orderBy?: Prisma.MdFacilityMaquilaOrderByWithRelationInput | Prisma.MdFacilityMaquilaOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.MdFacilityMaquilaWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` MdFacilityMaquilas from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` MdFacilityMaquilas.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned MdFacilityMaquilas
    **/
    _count?: true | MdFacilityMaquilaCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: MdFacilityMaquilaAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: MdFacilityMaquilaSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: MdFacilityMaquilaMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: MdFacilityMaquilaMaxAggregateInputType;
};
export type GetMdFacilityMaquilaAggregateType<T extends MdFacilityMaquilaAggregateArgs> = {
    [P in keyof T & keyof AggregateMdFacilityMaquila]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateMdFacilityMaquila[P]> : Prisma.GetScalarType<T[P], AggregateMdFacilityMaquila[P]>;
};
export type MdFacilityMaquilaGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MdFacilityMaquilaWhereInput;
    orderBy?: Prisma.MdFacilityMaquilaOrderByWithAggregationInput | Prisma.MdFacilityMaquilaOrderByWithAggregationInput[];
    by: Prisma.MdFacilityMaquilaScalarFieldEnum[] | Prisma.MdFacilityMaquilaScalarFieldEnum;
    having?: Prisma.MdFacilityMaquilaScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: MdFacilityMaquilaCountAggregateInputType | true;
    _avg?: MdFacilityMaquilaAvgAggregateInputType;
    _sum?: MdFacilityMaquilaSumAggregateInputType;
    _min?: MdFacilityMaquilaMinAggregateInputType;
    _max?: MdFacilityMaquilaMaxAggregateInputType;
};
export type MdFacilityMaquilaGroupByOutputType = {
    idDlkFacilityMaquila: number;
    codFacilityMaquila: string;
    idDlkMaquila: number;
    codMaquila: string;
    codUbigeo: number;
    codGlnFacilityMaquila: string | null;
    registryFacilityMaquila: string;
    identifierFacilityMaquila: string;
    nameFacilityMaquila: string;
    addressFacilityMaquila: string;
    gpsLocationFacilityMaquila: string | null;
    emailFacilityMaquila: string;
    cellularFacilityMaquila: string;
    stateFacilityMaquila: number;
    codUsuarioCargaDl: string;
    fehProcesoCargaDl: Date;
    fehProcesoModifDl: Date;
    desAccion: string;
    flgStatutActif: number;
    _count: MdFacilityMaquilaCountAggregateOutputType | null;
    _avg: MdFacilityMaquilaAvgAggregateOutputType | null;
    _sum: MdFacilityMaquilaSumAggregateOutputType | null;
    _min: MdFacilityMaquilaMinAggregateOutputType | null;
    _max: MdFacilityMaquilaMaxAggregateOutputType | null;
};
type GetMdFacilityMaquilaGroupByPayload<T extends MdFacilityMaquilaGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<MdFacilityMaquilaGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof MdFacilityMaquilaGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], MdFacilityMaquilaGroupByOutputType[P]> : Prisma.GetScalarType<T[P], MdFacilityMaquilaGroupByOutputType[P]>;
}>>;
export type MdFacilityMaquilaWhereInput = {
    AND?: Prisma.MdFacilityMaquilaWhereInput | Prisma.MdFacilityMaquilaWhereInput[];
    OR?: Prisma.MdFacilityMaquilaWhereInput[];
    NOT?: Prisma.MdFacilityMaquilaWhereInput | Prisma.MdFacilityMaquilaWhereInput[];
    idDlkFacilityMaquila?: Prisma.IntFilter<"MdFacilityMaquila"> | number;
    codFacilityMaquila?: Prisma.StringFilter<"MdFacilityMaquila"> | string;
    idDlkMaquila?: Prisma.IntFilter<"MdFacilityMaquila"> | number;
    codMaquila?: Prisma.StringFilter<"MdFacilityMaquila"> | string;
    codUbigeo?: Prisma.IntFilter<"MdFacilityMaquila"> | number;
    codGlnFacilityMaquila?: Prisma.StringNullableFilter<"MdFacilityMaquila"> | string | null;
    registryFacilityMaquila?: Prisma.StringFilter<"MdFacilityMaquila"> | string;
    identifierFacilityMaquila?: Prisma.StringFilter<"MdFacilityMaquila"> | string;
    nameFacilityMaquila?: Prisma.StringFilter<"MdFacilityMaquila"> | string;
    addressFacilityMaquila?: Prisma.StringFilter<"MdFacilityMaquila"> | string;
    gpsLocationFacilityMaquila?: Prisma.StringNullableFilter<"MdFacilityMaquila"> | string | null;
    emailFacilityMaquila?: Prisma.StringFilter<"MdFacilityMaquila"> | string;
    cellularFacilityMaquila?: Prisma.StringFilter<"MdFacilityMaquila"> | string;
    stateFacilityMaquila?: Prisma.IntFilter<"MdFacilityMaquila"> | number;
    codUsuarioCargaDl?: Prisma.StringFilter<"MdFacilityMaquila"> | string;
    fehProcesoCargaDl?: Prisma.DateTimeFilter<"MdFacilityMaquila"> | Date | string;
    fehProcesoModifDl?: Prisma.DateTimeFilter<"MdFacilityMaquila"> | Date | string;
    desAccion?: Prisma.StringFilter<"MdFacilityMaquila"> | string;
    flgStatutActif?: Prisma.IntFilter<"MdFacilityMaquila"> | number;
    maquila?: Prisma.XOR<Prisma.MdMaquilaScalarRelationFilter, Prisma.MdMaquilaWhereInput>;
};
export type MdFacilityMaquilaOrderByWithRelationInput = {
    idDlkFacilityMaquila?: Prisma.SortOrder;
    codFacilityMaquila?: Prisma.SortOrder;
    idDlkMaquila?: Prisma.SortOrder;
    codMaquila?: Prisma.SortOrder;
    codUbigeo?: Prisma.SortOrder;
    codGlnFacilityMaquila?: Prisma.SortOrderInput | Prisma.SortOrder;
    registryFacilityMaquila?: Prisma.SortOrder;
    identifierFacilityMaquila?: Prisma.SortOrder;
    nameFacilityMaquila?: Prisma.SortOrder;
    addressFacilityMaquila?: Prisma.SortOrder;
    gpsLocationFacilityMaquila?: Prisma.SortOrderInput | Prisma.SortOrder;
    emailFacilityMaquila?: Prisma.SortOrder;
    cellularFacilityMaquila?: Prisma.SortOrder;
    stateFacilityMaquila?: Prisma.SortOrder;
    codUsuarioCargaDl?: Prisma.SortOrder;
    fehProcesoCargaDl?: Prisma.SortOrder;
    fehProcesoModifDl?: Prisma.SortOrder;
    desAccion?: Prisma.SortOrder;
    flgStatutActif?: Prisma.SortOrder;
    maquila?: Prisma.MdMaquilaOrderByWithRelationInput;
    _relevance?: Prisma.MdFacilityMaquilaOrderByRelevanceInput;
};
export type MdFacilityMaquilaWhereUniqueInput = Prisma.AtLeast<{
    idDlkFacilityMaquila?: number;
    codFacilityMaquila?: string;
    AND?: Prisma.MdFacilityMaquilaWhereInput | Prisma.MdFacilityMaquilaWhereInput[];
    OR?: Prisma.MdFacilityMaquilaWhereInput[];
    NOT?: Prisma.MdFacilityMaquilaWhereInput | Prisma.MdFacilityMaquilaWhereInput[];
    idDlkMaquila?: Prisma.IntFilter<"MdFacilityMaquila"> | number;
    codMaquila?: Prisma.StringFilter<"MdFacilityMaquila"> | string;
    codUbigeo?: Prisma.IntFilter<"MdFacilityMaquila"> | number;
    codGlnFacilityMaquila?: Prisma.StringNullableFilter<"MdFacilityMaquila"> | string | null;
    registryFacilityMaquila?: Prisma.StringFilter<"MdFacilityMaquila"> | string;
    identifierFacilityMaquila?: Prisma.StringFilter<"MdFacilityMaquila"> | string;
    nameFacilityMaquila?: Prisma.StringFilter<"MdFacilityMaquila"> | string;
    addressFacilityMaquila?: Prisma.StringFilter<"MdFacilityMaquila"> | string;
    gpsLocationFacilityMaquila?: Prisma.StringNullableFilter<"MdFacilityMaquila"> | string | null;
    emailFacilityMaquila?: Prisma.StringFilter<"MdFacilityMaquila"> | string;
    cellularFacilityMaquila?: Prisma.StringFilter<"MdFacilityMaquila"> | string;
    stateFacilityMaquila?: Prisma.IntFilter<"MdFacilityMaquila"> | number;
    codUsuarioCargaDl?: Prisma.StringFilter<"MdFacilityMaquila"> | string;
    fehProcesoCargaDl?: Prisma.DateTimeFilter<"MdFacilityMaquila"> | Date | string;
    fehProcesoModifDl?: Prisma.DateTimeFilter<"MdFacilityMaquila"> | Date | string;
    desAccion?: Prisma.StringFilter<"MdFacilityMaquila"> | string;
    flgStatutActif?: Prisma.IntFilter<"MdFacilityMaquila"> | number;
    maquila?: Prisma.XOR<Prisma.MdMaquilaScalarRelationFilter, Prisma.MdMaquilaWhereInput>;
}, "idDlkFacilityMaquila" | "codFacilityMaquila">;
export type MdFacilityMaquilaOrderByWithAggregationInput = {
    idDlkFacilityMaquila?: Prisma.SortOrder;
    codFacilityMaquila?: Prisma.SortOrder;
    idDlkMaquila?: Prisma.SortOrder;
    codMaquila?: Prisma.SortOrder;
    codUbigeo?: Prisma.SortOrder;
    codGlnFacilityMaquila?: Prisma.SortOrderInput | Prisma.SortOrder;
    registryFacilityMaquila?: Prisma.SortOrder;
    identifierFacilityMaquila?: Prisma.SortOrder;
    nameFacilityMaquila?: Prisma.SortOrder;
    addressFacilityMaquila?: Prisma.SortOrder;
    gpsLocationFacilityMaquila?: Prisma.SortOrderInput | Prisma.SortOrder;
    emailFacilityMaquila?: Prisma.SortOrder;
    cellularFacilityMaquila?: Prisma.SortOrder;
    stateFacilityMaquila?: Prisma.SortOrder;
    codUsuarioCargaDl?: Prisma.SortOrder;
    fehProcesoCargaDl?: Prisma.SortOrder;
    fehProcesoModifDl?: Prisma.SortOrder;
    desAccion?: Prisma.SortOrder;
    flgStatutActif?: Prisma.SortOrder;
    _count?: Prisma.MdFacilityMaquilaCountOrderByAggregateInput;
    _avg?: Prisma.MdFacilityMaquilaAvgOrderByAggregateInput;
    _max?: Prisma.MdFacilityMaquilaMaxOrderByAggregateInput;
    _min?: Prisma.MdFacilityMaquilaMinOrderByAggregateInput;
    _sum?: Prisma.MdFacilityMaquilaSumOrderByAggregateInput;
};
export type MdFacilityMaquilaScalarWhereWithAggregatesInput = {
    AND?: Prisma.MdFacilityMaquilaScalarWhereWithAggregatesInput | Prisma.MdFacilityMaquilaScalarWhereWithAggregatesInput[];
    OR?: Prisma.MdFacilityMaquilaScalarWhereWithAggregatesInput[];
    NOT?: Prisma.MdFacilityMaquilaScalarWhereWithAggregatesInput | Prisma.MdFacilityMaquilaScalarWhereWithAggregatesInput[];
    idDlkFacilityMaquila?: Prisma.IntWithAggregatesFilter<"MdFacilityMaquila"> | number;
    codFacilityMaquila?: Prisma.StringWithAggregatesFilter<"MdFacilityMaquila"> | string;
    idDlkMaquila?: Prisma.IntWithAggregatesFilter<"MdFacilityMaquila"> | number;
    codMaquila?: Prisma.StringWithAggregatesFilter<"MdFacilityMaquila"> | string;
    codUbigeo?: Prisma.IntWithAggregatesFilter<"MdFacilityMaquila"> | number;
    codGlnFacilityMaquila?: Prisma.StringNullableWithAggregatesFilter<"MdFacilityMaquila"> | string | null;
    registryFacilityMaquila?: Prisma.StringWithAggregatesFilter<"MdFacilityMaquila"> | string;
    identifierFacilityMaquila?: Prisma.StringWithAggregatesFilter<"MdFacilityMaquila"> | string;
    nameFacilityMaquila?: Prisma.StringWithAggregatesFilter<"MdFacilityMaquila"> | string;
    addressFacilityMaquila?: Prisma.StringWithAggregatesFilter<"MdFacilityMaquila"> | string;
    gpsLocationFacilityMaquila?: Prisma.StringNullableWithAggregatesFilter<"MdFacilityMaquila"> | string | null;
    emailFacilityMaquila?: Prisma.StringWithAggregatesFilter<"MdFacilityMaquila"> | string;
    cellularFacilityMaquila?: Prisma.StringWithAggregatesFilter<"MdFacilityMaquila"> | string;
    stateFacilityMaquila?: Prisma.IntWithAggregatesFilter<"MdFacilityMaquila"> | number;
    codUsuarioCargaDl?: Prisma.StringWithAggregatesFilter<"MdFacilityMaquila"> | string;
    fehProcesoCargaDl?: Prisma.DateTimeWithAggregatesFilter<"MdFacilityMaquila"> | Date | string;
    fehProcesoModifDl?: Prisma.DateTimeWithAggregatesFilter<"MdFacilityMaquila"> | Date | string;
    desAccion?: Prisma.StringWithAggregatesFilter<"MdFacilityMaquila"> | string;
    flgStatutActif?: Prisma.IntWithAggregatesFilter<"MdFacilityMaquila"> | number;
};
export type MdFacilityMaquilaCreateInput = {
    codFacilityMaquila: string;
    codMaquila: string;
    codUbigeo: number;
    codGlnFacilityMaquila?: string | null;
    registryFacilityMaquila: string;
    identifierFacilityMaquila: string;
    nameFacilityMaquila: string;
    addressFacilityMaquila: string;
    gpsLocationFacilityMaquila?: string | null;
    emailFacilityMaquila: string;
    cellularFacilityMaquila: string;
    stateFacilityMaquila?: number;
    codUsuarioCargaDl: string;
    fehProcesoCargaDl?: Date | string;
    fehProcesoModifDl?: Date | string;
    desAccion: string;
    flgStatutActif?: number;
    maquila: Prisma.MdMaquilaCreateNestedOneWithoutFacilitiesInput;
};
export type MdFacilityMaquilaUncheckedCreateInput = {
    idDlkFacilityMaquila?: number;
    codFacilityMaquila: string;
    idDlkMaquila: number;
    codMaquila: string;
    codUbigeo: number;
    codGlnFacilityMaquila?: string | null;
    registryFacilityMaquila: string;
    identifierFacilityMaquila: string;
    nameFacilityMaquila: string;
    addressFacilityMaquila: string;
    gpsLocationFacilityMaquila?: string | null;
    emailFacilityMaquila: string;
    cellularFacilityMaquila: string;
    stateFacilityMaquila?: number;
    codUsuarioCargaDl: string;
    fehProcesoCargaDl?: Date | string;
    fehProcesoModifDl?: Date | string;
    desAccion: string;
    flgStatutActif?: number;
};
export type MdFacilityMaquilaUpdateInput = {
    codFacilityMaquila?: Prisma.StringFieldUpdateOperationsInput | string;
    codMaquila?: Prisma.StringFieldUpdateOperationsInput | string;
    codUbigeo?: Prisma.IntFieldUpdateOperationsInput | number;
    codGlnFacilityMaquila?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    registryFacilityMaquila?: Prisma.StringFieldUpdateOperationsInput | string;
    identifierFacilityMaquila?: Prisma.StringFieldUpdateOperationsInput | string;
    nameFacilityMaquila?: Prisma.StringFieldUpdateOperationsInput | string;
    addressFacilityMaquila?: Prisma.StringFieldUpdateOperationsInput | string;
    gpsLocationFacilityMaquila?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    emailFacilityMaquila?: Prisma.StringFieldUpdateOperationsInput | string;
    cellularFacilityMaquila?: Prisma.StringFieldUpdateOperationsInput | string;
    stateFacilityMaquila?: Prisma.IntFieldUpdateOperationsInput | number;
    codUsuarioCargaDl?: Prisma.StringFieldUpdateOperationsInput | string;
    fehProcesoCargaDl?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    fehProcesoModifDl?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    desAccion?: Prisma.StringFieldUpdateOperationsInput | string;
    flgStatutActif?: Prisma.IntFieldUpdateOperationsInput | number;
    maquila?: Prisma.MdMaquilaUpdateOneRequiredWithoutFacilitiesNestedInput;
};
export type MdFacilityMaquilaUncheckedUpdateInput = {
    idDlkFacilityMaquila?: Prisma.IntFieldUpdateOperationsInput | number;
    codFacilityMaquila?: Prisma.StringFieldUpdateOperationsInput | string;
    idDlkMaquila?: Prisma.IntFieldUpdateOperationsInput | number;
    codMaquila?: Prisma.StringFieldUpdateOperationsInput | string;
    codUbigeo?: Prisma.IntFieldUpdateOperationsInput | number;
    codGlnFacilityMaquila?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    registryFacilityMaquila?: Prisma.StringFieldUpdateOperationsInput | string;
    identifierFacilityMaquila?: Prisma.StringFieldUpdateOperationsInput | string;
    nameFacilityMaquila?: Prisma.StringFieldUpdateOperationsInput | string;
    addressFacilityMaquila?: Prisma.StringFieldUpdateOperationsInput | string;
    gpsLocationFacilityMaquila?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    emailFacilityMaquila?: Prisma.StringFieldUpdateOperationsInput | string;
    cellularFacilityMaquila?: Prisma.StringFieldUpdateOperationsInput | string;
    stateFacilityMaquila?: Prisma.IntFieldUpdateOperationsInput | number;
    codUsuarioCargaDl?: Prisma.StringFieldUpdateOperationsInput | string;
    fehProcesoCargaDl?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    fehProcesoModifDl?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    desAccion?: Prisma.StringFieldUpdateOperationsInput | string;
    flgStatutActif?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type MdFacilityMaquilaCreateManyInput = {
    idDlkFacilityMaquila?: number;
    codFacilityMaquila: string;
    idDlkMaquila: number;
    codMaquila: string;
    codUbigeo: number;
    codGlnFacilityMaquila?: string | null;
    registryFacilityMaquila: string;
    identifierFacilityMaquila: string;
    nameFacilityMaquila: string;
    addressFacilityMaquila: string;
    gpsLocationFacilityMaquila?: string | null;
    emailFacilityMaquila: string;
    cellularFacilityMaquila: string;
    stateFacilityMaquila?: number;
    codUsuarioCargaDl: string;
    fehProcesoCargaDl?: Date | string;
    fehProcesoModifDl?: Date | string;
    desAccion: string;
    flgStatutActif?: number;
};
export type MdFacilityMaquilaUpdateManyMutationInput = {
    codFacilityMaquila?: Prisma.StringFieldUpdateOperationsInput | string;
    codMaquila?: Prisma.StringFieldUpdateOperationsInput | string;
    codUbigeo?: Prisma.IntFieldUpdateOperationsInput | number;
    codGlnFacilityMaquila?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    registryFacilityMaquila?: Prisma.StringFieldUpdateOperationsInput | string;
    identifierFacilityMaquila?: Prisma.StringFieldUpdateOperationsInput | string;
    nameFacilityMaquila?: Prisma.StringFieldUpdateOperationsInput | string;
    addressFacilityMaquila?: Prisma.StringFieldUpdateOperationsInput | string;
    gpsLocationFacilityMaquila?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    emailFacilityMaquila?: Prisma.StringFieldUpdateOperationsInput | string;
    cellularFacilityMaquila?: Prisma.StringFieldUpdateOperationsInput | string;
    stateFacilityMaquila?: Prisma.IntFieldUpdateOperationsInput | number;
    codUsuarioCargaDl?: Prisma.StringFieldUpdateOperationsInput | string;
    fehProcesoCargaDl?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    fehProcesoModifDl?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    desAccion?: Prisma.StringFieldUpdateOperationsInput | string;
    flgStatutActif?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type MdFacilityMaquilaUncheckedUpdateManyInput = {
    idDlkFacilityMaquila?: Prisma.IntFieldUpdateOperationsInput | number;
    codFacilityMaquila?: Prisma.StringFieldUpdateOperationsInput | string;
    idDlkMaquila?: Prisma.IntFieldUpdateOperationsInput | number;
    codMaquila?: Prisma.StringFieldUpdateOperationsInput | string;
    codUbigeo?: Prisma.IntFieldUpdateOperationsInput | number;
    codGlnFacilityMaquila?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    registryFacilityMaquila?: Prisma.StringFieldUpdateOperationsInput | string;
    identifierFacilityMaquila?: Prisma.StringFieldUpdateOperationsInput | string;
    nameFacilityMaquila?: Prisma.StringFieldUpdateOperationsInput | string;
    addressFacilityMaquila?: Prisma.StringFieldUpdateOperationsInput | string;
    gpsLocationFacilityMaquila?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    emailFacilityMaquila?: Prisma.StringFieldUpdateOperationsInput | string;
    cellularFacilityMaquila?: Prisma.StringFieldUpdateOperationsInput | string;
    stateFacilityMaquila?: Prisma.IntFieldUpdateOperationsInput | number;
    codUsuarioCargaDl?: Prisma.StringFieldUpdateOperationsInput | string;
    fehProcesoCargaDl?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    fehProcesoModifDl?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    desAccion?: Prisma.StringFieldUpdateOperationsInput | string;
    flgStatutActif?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type MdFacilityMaquilaListRelationFilter = {
    every?: Prisma.MdFacilityMaquilaWhereInput;
    some?: Prisma.MdFacilityMaquilaWhereInput;
    none?: Prisma.MdFacilityMaquilaWhereInput;
};
export type MdFacilityMaquilaOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type MdFacilityMaquilaOrderByRelevanceInput = {
    fields: Prisma.MdFacilityMaquilaOrderByRelevanceFieldEnum | Prisma.MdFacilityMaquilaOrderByRelevanceFieldEnum[];
    sort: Prisma.SortOrder;
    search: string;
};
export type MdFacilityMaquilaCountOrderByAggregateInput = {
    idDlkFacilityMaquila?: Prisma.SortOrder;
    codFacilityMaquila?: Prisma.SortOrder;
    idDlkMaquila?: Prisma.SortOrder;
    codMaquila?: Prisma.SortOrder;
    codUbigeo?: Prisma.SortOrder;
    codGlnFacilityMaquila?: Prisma.SortOrder;
    registryFacilityMaquila?: Prisma.SortOrder;
    identifierFacilityMaquila?: Prisma.SortOrder;
    nameFacilityMaquila?: Prisma.SortOrder;
    addressFacilityMaquila?: Prisma.SortOrder;
    gpsLocationFacilityMaquila?: Prisma.SortOrder;
    emailFacilityMaquila?: Prisma.SortOrder;
    cellularFacilityMaquila?: Prisma.SortOrder;
    stateFacilityMaquila?: Prisma.SortOrder;
    codUsuarioCargaDl?: Prisma.SortOrder;
    fehProcesoCargaDl?: Prisma.SortOrder;
    fehProcesoModifDl?: Prisma.SortOrder;
    desAccion?: Prisma.SortOrder;
    flgStatutActif?: Prisma.SortOrder;
};
export type MdFacilityMaquilaAvgOrderByAggregateInput = {
    idDlkFacilityMaquila?: Prisma.SortOrder;
    idDlkMaquila?: Prisma.SortOrder;
    codUbigeo?: Prisma.SortOrder;
    stateFacilityMaquila?: Prisma.SortOrder;
    flgStatutActif?: Prisma.SortOrder;
};
export type MdFacilityMaquilaMaxOrderByAggregateInput = {
    idDlkFacilityMaquila?: Prisma.SortOrder;
    codFacilityMaquila?: Prisma.SortOrder;
    idDlkMaquila?: Prisma.SortOrder;
    codMaquila?: Prisma.SortOrder;
    codUbigeo?: Prisma.SortOrder;
    codGlnFacilityMaquila?: Prisma.SortOrder;
    registryFacilityMaquila?: Prisma.SortOrder;
    identifierFacilityMaquila?: Prisma.SortOrder;
    nameFacilityMaquila?: Prisma.SortOrder;
    addressFacilityMaquila?: Prisma.SortOrder;
    gpsLocationFacilityMaquila?: Prisma.SortOrder;
    emailFacilityMaquila?: Prisma.SortOrder;
    cellularFacilityMaquila?: Prisma.SortOrder;
    stateFacilityMaquila?: Prisma.SortOrder;
    codUsuarioCargaDl?: Prisma.SortOrder;
    fehProcesoCargaDl?: Prisma.SortOrder;
    fehProcesoModifDl?: Prisma.SortOrder;
    desAccion?: Prisma.SortOrder;
    flgStatutActif?: Prisma.SortOrder;
};
export type MdFacilityMaquilaMinOrderByAggregateInput = {
    idDlkFacilityMaquila?: Prisma.SortOrder;
    codFacilityMaquila?: Prisma.SortOrder;
    idDlkMaquila?: Prisma.SortOrder;
    codMaquila?: Prisma.SortOrder;
    codUbigeo?: Prisma.SortOrder;
    codGlnFacilityMaquila?: Prisma.SortOrder;
    registryFacilityMaquila?: Prisma.SortOrder;
    identifierFacilityMaquila?: Prisma.SortOrder;
    nameFacilityMaquila?: Prisma.SortOrder;
    addressFacilityMaquila?: Prisma.SortOrder;
    gpsLocationFacilityMaquila?: Prisma.SortOrder;
    emailFacilityMaquila?: Prisma.SortOrder;
    cellularFacilityMaquila?: Prisma.SortOrder;
    stateFacilityMaquila?: Prisma.SortOrder;
    codUsuarioCargaDl?: Prisma.SortOrder;
    fehProcesoCargaDl?: Prisma.SortOrder;
    fehProcesoModifDl?: Prisma.SortOrder;
    desAccion?: Prisma.SortOrder;
    flgStatutActif?: Prisma.SortOrder;
};
export type MdFacilityMaquilaSumOrderByAggregateInput = {
    idDlkFacilityMaquila?: Prisma.SortOrder;
    idDlkMaquila?: Prisma.SortOrder;
    codUbigeo?: Prisma.SortOrder;
    stateFacilityMaquila?: Prisma.SortOrder;
    flgStatutActif?: Prisma.SortOrder;
};
export type MdFacilityMaquilaCreateNestedManyWithoutMaquilaInput = {
    create?: Prisma.XOR<Prisma.MdFacilityMaquilaCreateWithoutMaquilaInput, Prisma.MdFacilityMaquilaUncheckedCreateWithoutMaquilaInput> | Prisma.MdFacilityMaquilaCreateWithoutMaquilaInput[] | Prisma.MdFacilityMaquilaUncheckedCreateWithoutMaquilaInput[];
    connectOrCreate?: Prisma.MdFacilityMaquilaCreateOrConnectWithoutMaquilaInput | Prisma.MdFacilityMaquilaCreateOrConnectWithoutMaquilaInput[];
    createMany?: Prisma.MdFacilityMaquilaCreateManyMaquilaInputEnvelope;
    connect?: Prisma.MdFacilityMaquilaWhereUniqueInput | Prisma.MdFacilityMaquilaWhereUniqueInput[];
};
export type MdFacilityMaquilaUncheckedCreateNestedManyWithoutMaquilaInput = {
    create?: Prisma.XOR<Prisma.MdFacilityMaquilaCreateWithoutMaquilaInput, Prisma.MdFacilityMaquilaUncheckedCreateWithoutMaquilaInput> | Prisma.MdFacilityMaquilaCreateWithoutMaquilaInput[] | Prisma.MdFacilityMaquilaUncheckedCreateWithoutMaquilaInput[];
    connectOrCreate?: Prisma.MdFacilityMaquilaCreateOrConnectWithoutMaquilaInput | Prisma.MdFacilityMaquilaCreateOrConnectWithoutMaquilaInput[];
    createMany?: Prisma.MdFacilityMaquilaCreateManyMaquilaInputEnvelope;
    connect?: Prisma.MdFacilityMaquilaWhereUniqueInput | Prisma.MdFacilityMaquilaWhereUniqueInput[];
};
export type MdFacilityMaquilaUpdateManyWithoutMaquilaNestedInput = {
    create?: Prisma.XOR<Prisma.MdFacilityMaquilaCreateWithoutMaquilaInput, Prisma.MdFacilityMaquilaUncheckedCreateWithoutMaquilaInput> | Prisma.MdFacilityMaquilaCreateWithoutMaquilaInput[] | Prisma.MdFacilityMaquilaUncheckedCreateWithoutMaquilaInput[];
    connectOrCreate?: Prisma.MdFacilityMaquilaCreateOrConnectWithoutMaquilaInput | Prisma.MdFacilityMaquilaCreateOrConnectWithoutMaquilaInput[];
    upsert?: Prisma.MdFacilityMaquilaUpsertWithWhereUniqueWithoutMaquilaInput | Prisma.MdFacilityMaquilaUpsertWithWhereUniqueWithoutMaquilaInput[];
    createMany?: Prisma.MdFacilityMaquilaCreateManyMaquilaInputEnvelope;
    set?: Prisma.MdFacilityMaquilaWhereUniqueInput | Prisma.MdFacilityMaquilaWhereUniqueInput[];
    disconnect?: Prisma.MdFacilityMaquilaWhereUniqueInput | Prisma.MdFacilityMaquilaWhereUniqueInput[];
    delete?: Prisma.MdFacilityMaquilaWhereUniqueInput | Prisma.MdFacilityMaquilaWhereUniqueInput[];
    connect?: Prisma.MdFacilityMaquilaWhereUniqueInput | Prisma.MdFacilityMaquilaWhereUniqueInput[];
    update?: Prisma.MdFacilityMaquilaUpdateWithWhereUniqueWithoutMaquilaInput | Prisma.MdFacilityMaquilaUpdateWithWhereUniqueWithoutMaquilaInput[];
    updateMany?: Prisma.MdFacilityMaquilaUpdateManyWithWhereWithoutMaquilaInput | Prisma.MdFacilityMaquilaUpdateManyWithWhereWithoutMaquilaInput[];
    deleteMany?: Prisma.MdFacilityMaquilaScalarWhereInput | Prisma.MdFacilityMaquilaScalarWhereInput[];
};
export type MdFacilityMaquilaUncheckedUpdateManyWithoutMaquilaNestedInput = {
    create?: Prisma.XOR<Prisma.MdFacilityMaquilaCreateWithoutMaquilaInput, Prisma.MdFacilityMaquilaUncheckedCreateWithoutMaquilaInput> | Prisma.MdFacilityMaquilaCreateWithoutMaquilaInput[] | Prisma.MdFacilityMaquilaUncheckedCreateWithoutMaquilaInput[];
    connectOrCreate?: Prisma.MdFacilityMaquilaCreateOrConnectWithoutMaquilaInput | Prisma.MdFacilityMaquilaCreateOrConnectWithoutMaquilaInput[];
    upsert?: Prisma.MdFacilityMaquilaUpsertWithWhereUniqueWithoutMaquilaInput | Prisma.MdFacilityMaquilaUpsertWithWhereUniqueWithoutMaquilaInput[];
    createMany?: Prisma.MdFacilityMaquilaCreateManyMaquilaInputEnvelope;
    set?: Prisma.MdFacilityMaquilaWhereUniqueInput | Prisma.MdFacilityMaquilaWhereUniqueInput[];
    disconnect?: Prisma.MdFacilityMaquilaWhereUniqueInput | Prisma.MdFacilityMaquilaWhereUniqueInput[];
    delete?: Prisma.MdFacilityMaquilaWhereUniqueInput | Prisma.MdFacilityMaquilaWhereUniqueInput[];
    connect?: Prisma.MdFacilityMaquilaWhereUniqueInput | Prisma.MdFacilityMaquilaWhereUniqueInput[];
    update?: Prisma.MdFacilityMaquilaUpdateWithWhereUniqueWithoutMaquilaInput | Prisma.MdFacilityMaquilaUpdateWithWhereUniqueWithoutMaquilaInput[];
    updateMany?: Prisma.MdFacilityMaquilaUpdateManyWithWhereWithoutMaquilaInput | Prisma.MdFacilityMaquilaUpdateManyWithWhereWithoutMaquilaInput[];
    deleteMany?: Prisma.MdFacilityMaquilaScalarWhereInput | Prisma.MdFacilityMaquilaScalarWhereInput[];
};
export type MdFacilityMaquilaCreateWithoutMaquilaInput = {
    codFacilityMaquila: string;
    codMaquila: string;
    codUbigeo: number;
    codGlnFacilityMaquila?: string | null;
    registryFacilityMaquila: string;
    identifierFacilityMaquila: string;
    nameFacilityMaquila: string;
    addressFacilityMaquila: string;
    gpsLocationFacilityMaquila?: string | null;
    emailFacilityMaquila: string;
    cellularFacilityMaquila: string;
    stateFacilityMaquila?: number;
    codUsuarioCargaDl: string;
    fehProcesoCargaDl?: Date | string;
    fehProcesoModifDl?: Date | string;
    desAccion: string;
    flgStatutActif?: number;
};
export type MdFacilityMaquilaUncheckedCreateWithoutMaquilaInput = {
    idDlkFacilityMaquila?: number;
    codFacilityMaquila: string;
    codMaquila: string;
    codUbigeo: number;
    codGlnFacilityMaquila?: string | null;
    registryFacilityMaquila: string;
    identifierFacilityMaquila: string;
    nameFacilityMaquila: string;
    addressFacilityMaquila: string;
    gpsLocationFacilityMaquila?: string | null;
    emailFacilityMaquila: string;
    cellularFacilityMaquila: string;
    stateFacilityMaquila?: number;
    codUsuarioCargaDl: string;
    fehProcesoCargaDl?: Date | string;
    fehProcesoModifDl?: Date | string;
    desAccion: string;
    flgStatutActif?: number;
};
export type MdFacilityMaquilaCreateOrConnectWithoutMaquilaInput = {
    where: Prisma.MdFacilityMaquilaWhereUniqueInput;
    create: Prisma.XOR<Prisma.MdFacilityMaquilaCreateWithoutMaquilaInput, Prisma.MdFacilityMaquilaUncheckedCreateWithoutMaquilaInput>;
};
export type MdFacilityMaquilaCreateManyMaquilaInputEnvelope = {
    data: Prisma.MdFacilityMaquilaCreateManyMaquilaInput | Prisma.MdFacilityMaquilaCreateManyMaquilaInput[];
    skipDuplicates?: boolean;
};
export type MdFacilityMaquilaUpsertWithWhereUniqueWithoutMaquilaInput = {
    where: Prisma.MdFacilityMaquilaWhereUniqueInput;
    update: Prisma.XOR<Prisma.MdFacilityMaquilaUpdateWithoutMaquilaInput, Prisma.MdFacilityMaquilaUncheckedUpdateWithoutMaquilaInput>;
    create: Prisma.XOR<Prisma.MdFacilityMaquilaCreateWithoutMaquilaInput, Prisma.MdFacilityMaquilaUncheckedCreateWithoutMaquilaInput>;
};
export type MdFacilityMaquilaUpdateWithWhereUniqueWithoutMaquilaInput = {
    where: Prisma.MdFacilityMaquilaWhereUniqueInput;
    data: Prisma.XOR<Prisma.MdFacilityMaquilaUpdateWithoutMaquilaInput, Prisma.MdFacilityMaquilaUncheckedUpdateWithoutMaquilaInput>;
};
export type MdFacilityMaquilaUpdateManyWithWhereWithoutMaquilaInput = {
    where: Prisma.MdFacilityMaquilaScalarWhereInput;
    data: Prisma.XOR<Prisma.MdFacilityMaquilaUpdateManyMutationInput, Prisma.MdFacilityMaquilaUncheckedUpdateManyWithoutMaquilaInput>;
};
export type MdFacilityMaquilaScalarWhereInput = {
    AND?: Prisma.MdFacilityMaquilaScalarWhereInput | Prisma.MdFacilityMaquilaScalarWhereInput[];
    OR?: Prisma.MdFacilityMaquilaScalarWhereInput[];
    NOT?: Prisma.MdFacilityMaquilaScalarWhereInput | Prisma.MdFacilityMaquilaScalarWhereInput[];
    idDlkFacilityMaquila?: Prisma.IntFilter<"MdFacilityMaquila"> | number;
    codFacilityMaquila?: Prisma.StringFilter<"MdFacilityMaquila"> | string;
    idDlkMaquila?: Prisma.IntFilter<"MdFacilityMaquila"> | number;
    codMaquila?: Prisma.StringFilter<"MdFacilityMaquila"> | string;
    codUbigeo?: Prisma.IntFilter<"MdFacilityMaquila"> | number;
    codGlnFacilityMaquila?: Prisma.StringNullableFilter<"MdFacilityMaquila"> | string | null;
    registryFacilityMaquila?: Prisma.StringFilter<"MdFacilityMaquila"> | string;
    identifierFacilityMaquila?: Prisma.StringFilter<"MdFacilityMaquila"> | string;
    nameFacilityMaquila?: Prisma.StringFilter<"MdFacilityMaquila"> | string;
    addressFacilityMaquila?: Prisma.StringFilter<"MdFacilityMaquila"> | string;
    gpsLocationFacilityMaquila?: Prisma.StringNullableFilter<"MdFacilityMaquila"> | string | null;
    emailFacilityMaquila?: Prisma.StringFilter<"MdFacilityMaquila"> | string;
    cellularFacilityMaquila?: Prisma.StringFilter<"MdFacilityMaquila"> | string;
    stateFacilityMaquila?: Prisma.IntFilter<"MdFacilityMaquila"> | number;
    codUsuarioCargaDl?: Prisma.StringFilter<"MdFacilityMaquila"> | string;
    fehProcesoCargaDl?: Prisma.DateTimeFilter<"MdFacilityMaquila"> | Date | string;
    fehProcesoModifDl?: Prisma.DateTimeFilter<"MdFacilityMaquila"> | Date | string;
    desAccion?: Prisma.StringFilter<"MdFacilityMaquila"> | string;
    flgStatutActif?: Prisma.IntFilter<"MdFacilityMaquila"> | number;
};
export type MdFacilityMaquilaCreateManyMaquilaInput = {
    idDlkFacilityMaquila?: number;
    codFacilityMaquila: string;
    codMaquila: string;
    codUbigeo: number;
    codGlnFacilityMaquila?: string | null;
    registryFacilityMaquila: string;
    identifierFacilityMaquila: string;
    nameFacilityMaquila: string;
    addressFacilityMaquila: string;
    gpsLocationFacilityMaquila?: string | null;
    emailFacilityMaquila: string;
    cellularFacilityMaquila: string;
    stateFacilityMaquila?: number;
    codUsuarioCargaDl: string;
    fehProcesoCargaDl?: Date | string;
    fehProcesoModifDl?: Date | string;
    desAccion: string;
    flgStatutActif?: number;
};
export type MdFacilityMaquilaUpdateWithoutMaquilaInput = {
    codFacilityMaquila?: Prisma.StringFieldUpdateOperationsInput | string;
    codMaquila?: Prisma.StringFieldUpdateOperationsInput | string;
    codUbigeo?: Prisma.IntFieldUpdateOperationsInput | number;
    codGlnFacilityMaquila?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    registryFacilityMaquila?: Prisma.StringFieldUpdateOperationsInput | string;
    identifierFacilityMaquila?: Prisma.StringFieldUpdateOperationsInput | string;
    nameFacilityMaquila?: Prisma.StringFieldUpdateOperationsInput | string;
    addressFacilityMaquila?: Prisma.StringFieldUpdateOperationsInput | string;
    gpsLocationFacilityMaquila?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    emailFacilityMaquila?: Prisma.StringFieldUpdateOperationsInput | string;
    cellularFacilityMaquila?: Prisma.StringFieldUpdateOperationsInput | string;
    stateFacilityMaquila?: Prisma.IntFieldUpdateOperationsInput | number;
    codUsuarioCargaDl?: Prisma.StringFieldUpdateOperationsInput | string;
    fehProcesoCargaDl?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    fehProcesoModifDl?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    desAccion?: Prisma.StringFieldUpdateOperationsInput | string;
    flgStatutActif?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type MdFacilityMaquilaUncheckedUpdateWithoutMaquilaInput = {
    idDlkFacilityMaquila?: Prisma.IntFieldUpdateOperationsInput | number;
    codFacilityMaquila?: Prisma.StringFieldUpdateOperationsInput | string;
    codMaquila?: Prisma.StringFieldUpdateOperationsInput | string;
    codUbigeo?: Prisma.IntFieldUpdateOperationsInput | number;
    codGlnFacilityMaquila?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    registryFacilityMaquila?: Prisma.StringFieldUpdateOperationsInput | string;
    identifierFacilityMaquila?: Prisma.StringFieldUpdateOperationsInput | string;
    nameFacilityMaquila?: Prisma.StringFieldUpdateOperationsInput | string;
    addressFacilityMaquila?: Prisma.StringFieldUpdateOperationsInput | string;
    gpsLocationFacilityMaquila?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    emailFacilityMaquila?: Prisma.StringFieldUpdateOperationsInput | string;
    cellularFacilityMaquila?: Prisma.StringFieldUpdateOperationsInput | string;
    stateFacilityMaquila?: Prisma.IntFieldUpdateOperationsInput | number;
    codUsuarioCargaDl?: Prisma.StringFieldUpdateOperationsInput | string;
    fehProcesoCargaDl?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    fehProcesoModifDl?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    desAccion?: Prisma.StringFieldUpdateOperationsInput | string;
    flgStatutActif?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type MdFacilityMaquilaUncheckedUpdateManyWithoutMaquilaInput = {
    idDlkFacilityMaquila?: Prisma.IntFieldUpdateOperationsInput | number;
    codFacilityMaquila?: Prisma.StringFieldUpdateOperationsInput | string;
    codMaquila?: Prisma.StringFieldUpdateOperationsInput | string;
    codUbigeo?: Prisma.IntFieldUpdateOperationsInput | number;
    codGlnFacilityMaquila?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    registryFacilityMaquila?: Prisma.StringFieldUpdateOperationsInput | string;
    identifierFacilityMaquila?: Prisma.StringFieldUpdateOperationsInput | string;
    nameFacilityMaquila?: Prisma.StringFieldUpdateOperationsInput | string;
    addressFacilityMaquila?: Prisma.StringFieldUpdateOperationsInput | string;
    gpsLocationFacilityMaquila?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    emailFacilityMaquila?: Prisma.StringFieldUpdateOperationsInput | string;
    cellularFacilityMaquila?: Prisma.StringFieldUpdateOperationsInput | string;
    stateFacilityMaquila?: Prisma.IntFieldUpdateOperationsInput | number;
    codUsuarioCargaDl?: Prisma.StringFieldUpdateOperationsInput | string;
    fehProcesoCargaDl?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    fehProcesoModifDl?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    desAccion?: Prisma.StringFieldUpdateOperationsInput | string;
    flgStatutActif?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type MdFacilityMaquilaSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    idDlkFacilityMaquila?: boolean;
    codFacilityMaquila?: boolean;
    idDlkMaquila?: boolean;
    codMaquila?: boolean;
    codUbigeo?: boolean;
    codGlnFacilityMaquila?: boolean;
    registryFacilityMaquila?: boolean;
    identifierFacilityMaquila?: boolean;
    nameFacilityMaquila?: boolean;
    addressFacilityMaquila?: boolean;
    gpsLocationFacilityMaquila?: boolean;
    emailFacilityMaquila?: boolean;
    cellularFacilityMaquila?: boolean;
    stateFacilityMaquila?: boolean;
    codUsuarioCargaDl?: boolean;
    fehProcesoCargaDl?: boolean;
    fehProcesoModifDl?: boolean;
    desAccion?: boolean;
    flgStatutActif?: boolean;
    maquila?: boolean | Prisma.MdMaquilaDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["mdFacilityMaquila"]>;
export type MdFacilityMaquilaSelectScalar = {
    idDlkFacilityMaquila?: boolean;
    codFacilityMaquila?: boolean;
    idDlkMaquila?: boolean;
    codMaquila?: boolean;
    codUbigeo?: boolean;
    codGlnFacilityMaquila?: boolean;
    registryFacilityMaquila?: boolean;
    identifierFacilityMaquila?: boolean;
    nameFacilityMaquila?: boolean;
    addressFacilityMaquila?: boolean;
    gpsLocationFacilityMaquila?: boolean;
    emailFacilityMaquila?: boolean;
    cellularFacilityMaquila?: boolean;
    stateFacilityMaquila?: boolean;
    codUsuarioCargaDl?: boolean;
    fehProcesoCargaDl?: boolean;
    fehProcesoModifDl?: boolean;
    desAccion?: boolean;
    flgStatutActif?: boolean;
};
export type MdFacilityMaquilaOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"idDlkFacilityMaquila" | "codFacilityMaquila" | "idDlkMaquila" | "codMaquila" | "codUbigeo" | "codGlnFacilityMaquila" | "registryFacilityMaquila" | "identifierFacilityMaquila" | "nameFacilityMaquila" | "addressFacilityMaquila" | "gpsLocationFacilityMaquila" | "emailFacilityMaquila" | "cellularFacilityMaquila" | "stateFacilityMaquila" | "codUsuarioCargaDl" | "fehProcesoCargaDl" | "fehProcesoModifDl" | "desAccion" | "flgStatutActif", ExtArgs["result"]["mdFacilityMaquila"]>;
export type MdFacilityMaquilaInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    maquila?: boolean | Prisma.MdMaquilaDefaultArgs<ExtArgs>;
};
export type $MdFacilityMaquilaPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "MdFacilityMaquila";
    objects: {
        maquila: Prisma.$MdMaquilaPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        idDlkFacilityMaquila: number;
        codFacilityMaquila: string;
        idDlkMaquila: number;
        codMaquila: string;
        codUbigeo: number;
        codGlnFacilityMaquila: string | null;
        registryFacilityMaquila: string;
        identifierFacilityMaquila: string;
        nameFacilityMaquila: string;
        addressFacilityMaquila: string;
        gpsLocationFacilityMaquila: string | null;
        emailFacilityMaquila: string;
        cellularFacilityMaquila: string;
        stateFacilityMaquila: number;
        codUsuarioCargaDl: string;
        fehProcesoCargaDl: Date;
        fehProcesoModifDl: Date;
        desAccion: string;
        flgStatutActif: number;
    }, ExtArgs["result"]["mdFacilityMaquila"]>;
    composites: {};
};
export type MdFacilityMaquilaGetPayload<S extends boolean | null | undefined | MdFacilityMaquilaDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$MdFacilityMaquilaPayload, S>;
export type MdFacilityMaquilaCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<MdFacilityMaquilaFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: MdFacilityMaquilaCountAggregateInputType | true;
};
export interface MdFacilityMaquilaDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['MdFacilityMaquila'];
        meta: {
            name: 'MdFacilityMaquila';
        };
    };
    /**
     * Find zero or one MdFacilityMaquila that matches the filter.
     * @param {MdFacilityMaquilaFindUniqueArgs} args - Arguments to find a MdFacilityMaquila
     * @example
     * // Get one MdFacilityMaquila
     * const mdFacilityMaquila = await prisma.mdFacilityMaquila.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MdFacilityMaquilaFindUniqueArgs>(args: Prisma.SelectSubset<T, MdFacilityMaquilaFindUniqueArgs<ExtArgs>>): Prisma.Prisma__MdFacilityMaquilaClient<runtime.Types.Result.GetResult<Prisma.$MdFacilityMaquilaPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one MdFacilityMaquila that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MdFacilityMaquilaFindUniqueOrThrowArgs} args - Arguments to find a MdFacilityMaquila
     * @example
     * // Get one MdFacilityMaquila
     * const mdFacilityMaquila = await prisma.mdFacilityMaquila.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MdFacilityMaquilaFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, MdFacilityMaquilaFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__MdFacilityMaquilaClient<runtime.Types.Result.GetResult<Prisma.$MdFacilityMaquilaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first MdFacilityMaquila that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MdFacilityMaquilaFindFirstArgs} args - Arguments to find a MdFacilityMaquila
     * @example
     * // Get one MdFacilityMaquila
     * const mdFacilityMaquila = await prisma.mdFacilityMaquila.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MdFacilityMaquilaFindFirstArgs>(args?: Prisma.SelectSubset<T, MdFacilityMaquilaFindFirstArgs<ExtArgs>>): Prisma.Prisma__MdFacilityMaquilaClient<runtime.Types.Result.GetResult<Prisma.$MdFacilityMaquilaPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first MdFacilityMaquila that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MdFacilityMaquilaFindFirstOrThrowArgs} args - Arguments to find a MdFacilityMaquila
     * @example
     * // Get one MdFacilityMaquila
     * const mdFacilityMaquila = await prisma.mdFacilityMaquila.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MdFacilityMaquilaFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, MdFacilityMaquilaFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__MdFacilityMaquilaClient<runtime.Types.Result.GetResult<Prisma.$MdFacilityMaquilaPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more MdFacilityMaquilas that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MdFacilityMaquilaFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MdFacilityMaquilas
     * const mdFacilityMaquilas = await prisma.mdFacilityMaquila.findMany()
     *
     * // Get first 10 MdFacilityMaquilas
     * const mdFacilityMaquilas = await prisma.mdFacilityMaquila.findMany({ take: 10 })
     *
     * // Only select the `idDlkFacilityMaquila`
     * const mdFacilityMaquilaWithIdDlkFacilityMaquilaOnly = await prisma.mdFacilityMaquila.findMany({ select: { idDlkFacilityMaquila: true } })
     *
     */
    findMany<T extends MdFacilityMaquilaFindManyArgs>(args?: Prisma.SelectSubset<T, MdFacilityMaquilaFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MdFacilityMaquilaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a MdFacilityMaquila.
     * @param {MdFacilityMaquilaCreateArgs} args - Arguments to create a MdFacilityMaquila.
     * @example
     * // Create one MdFacilityMaquila
     * const MdFacilityMaquila = await prisma.mdFacilityMaquila.create({
     *   data: {
     *     // ... data to create a MdFacilityMaquila
     *   }
     * })
     *
     */
    create<T extends MdFacilityMaquilaCreateArgs>(args: Prisma.SelectSubset<T, MdFacilityMaquilaCreateArgs<ExtArgs>>): Prisma.Prisma__MdFacilityMaquilaClient<runtime.Types.Result.GetResult<Prisma.$MdFacilityMaquilaPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many MdFacilityMaquilas.
     * @param {MdFacilityMaquilaCreateManyArgs} args - Arguments to create many MdFacilityMaquilas.
     * @example
     * // Create many MdFacilityMaquilas
     * const mdFacilityMaquila = await prisma.mdFacilityMaquila.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends MdFacilityMaquilaCreateManyArgs>(args?: Prisma.SelectSubset<T, MdFacilityMaquilaCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Delete a MdFacilityMaquila.
     * @param {MdFacilityMaquilaDeleteArgs} args - Arguments to delete one MdFacilityMaquila.
     * @example
     * // Delete one MdFacilityMaquila
     * const MdFacilityMaquila = await prisma.mdFacilityMaquila.delete({
     *   where: {
     *     // ... filter to delete one MdFacilityMaquila
     *   }
     * })
     *
     */
    delete<T extends MdFacilityMaquilaDeleteArgs>(args: Prisma.SelectSubset<T, MdFacilityMaquilaDeleteArgs<ExtArgs>>): Prisma.Prisma__MdFacilityMaquilaClient<runtime.Types.Result.GetResult<Prisma.$MdFacilityMaquilaPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one MdFacilityMaquila.
     * @param {MdFacilityMaquilaUpdateArgs} args - Arguments to update one MdFacilityMaquila.
     * @example
     * // Update one MdFacilityMaquila
     * const mdFacilityMaquila = await prisma.mdFacilityMaquila.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends MdFacilityMaquilaUpdateArgs>(args: Prisma.SelectSubset<T, MdFacilityMaquilaUpdateArgs<ExtArgs>>): Prisma.Prisma__MdFacilityMaquilaClient<runtime.Types.Result.GetResult<Prisma.$MdFacilityMaquilaPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more MdFacilityMaquilas.
     * @param {MdFacilityMaquilaDeleteManyArgs} args - Arguments to filter MdFacilityMaquilas to delete.
     * @example
     * // Delete a few MdFacilityMaquilas
     * const { count } = await prisma.mdFacilityMaquila.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends MdFacilityMaquilaDeleteManyArgs>(args?: Prisma.SelectSubset<T, MdFacilityMaquilaDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more MdFacilityMaquilas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MdFacilityMaquilaUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MdFacilityMaquilas
     * const mdFacilityMaquila = await prisma.mdFacilityMaquila.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends MdFacilityMaquilaUpdateManyArgs>(args: Prisma.SelectSubset<T, MdFacilityMaquilaUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create or update one MdFacilityMaquila.
     * @param {MdFacilityMaquilaUpsertArgs} args - Arguments to update or create a MdFacilityMaquila.
     * @example
     * // Update or create a MdFacilityMaquila
     * const mdFacilityMaquila = await prisma.mdFacilityMaquila.upsert({
     *   create: {
     *     // ... data to create a MdFacilityMaquila
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MdFacilityMaquila we want to update
     *   }
     * })
     */
    upsert<T extends MdFacilityMaquilaUpsertArgs>(args: Prisma.SelectSubset<T, MdFacilityMaquilaUpsertArgs<ExtArgs>>): Prisma.Prisma__MdFacilityMaquilaClient<runtime.Types.Result.GetResult<Prisma.$MdFacilityMaquilaPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of MdFacilityMaquilas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MdFacilityMaquilaCountArgs} args - Arguments to filter MdFacilityMaquilas to count.
     * @example
     * // Count the number of MdFacilityMaquilas
     * const count = await prisma.mdFacilityMaquila.count({
     *   where: {
     *     // ... the filter for the MdFacilityMaquilas we want to count
     *   }
     * })
    **/
    count<T extends MdFacilityMaquilaCountArgs>(args?: Prisma.Subset<T, MdFacilityMaquilaCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], MdFacilityMaquilaCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a MdFacilityMaquila.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MdFacilityMaquilaAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends MdFacilityMaquilaAggregateArgs>(args: Prisma.Subset<T, MdFacilityMaquilaAggregateArgs>): Prisma.PrismaPromise<GetMdFacilityMaquilaAggregateType<T>>;
    /**
     * Group by MdFacilityMaquila.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MdFacilityMaquilaGroupByArgs} args - Group by arguments.
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
    groupBy<T extends MdFacilityMaquilaGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: MdFacilityMaquilaGroupByArgs['orderBy'];
    } : {
        orderBy?: MdFacilityMaquilaGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, MdFacilityMaquilaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMdFacilityMaquilaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the MdFacilityMaquila model
     */
    readonly fields: MdFacilityMaquilaFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for MdFacilityMaquila.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__MdFacilityMaquilaClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    maquila<T extends Prisma.MdMaquilaDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.MdMaquilaDefaultArgs<ExtArgs>>): Prisma.Prisma__MdMaquilaClient<runtime.Types.Result.GetResult<Prisma.$MdMaquilaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
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
 * Fields of the MdFacilityMaquila model
 */
export interface MdFacilityMaquilaFieldRefs {
    readonly idDlkFacilityMaquila: Prisma.FieldRef<"MdFacilityMaquila", 'Int'>;
    readonly codFacilityMaquila: Prisma.FieldRef<"MdFacilityMaquila", 'String'>;
    readonly idDlkMaquila: Prisma.FieldRef<"MdFacilityMaquila", 'Int'>;
    readonly codMaquila: Prisma.FieldRef<"MdFacilityMaquila", 'String'>;
    readonly codUbigeo: Prisma.FieldRef<"MdFacilityMaquila", 'Int'>;
    readonly codGlnFacilityMaquila: Prisma.FieldRef<"MdFacilityMaquila", 'String'>;
    readonly registryFacilityMaquila: Prisma.FieldRef<"MdFacilityMaquila", 'String'>;
    readonly identifierFacilityMaquila: Prisma.FieldRef<"MdFacilityMaquila", 'String'>;
    readonly nameFacilityMaquila: Prisma.FieldRef<"MdFacilityMaquila", 'String'>;
    readonly addressFacilityMaquila: Prisma.FieldRef<"MdFacilityMaquila", 'String'>;
    readonly gpsLocationFacilityMaquila: Prisma.FieldRef<"MdFacilityMaquila", 'String'>;
    readonly emailFacilityMaquila: Prisma.FieldRef<"MdFacilityMaquila", 'String'>;
    readonly cellularFacilityMaquila: Prisma.FieldRef<"MdFacilityMaquila", 'String'>;
    readonly stateFacilityMaquila: Prisma.FieldRef<"MdFacilityMaquila", 'Int'>;
    readonly codUsuarioCargaDl: Prisma.FieldRef<"MdFacilityMaquila", 'String'>;
    readonly fehProcesoCargaDl: Prisma.FieldRef<"MdFacilityMaquila", 'DateTime'>;
    readonly fehProcesoModifDl: Prisma.FieldRef<"MdFacilityMaquila", 'DateTime'>;
    readonly desAccion: Prisma.FieldRef<"MdFacilityMaquila", 'String'>;
    readonly flgStatutActif: Prisma.FieldRef<"MdFacilityMaquila", 'Int'>;
}
/**
 * MdFacilityMaquila findUnique
 */
export type MdFacilityMaquilaFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MdFacilityMaquila
     */
    select?: Prisma.MdFacilityMaquilaSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the MdFacilityMaquila
     */
    omit?: Prisma.MdFacilityMaquilaOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MdFacilityMaquilaInclude<ExtArgs> | null;
    /**
     * Filter, which MdFacilityMaquila to fetch.
     */
    where: Prisma.MdFacilityMaquilaWhereUniqueInput;
};
/**
 * MdFacilityMaquila findUniqueOrThrow
 */
export type MdFacilityMaquilaFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MdFacilityMaquila
     */
    select?: Prisma.MdFacilityMaquilaSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the MdFacilityMaquila
     */
    omit?: Prisma.MdFacilityMaquilaOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MdFacilityMaquilaInclude<ExtArgs> | null;
    /**
     * Filter, which MdFacilityMaquila to fetch.
     */
    where: Prisma.MdFacilityMaquilaWhereUniqueInput;
};
/**
 * MdFacilityMaquila findFirst
 */
export type MdFacilityMaquilaFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MdFacilityMaquila
     */
    select?: Prisma.MdFacilityMaquilaSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the MdFacilityMaquila
     */
    omit?: Prisma.MdFacilityMaquilaOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MdFacilityMaquilaInclude<ExtArgs> | null;
    /**
     * Filter, which MdFacilityMaquila to fetch.
     */
    where?: Prisma.MdFacilityMaquilaWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of MdFacilityMaquilas to fetch.
     */
    orderBy?: Prisma.MdFacilityMaquilaOrderByWithRelationInput | Prisma.MdFacilityMaquilaOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for MdFacilityMaquilas.
     */
    cursor?: Prisma.MdFacilityMaquilaWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` MdFacilityMaquilas from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` MdFacilityMaquilas.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of MdFacilityMaquilas.
     */
    distinct?: Prisma.MdFacilityMaquilaScalarFieldEnum | Prisma.MdFacilityMaquilaScalarFieldEnum[];
};
/**
 * MdFacilityMaquila findFirstOrThrow
 */
export type MdFacilityMaquilaFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MdFacilityMaquila
     */
    select?: Prisma.MdFacilityMaquilaSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the MdFacilityMaquila
     */
    omit?: Prisma.MdFacilityMaquilaOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MdFacilityMaquilaInclude<ExtArgs> | null;
    /**
     * Filter, which MdFacilityMaquila to fetch.
     */
    where?: Prisma.MdFacilityMaquilaWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of MdFacilityMaquilas to fetch.
     */
    orderBy?: Prisma.MdFacilityMaquilaOrderByWithRelationInput | Prisma.MdFacilityMaquilaOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for MdFacilityMaquilas.
     */
    cursor?: Prisma.MdFacilityMaquilaWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` MdFacilityMaquilas from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` MdFacilityMaquilas.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of MdFacilityMaquilas.
     */
    distinct?: Prisma.MdFacilityMaquilaScalarFieldEnum | Prisma.MdFacilityMaquilaScalarFieldEnum[];
};
/**
 * MdFacilityMaquila findMany
 */
export type MdFacilityMaquilaFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MdFacilityMaquila
     */
    select?: Prisma.MdFacilityMaquilaSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the MdFacilityMaquila
     */
    omit?: Prisma.MdFacilityMaquilaOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MdFacilityMaquilaInclude<ExtArgs> | null;
    /**
     * Filter, which MdFacilityMaquilas to fetch.
     */
    where?: Prisma.MdFacilityMaquilaWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of MdFacilityMaquilas to fetch.
     */
    orderBy?: Prisma.MdFacilityMaquilaOrderByWithRelationInput | Prisma.MdFacilityMaquilaOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing MdFacilityMaquilas.
     */
    cursor?: Prisma.MdFacilityMaquilaWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` MdFacilityMaquilas from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` MdFacilityMaquilas.
     */
    skip?: number;
    distinct?: Prisma.MdFacilityMaquilaScalarFieldEnum | Prisma.MdFacilityMaquilaScalarFieldEnum[];
};
/**
 * MdFacilityMaquila create
 */
export type MdFacilityMaquilaCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MdFacilityMaquila
     */
    select?: Prisma.MdFacilityMaquilaSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the MdFacilityMaquila
     */
    omit?: Prisma.MdFacilityMaquilaOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MdFacilityMaquilaInclude<ExtArgs> | null;
    /**
     * The data needed to create a MdFacilityMaquila.
     */
    data: Prisma.XOR<Prisma.MdFacilityMaquilaCreateInput, Prisma.MdFacilityMaquilaUncheckedCreateInput>;
};
/**
 * MdFacilityMaquila createMany
 */
export type MdFacilityMaquilaCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many MdFacilityMaquilas.
     */
    data: Prisma.MdFacilityMaquilaCreateManyInput | Prisma.MdFacilityMaquilaCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * MdFacilityMaquila update
 */
export type MdFacilityMaquilaUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MdFacilityMaquila
     */
    select?: Prisma.MdFacilityMaquilaSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the MdFacilityMaquila
     */
    omit?: Prisma.MdFacilityMaquilaOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MdFacilityMaquilaInclude<ExtArgs> | null;
    /**
     * The data needed to update a MdFacilityMaquila.
     */
    data: Prisma.XOR<Prisma.MdFacilityMaquilaUpdateInput, Prisma.MdFacilityMaquilaUncheckedUpdateInput>;
    /**
     * Choose, which MdFacilityMaquila to update.
     */
    where: Prisma.MdFacilityMaquilaWhereUniqueInput;
};
/**
 * MdFacilityMaquila updateMany
 */
export type MdFacilityMaquilaUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update MdFacilityMaquilas.
     */
    data: Prisma.XOR<Prisma.MdFacilityMaquilaUpdateManyMutationInput, Prisma.MdFacilityMaquilaUncheckedUpdateManyInput>;
    /**
     * Filter which MdFacilityMaquilas to update
     */
    where?: Prisma.MdFacilityMaquilaWhereInput;
    /**
     * Limit how many MdFacilityMaquilas to update.
     */
    limit?: number;
};
/**
 * MdFacilityMaquila upsert
 */
export type MdFacilityMaquilaUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MdFacilityMaquila
     */
    select?: Prisma.MdFacilityMaquilaSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the MdFacilityMaquila
     */
    omit?: Prisma.MdFacilityMaquilaOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MdFacilityMaquilaInclude<ExtArgs> | null;
    /**
     * The filter to search for the MdFacilityMaquila to update in case it exists.
     */
    where: Prisma.MdFacilityMaquilaWhereUniqueInput;
    /**
     * In case the MdFacilityMaquila found by the `where` argument doesn't exist, create a new MdFacilityMaquila with this data.
     */
    create: Prisma.XOR<Prisma.MdFacilityMaquilaCreateInput, Prisma.MdFacilityMaquilaUncheckedCreateInput>;
    /**
     * In case the MdFacilityMaquila was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.MdFacilityMaquilaUpdateInput, Prisma.MdFacilityMaquilaUncheckedUpdateInput>;
};
/**
 * MdFacilityMaquila delete
 */
export type MdFacilityMaquilaDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MdFacilityMaquila
     */
    select?: Prisma.MdFacilityMaquilaSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the MdFacilityMaquila
     */
    omit?: Prisma.MdFacilityMaquilaOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MdFacilityMaquilaInclude<ExtArgs> | null;
    /**
     * Filter which MdFacilityMaquila to delete.
     */
    where: Prisma.MdFacilityMaquilaWhereUniqueInput;
};
/**
 * MdFacilityMaquila deleteMany
 */
export type MdFacilityMaquilaDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which MdFacilityMaquilas to delete
     */
    where?: Prisma.MdFacilityMaquilaWhereInput;
    /**
     * Limit how many MdFacilityMaquilas to delete.
     */
    limit?: number;
};
/**
 * MdFacilityMaquila without action
 */
export type MdFacilityMaquilaDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MdFacilityMaquila
     */
    select?: Prisma.MdFacilityMaquilaSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the MdFacilityMaquila
     */
    omit?: Prisma.MdFacilityMaquilaOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MdFacilityMaquilaInclude<ExtArgs> | null;
};
export {};
