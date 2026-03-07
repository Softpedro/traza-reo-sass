import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model MdSubbrand
 *
 */
export type MdSubbrandModel = runtime.Types.Result.DefaultSelection<Prisma.$MdSubbrandPayload>;
export type AggregateMdSubbrand = {
    _count: MdSubbrandCountAggregateOutputType | null;
    _avg: MdSubbrandAvgAggregateOutputType | null;
    _sum: MdSubbrandSumAggregateOutputType | null;
    _min: MdSubbrandMinAggregateOutputType | null;
    _max: MdSubbrandMaxAggregateOutputType | null;
};
export type MdSubbrandAvgAggregateOutputType = {
    idDlkSubbrand: number | null;
    idDlkBrand: number | null;
    codUbigeoSubbrand: number | null;
    stateSubbrand: number | null;
    flgStatutActif: number | null;
};
export type MdSubbrandSumAggregateOutputType = {
    idDlkSubbrand: number | null;
    idDlkBrand: number | null;
    codUbigeoSubbrand: number | null;
    stateSubbrand: number | null;
    flgStatutActif: number | null;
};
export type MdSubbrandMinAggregateOutputType = {
    idDlkSubbrand: number | null;
    codSubbrand: string | null;
    idDlkBrand: number | null;
    codBrand: string | null;
    nameSubbrand: string | null;
    codUbigeoSubbrand: number | null;
    addressSubbrand: string | null;
    locationSubbrand: string | null;
    emailSubbrand: string | null;
    cellularSubbrand: string | null;
    facebookSubbrand: string | null;
    instagramSubbrand: string | null;
    whatsappSubbrand: string | null;
    ecommerceSubbrand: string | null;
    logoSubbrand: runtime.Bytes | null;
    stateSubbrand: number | null;
    codUsuarioCargaDl: string | null;
    fehProcesoCargaDl: Date | null;
    fehProcesoModifDl: Date | null;
    desAccion: string | null;
    flgStatutActif: number | null;
};
export type MdSubbrandMaxAggregateOutputType = {
    idDlkSubbrand: number | null;
    codSubbrand: string | null;
    idDlkBrand: number | null;
    codBrand: string | null;
    nameSubbrand: string | null;
    codUbigeoSubbrand: number | null;
    addressSubbrand: string | null;
    locationSubbrand: string | null;
    emailSubbrand: string | null;
    cellularSubbrand: string | null;
    facebookSubbrand: string | null;
    instagramSubbrand: string | null;
    whatsappSubbrand: string | null;
    ecommerceSubbrand: string | null;
    logoSubbrand: runtime.Bytes | null;
    stateSubbrand: number | null;
    codUsuarioCargaDl: string | null;
    fehProcesoCargaDl: Date | null;
    fehProcesoModifDl: Date | null;
    desAccion: string | null;
    flgStatutActif: number | null;
};
export type MdSubbrandCountAggregateOutputType = {
    idDlkSubbrand: number;
    codSubbrand: number;
    idDlkBrand: number;
    codBrand: number;
    nameSubbrand: number;
    codUbigeoSubbrand: number;
    addressSubbrand: number;
    locationSubbrand: number;
    emailSubbrand: number;
    cellularSubbrand: number;
    facebookSubbrand: number;
    instagramSubbrand: number;
    whatsappSubbrand: number;
    ecommerceSubbrand: number;
    logoSubbrand: number;
    stateSubbrand: number;
    codUsuarioCargaDl: number;
    fehProcesoCargaDl: number;
    fehProcesoModifDl: number;
    desAccion: number;
    flgStatutActif: number;
    _all: number;
};
export type MdSubbrandAvgAggregateInputType = {
    idDlkSubbrand?: true;
    idDlkBrand?: true;
    codUbigeoSubbrand?: true;
    stateSubbrand?: true;
    flgStatutActif?: true;
};
export type MdSubbrandSumAggregateInputType = {
    idDlkSubbrand?: true;
    idDlkBrand?: true;
    codUbigeoSubbrand?: true;
    stateSubbrand?: true;
    flgStatutActif?: true;
};
export type MdSubbrandMinAggregateInputType = {
    idDlkSubbrand?: true;
    codSubbrand?: true;
    idDlkBrand?: true;
    codBrand?: true;
    nameSubbrand?: true;
    codUbigeoSubbrand?: true;
    addressSubbrand?: true;
    locationSubbrand?: true;
    emailSubbrand?: true;
    cellularSubbrand?: true;
    facebookSubbrand?: true;
    instagramSubbrand?: true;
    whatsappSubbrand?: true;
    ecommerceSubbrand?: true;
    logoSubbrand?: true;
    stateSubbrand?: true;
    codUsuarioCargaDl?: true;
    fehProcesoCargaDl?: true;
    fehProcesoModifDl?: true;
    desAccion?: true;
    flgStatutActif?: true;
};
export type MdSubbrandMaxAggregateInputType = {
    idDlkSubbrand?: true;
    codSubbrand?: true;
    idDlkBrand?: true;
    codBrand?: true;
    nameSubbrand?: true;
    codUbigeoSubbrand?: true;
    addressSubbrand?: true;
    locationSubbrand?: true;
    emailSubbrand?: true;
    cellularSubbrand?: true;
    facebookSubbrand?: true;
    instagramSubbrand?: true;
    whatsappSubbrand?: true;
    ecommerceSubbrand?: true;
    logoSubbrand?: true;
    stateSubbrand?: true;
    codUsuarioCargaDl?: true;
    fehProcesoCargaDl?: true;
    fehProcesoModifDl?: true;
    desAccion?: true;
    flgStatutActif?: true;
};
export type MdSubbrandCountAggregateInputType = {
    idDlkSubbrand?: true;
    codSubbrand?: true;
    idDlkBrand?: true;
    codBrand?: true;
    nameSubbrand?: true;
    codUbigeoSubbrand?: true;
    addressSubbrand?: true;
    locationSubbrand?: true;
    emailSubbrand?: true;
    cellularSubbrand?: true;
    facebookSubbrand?: true;
    instagramSubbrand?: true;
    whatsappSubbrand?: true;
    ecommerceSubbrand?: true;
    logoSubbrand?: true;
    stateSubbrand?: true;
    codUsuarioCargaDl?: true;
    fehProcesoCargaDl?: true;
    fehProcesoModifDl?: true;
    desAccion?: true;
    flgStatutActif?: true;
    _all?: true;
};
export type MdSubbrandAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which MdSubbrand to aggregate.
     */
    where?: Prisma.MdSubbrandWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of MdSubbrands to fetch.
     */
    orderBy?: Prisma.MdSubbrandOrderByWithRelationInput | Prisma.MdSubbrandOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.MdSubbrandWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` MdSubbrands from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` MdSubbrands.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned MdSubbrands
    **/
    _count?: true | MdSubbrandCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: MdSubbrandAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: MdSubbrandSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: MdSubbrandMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: MdSubbrandMaxAggregateInputType;
};
export type GetMdSubbrandAggregateType<T extends MdSubbrandAggregateArgs> = {
    [P in keyof T & keyof AggregateMdSubbrand]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateMdSubbrand[P]> : Prisma.GetScalarType<T[P], AggregateMdSubbrand[P]>;
};
export type MdSubbrandGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MdSubbrandWhereInput;
    orderBy?: Prisma.MdSubbrandOrderByWithAggregationInput | Prisma.MdSubbrandOrderByWithAggregationInput[];
    by: Prisma.MdSubbrandScalarFieldEnum[] | Prisma.MdSubbrandScalarFieldEnum;
    having?: Prisma.MdSubbrandScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: MdSubbrandCountAggregateInputType | true;
    _avg?: MdSubbrandAvgAggregateInputType;
    _sum?: MdSubbrandSumAggregateInputType;
    _min?: MdSubbrandMinAggregateInputType;
    _max?: MdSubbrandMaxAggregateInputType;
};
export type MdSubbrandGroupByOutputType = {
    idDlkSubbrand: number;
    codSubbrand: string;
    idDlkBrand: number;
    codBrand: string;
    nameSubbrand: string;
    codUbigeoSubbrand: number;
    addressSubbrand: string;
    locationSubbrand: string | null;
    emailSubbrand: string;
    cellularSubbrand: string;
    facebookSubbrand: string | null;
    instagramSubbrand: string | null;
    whatsappSubbrand: string | null;
    ecommerceSubbrand: string | null;
    logoSubbrand: runtime.Bytes | null;
    stateSubbrand: number;
    codUsuarioCargaDl: string;
    fehProcesoCargaDl: Date;
    fehProcesoModifDl: Date;
    desAccion: string;
    flgStatutActif: number;
    _count: MdSubbrandCountAggregateOutputType | null;
    _avg: MdSubbrandAvgAggregateOutputType | null;
    _sum: MdSubbrandSumAggregateOutputType | null;
    _min: MdSubbrandMinAggregateOutputType | null;
    _max: MdSubbrandMaxAggregateOutputType | null;
};
type GetMdSubbrandGroupByPayload<T extends MdSubbrandGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<MdSubbrandGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof MdSubbrandGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], MdSubbrandGroupByOutputType[P]> : Prisma.GetScalarType<T[P], MdSubbrandGroupByOutputType[P]>;
}>>;
export type MdSubbrandWhereInput = {
    AND?: Prisma.MdSubbrandWhereInput | Prisma.MdSubbrandWhereInput[];
    OR?: Prisma.MdSubbrandWhereInput[];
    NOT?: Prisma.MdSubbrandWhereInput | Prisma.MdSubbrandWhereInput[];
    idDlkSubbrand?: Prisma.IntFilter<"MdSubbrand"> | number;
    codSubbrand?: Prisma.StringFilter<"MdSubbrand"> | string;
    idDlkBrand?: Prisma.IntFilter<"MdSubbrand"> | number;
    codBrand?: Prisma.StringFilter<"MdSubbrand"> | string;
    nameSubbrand?: Prisma.StringFilter<"MdSubbrand"> | string;
    codUbigeoSubbrand?: Prisma.IntFilter<"MdSubbrand"> | number;
    addressSubbrand?: Prisma.StringFilter<"MdSubbrand"> | string;
    locationSubbrand?: Prisma.StringNullableFilter<"MdSubbrand"> | string | null;
    emailSubbrand?: Prisma.StringFilter<"MdSubbrand"> | string;
    cellularSubbrand?: Prisma.StringFilter<"MdSubbrand"> | string;
    facebookSubbrand?: Prisma.StringNullableFilter<"MdSubbrand"> | string | null;
    instagramSubbrand?: Prisma.StringNullableFilter<"MdSubbrand"> | string | null;
    whatsappSubbrand?: Prisma.StringNullableFilter<"MdSubbrand"> | string | null;
    ecommerceSubbrand?: Prisma.StringNullableFilter<"MdSubbrand"> | string | null;
    logoSubbrand?: Prisma.BytesNullableFilter<"MdSubbrand"> | runtime.Bytes | null;
    stateSubbrand?: Prisma.IntFilter<"MdSubbrand"> | number;
    codUsuarioCargaDl?: Prisma.StringFilter<"MdSubbrand"> | string;
    fehProcesoCargaDl?: Prisma.DateTimeFilter<"MdSubbrand"> | Date | string;
    fehProcesoModifDl?: Prisma.DateTimeFilter<"MdSubbrand"> | Date | string;
    desAccion?: Prisma.StringFilter<"MdSubbrand"> | string;
    flgStatutActif?: Prisma.IntFilter<"MdSubbrand"> | number;
    brand?: Prisma.XOR<Prisma.MdBrandScalarRelationFilter, Prisma.MdBrandWhereInput>;
};
export type MdSubbrandOrderByWithRelationInput = {
    idDlkSubbrand?: Prisma.SortOrder;
    codSubbrand?: Prisma.SortOrder;
    idDlkBrand?: Prisma.SortOrder;
    codBrand?: Prisma.SortOrder;
    nameSubbrand?: Prisma.SortOrder;
    codUbigeoSubbrand?: Prisma.SortOrder;
    addressSubbrand?: Prisma.SortOrder;
    locationSubbrand?: Prisma.SortOrderInput | Prisma.SortOrder;
    emailSubbrand?: Prisma.SortOrder;
    cellularSubbrand?: Prisma.SortOrder;
    facebookSubbrand?: Prisma.SortOrderInput | Prisma.SortOrder;
    instagramSubbrand?: Prisma.SortOrderInput | Prisma.SortOrder;
    whatsappSubbrand?: Prisma.SortOrderInput | Prisma.SortOrder;
    ecommerceSubbrand?: Prisma.SortOrderInput | Prisma.SortOrder;
    logoSubbrand?: Prisma.SortOrderInput | Prisma.SortOrder;
    stateSubbrand?: Prisma.SortOrder;
    codUsuarioCargaDl?: Prisma.SortOrder;
    fehProcesoCargaDl?: Prisma.SortOrder;
    fehProcesoModifDl?: Prisma.SortOrder;
    desAccion?: Prisma.SortOrder;
    flgStatutActif?: Prisma.SortOrder;
    brand?: Prisma.MdBrandOrderByWithRelationInput;
    _relevance?: Prisma.MdSubbrandOrderByRelevanceInput;
};
export type MdSubbrandWhereUniqueInput = Prisma.AtLeast<{
    idDlkSubbrand?: number;
    codSubbrand?: string;
    AND?: Prisma.MdSubbrandWhereInput | Prisma.MdSubbrandWhereInput[];
    OR?: Prisma.MdSubbrandWhereInput[];
    NOT?: Prisma.MdSubbrandWhereInput | Prisma.MdSubbrandWhereInput[];
    idDlkBrand?: Prisma.IntFilter<"MdSubbrand"> | number;
    codBrand?: Prisma.StringFilter<"MdSubbrand"> | string;
    nameSubbrand?: Prisma.StringFilter<"MdSubbrand"> | string;
    codUbigeoSubbrand?: Prisma.IntFilter<"MdSubbrand"> | number;
    addressSubbrand?: Prisma.StringFilter<"MdSubbrand"> | string;
    locationSubbrand?: Prisma.StringNullableFilter<"MdSubbrand"> | string | null;
    emailSubbrand?: Prisma.StringFilter<"MdSubbrand"> | string;
    cellularSubbrand?: Prisma.StringFilter<"MdSubbrand"> | string;
    facebookSubbrand?: Prisma.StringNullableFilter<"MdSubbrand"> | string | null;
    instagramSubbrand?: Prisma.StringNullableFilter<"MdSubbrand"> | string | null;
    whatsappSubbrand?: Prisma.StringNullableFilter<"MdSubbrand"> | string | null;
    ecommerceSubbrand?: Prisma.StringNullableFilter<"MdSubbrand"> | string | null;
    logoSubbrand?: Prisma.BytesNullableFilter<"MdSubbrand"> | runtime.Bytes | null;
    stateSubbrand?: Prisma.IntFilter<"MdSubbrand"> | number;
    codUsuarioCargaDl?: Prisma.StringFilter<"MdSubbrand"> | string;
    fehProcesoCargaDl?: Prisma.DateTimeFilter<"MdSubbrand"> | Date | string;
    fehProcesoModifDl?: Prisma.DateTimeFilter<"MdSubbrand"> | Date | string;
    desAccion?: Prisma.StringFilter<"MdSubbrand"> | string;
    flgStatutActif?: Prisma.IntFilter<"MdSubbrand"> | number;
    brand?: Prisma.XOR<Prisma.MdBrandScalarRelationFilter, Prisma.MdBrandWhereInput>;
}, "idDlkSubbrand" | "codSubbrand">;
export type MdSubbrandOrderByWithAggregationInput = {
    idDlkSubbrand?: Prisma.SortOrder;
    codSubbrand?: Prisma.SortOrder;
    idDlkBrand?: Prisma.SortOrder;
    codBrand?: Prisma.SortOrder;
    nameSubbrand?: Prisma.SortOrder;
    codUbigeoSubbrand?: Prisma.SortOrder;
    addressSubbrand?: Prisma.SortOrder;
    locationSubbrand?: Prisma.SortOrderInput | Prisma.SortOrder;
    emailSubbrand?: Prisma.SortOrder;
    cellularSubbrand?: Prisma.SortOrder;
    facebookSubbrand?: Prisma.SortOrderInput | Prisma.SortOrder;
    instagramSubbrand?: Prisma.SortOrderInput | Prisma.SortOrder;
    whatsappSubbrand?: Prisma.SortOrderInput | Prisma.SortOrder;
    ecommerceSubbrand?: Prisma.SortOrderInput | Prisma.SortOrder;
    logoSubbrand?: Prisma.SortOrderInput | Prisma.SortOrder;
    stateSubbrand?: Prisma.SortOrder;
    codUsuarioCargaDl?: Prisma.SortOrder;
    fehProcesoCargaDl?: Prisma.SortOrder;
    fehProcesoModifDl?: Prisma.SortOrder;
    desAccion?: Prisma.SortOrder;
    flgStatutActif?: Prisma.SortOrder;
    _count?: Prisma.MdSubbrandCountOrderByAggregateInput;
    _avg?: Prisma.MdSubbrandAvgOrderByAggregateInput;
    _max?: Prisma.MdSubbrandMaxOrderByAggregateInput;
    _min?: Prisma.MdSubbrandMinOrderByAggregateInput;
    _sum?: Prisma.MdSubbrandSumOrderByAggregateInput;
};
export type MdSubbrandScalarWhereWithAggregatesInput = {
    AND?: Prisma.MdSubbrandScalarWhereWithAggregatesInput | Prisma.MdSubbrandScalarWhereWithAggregatesInput[];
    OR?: Prisma.MdSubbrandScalarWhereWithAggregatesInput[];
    NOT?: Prisma.MdSubbrandScalarWhereWithAggregatesInput | Prisma.MdSubbrandScalarWhereWithAggregatesInput[];
    idDlkSubbrand?: Prisma.IntWithAggregatesFilter<"MdSubbrand"> | number;
    codSubbrand?: Prisma.StringWithAggregatesFilter<"MdSubbrand"> | string;
    idDlkBrand?: Prisma.IntWithAggregatesFilter<"MdSubbrand"> | number;
    codBrand?: Prisma.StringWithAggregatesFilter<"MdSubbrand"> | string;
    nameSubbrand?: Prisma.StringWithAggregatesFilter<"MdSubbrand"> | string;
    codUbigeoSubbrand?: Prisma.IntWithAggregatesFilter<"MdSubbrand"> | number;
    addressSubbrand?: Prisma.StringWithAggregatesFilter<"MdSubbrand"> | string;
    locationSubbrand?: Prisma.StringNullableWithAggregatesFilter<"MdSubbrand"> | string | null;
    emailSubbrand?: Prisma.StringWithAggregatesFilter<"MdSubbrand"> | string;
    cellularSubbrand?: Prisma.StringWithAggregatesFilter<"MdSubbrand"> | string;
    facebookSubbrand?: Prisma.StringNullableWithAggregatesFilter<"MdSubbrand"> | string | null;
    instagramSubbrand?: Prisma.StringNullableWithAggregatesFilter<"MdSubbrand"> | string | null;
    whatsappSubbrand?: Prisma.StringNullableWithAggregatesFilter<"MdSubbrand"> | string | null;
    ecommerceSubbrand?: Prisma.StringNullableWithAggregatesFilter<"MdSubbrand"> | string | null;
    logoSubbrand?: Prisma.BytesNullableWithAggregatesFilter<"MdSubbrand"> | runtime.Bytes | null;
    stateSubbrand?: Prisma.IntWithAggregatesFilter<"MdSubbrand"> | number;
    codUsuarioCargaDl?: Prisma.StringWithAggregatesFilter<"MdSubbrand"> | string;
    fehProcesoCargaDl?: Prisma.DateTimeWithAggregatesFilter<"MdSubbrand"> | Date | string;
    fehProcesoModifDl?: Prisma.DateTimeWithAggregatesFilter<"MdSubbrand"> | Date | string;
    desAccion?: Prisma.StringWithAggregatesFilter<"MdSubbrand"> | string;
    flgStatutActif?: Prisma.IntWithAggregatesFilter<"MdSubbrand"> | number;
};
export type MdSubbrandCreateInput = {
    codSubbrand: string;
    codBrand: string;
    nameSubbrand: string;
    codUbigeoSubbrand: number;
    addressSubbrand: string;
    locationSubbrand?: string | null;
    emailSubbrand: string;
    cellularSubbrand: string;
    facebookSubbrand?: string | null;
    instagramSubbrand?: string | null;
    whatsappSubbrand?: string | null;
    ecommerceSubbrand?: string | null;
    logoSubbrand?: runtime.Bytes | null;
    stateSubbrand?: number;
    codUsuarioCargaDl: string;
    fehProcesoCargaDl?: Date | string;
    fehProcesoModifDl?: Date | string;
    desAccion: string;
    flgStatutActif?: number;
    brand: Prisma.MdBrandCreateNestedOneWithoutSubbrandsInput;
};
export type MdSubbrandUncheckedCreateInput = {
    idDlkSubbrand?: number;
    codSubbrand: string;
    idDlkBrand: number;
    codBrand: string;
    nameSubbrand: string;
    codUbigeoSubbrand: number;
    addressSubbrand: string;
    locationSubbrand?: string | null;
    emailSubbrand: string;
    cellularSubbrand: string;
    facebookSubbrand?: string | null;
    instagramSubbrand?: string | null;
    whatsappSubbrand?: string | null;
    ecommerceSubbrand?: string | null;
    logoSubbrand?: runtime.Bytes | null;
    stateSubbrand?: number;
    codUsuarioCargaDl: string;
    fehProcesoCargaDl?: Date | string;
    fehProcesoModifDl?: Date | string;
    desAccion: string;
    flgStatutActif?: number;
};
export type MdSubbrandUpdateInput = {
    codSubbrand?: Prisma.StringFieldUpdateOperationsInput | string;
    codBrand?: Prisma.StringFieldUpdateOperationsInput | string;
    nameSubbrand?: Prisma.StringFieldUpdateOperationsInput | string;
    codUbigeoSubbrand?: Prisma.IntFieldUpdateOperationsInput | number;
    addressSubbrand?: Prisma.StringFieldUpdateOperationsInput | string;
    locationSubbrand?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    emailSubbrand?: Prisma.StringFieldUpdateOperationsInput | string;
    cellularSubbrand?: Prisma.StringFieldUpdateOperationsInput | string;
    facebookSubbrand?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    instagramSubbrand?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    whatsappSubbrand?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    ecommerceSubbrand?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logoSubbrand?: Prisma.NullableBytesFieldUpdateOperationsInput | runtime.Bytes | null;
    stateSubbrand?: Prisma.IntFieldUpdateOperationsInput | number;
    codUsuarioCargaDl?: Prisma.StringFieldUpdateOperationsInput | string;
    fehProcesoCargaDl?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    fehProcesoModifDl?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    desAccion?: Prisma.StringFieldUpdateOperationsInput | string;
    flgStatutActif?: Prisma.IntFieldUpdateOperationsInput | number;
    brand?: Prisma.MdBrandUpdateOneRequiredWithoutSubbrandsNestedInput;
};
export type MdSubbrandUncheckedUpdateInput = {
    idDlkSubbrand?: Prisma.IntFieldUpdateOperationsInput | number;
    codSubbrand?: Prisma.StringFieldUpdateOperationsInput | string;
    idDlkBrand?: Prisma.IntFieldUpdateOperationsInput | number;
    codBrand?: Prisma.StringFieldUpdateOperationsInput | string;
    nameSubbrand?: Prisma.StringFieldUpdateOperationsInput | string;
    codUbigeoSubbrand?: Prisma.IntFieldUpdateOperationsInput | number;
    addressSubbrand?: Prisma.StringFieldUpdateOperationsInput | string;
    locationSubbrand?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    emailSubbrand?: Prisma.StringFieldUpdateOperationsInput | string;
    cellularSubbrand?: Prisma.StringFieldUpdateOperationsInput | string;
    facebookSubbrand?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    instagramSubbrand?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    whatsappSubbrand?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    ecommerceSubbrand?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logoSubbrand?: Prisma.NullableBytesFieldUpdateOperationsInput | runtime.Bytes | null;
    stateSubbrand?: Prisma.IntFieldUpdateOperationsInput | number;
    codUsuarioCargaDl?: Prisma.StringFieldUpdateOperationsInput | string;
    fehProcesoCargaDl?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    fehProcesoModifDl?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    desAccion?: Prisma.StringFieldUpdateOperationsInput | string;
    flgStatutActif?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type MdSubbrandCreateManyInput = {
    idDlkSubbrand?: number;
    codSubbrand: string;
    idDlkBrand: number;
    codBrand: string;
    nameSubbrand: string;
    codUbigeoSubbrand: number;
    addressSubbrand: string;
    locationSubbrand?: string | null;
    emailSubbrand: string;
    cellularSubbrand: string;
    facebookSubbrand?: string | null;
    instagramSubbrand?: string | null;
    whatsappSubbrand?: string | null;
    ecommerceSubbrand?: string | null;
    logoSubbrand?: runtime.Bytes | null;
    stateSubbrand?: number;
    codUsuarioCargaDl: string;
    fehProcesoCargaDl?: Date | string;
    fehProcesoModifDl?: Date | string;
    desAccion: string;
    flgStatutActif?: number;
};
export type MdSubbrandUpdateManyMutationInput = {
    codSubbrand?: Prisma.StringFieldUpdateOperationsInput | string;
    codBrand?: Prisma.StringFieldUpdateOperationsInput | string;
    nameSubbrand?: Prisma.StringFieldUpdateOperationsInput | string;
    codUbigeoSubbrand?: Prisma.IntFieldUpdateOperationsInput | number;
    addressSubbrand?: Prisma.StringFieldUpdateOperationsInput | string;
    locationSubbrand?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    emailSubbrand?: Prisma.StringFieldUpdateOperationsInput | string;
    cellularSubbrand?: Prisma.StringFieldUpdateOperationsInput | string;
    facebookSubbrand?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    instagramSubbrand?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    whatsappSubbrand?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    ecommerceSubbrand?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logoSubbrand?: Prisma.NullableBytesFieldUpdateOperationsInput | runtime.Bytes | null;
    stateSubbrand?: Prisma.IntFieldUpdateOperationsInput | number;
    codUsuarioCargaDl?: Prisma.StringFieldUpdateOperationsInput | string;
    fehProcesoCargaDl?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    fehProcesoModifDl?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    desAccion?: Prisma.StringFieldUpdateOperationsInput | string;
    flgStatutActif?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type MdSubbrandUncheckedUpdateManyInput = {
    idDlkSubbrand?: Prisma.IntFieldUpdateOperationsInput | number;
    codSubbrand?: Prisma.StringFieldUpdateOperationsInput | string;
    idDlkBrand?: Prisma.IntFieldUpdateOperationsInput | number;
    codBrand?: Prisma.StringFieldUpdateOperationsInput | string;
    nameSubbrand?: Prisma.StringFieldUpdateOperationsInput | string;
    codUbigeoSubbrand?: Prisma.IntFieldUpdateOperationsInput | number;
    addressSubbrand?: Prisma.StringFieldUpdateOperationsInput | string;
    locationSubbrand?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    emailSubbrand?: Prisma.StringFieldUpdateOperationsInput | string;
    cellularSubbrand?: Prisma.StringFieldUpdateOperationsInput | string;
    facebookSubbrand?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    instagramSubbrand?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    whatsappSubbrand?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    ecommerceSubbrand?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logoSubbrand?: Prisma.NullableBytesFieldUpdateOperationsInput | runtime.Bytes | null;
    stateSubbrand?: Prisma.IntFieldUpdateOperationsInput | number;
    codUsuarioCargaDl?: Prisma.StringFieldUpdateOperationsInput | string;
    fehProcesoCargaDl?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    fehProcesoModifDl?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    desAccion?: Prisma.StringFieldUpdateOperationsInput | string;
    flgStatutActif?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type MdSubbrandListRelationFilter = {
    every?: Prisma.MdSubbrandWhereInput;
    some?: Prisma.MdSubbrandWhereInput;
    none?: Prisma.MdSubbrandWhereInput;
};
export type MdSubbrandOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type MdSubbrandOrderByRelevanceInput = {
    fields: Prisma.MdSubbrandOrderByRelevanceFieldEnum | Prisma.MdSubbrandOrderByRelevanceFieldEnum[];
    sort: Prisma.SortOrder;
    search: string;
};
export type MdSubbrandCountOrderByAggregateInput = {
    idDlkSubbrand?: Prisma.SortOrder;
    codSubbrand?: Prisma.SortOrder;
    idDlkBrand?: Prisma.SortOrder;
    codBrand?: Prisma.SortOrder;
    nameSubbrand?: Prisma.SortOrder;
    codUbigeoSubbrand?: Prisma.SortOrder;
    addressSubbrand?: Prisma.SortOrder;
    locationSubbrand?: Prisma.SortOrder;
    emailSubbrand?: Prisma.SortOrder;
    cellularSubbrand?: Prisma.SortOrder;
    facebookSubbrand?: Prisma.SortOrder;
    instagramSubbrand?: Prisma.SortOrder;
    whatsappSubbrand?: Prisma.SortOrder;
    ecommerceSubbrand?: Prisma.SortOrder;
    logoSubbrand?: Prisma.SortOrder;
    stateSubbrand?: Prisma.SortOrder;
    codUsuarioCargaDl?: Prisma.SortOrder;
    fehProcesoCargaDl?: Prisma.SortOrder;
    fehProcesoModifDl?: Prisma.SortOrder;
    desAccion?: Prisma.SortOrder;
    flgStatutActif?: Prisma.SortOrder;
};
export type MdSubbrandAvgOrderByAggregateInput = {
    idDlkSubbrand?: Prisma.SortOrder;
    idDlkBrand?: Prisma.SortOrder;
    codUbigeoSubbrand?: Prisma.SortOrder;
    stateSubbrand?: Prisma.SortOrder;
    flgStatutActif?: Prisma.SortOrder;
};
export type MdSubbrandMaxOrderByAggregateInput = {
    idDlkSubbrand?: Prisma.SortOrder;
    codSubbrand?: Prisma.SortOrder;
    idDlkBrand?: Prisma.SortOrder;
    codBrand?: Prisma.SortOrder;
    nameSubbrand?: Prisma.SortOrder;
    codUbigeoSubbrand?: Prisma.SortOrder;
    addressSubbrand?: Prisma.SortOrder;
    locationSubbrand?: Prisma.SortOrder;
    emailSubbrand?: Prisma.SortOrder;
    cellularSubbrand?: Prisma.SortOrder;
    facebookSubbrand?: Prisma.SortOrder;
    instagramSubbrand?: Prisma.SortOrder;
    whatsappSubbrand?: Prisma.SortOrder;
    ecommerceSubbrand?: Prisma.SortOrder;
    logoSubbrand?: Prisma.SortOrder;
    stateSubbrand?: Prisma.SortOrder;
    codUsuarioCargaDl?: Prisma.SortOrder;
    fehProcesoCargaDl?: Prisma.SortOrder;
    fehProcesoModifDl?: Prisma.SortOrder;
    desAccion?: Prisma.SortOrder;
    flgStatutActif?: Prisma.SortOrder;
};
export type MdSubbrandMinOrderByAggregateInput = {
    idDlkSubbrand?: Prisma.SortOrder;
    codSubbrand?: Prisma.SortOrder;
    idDlkBrand?: Prisma.SortOrder;
    codBrand?: Prisma.SortOrder;
    nameSubbrand?: Prisma.SortOrder;
    codUbigeoSubbrand?: Prisma.SortOrder;
    addressSubbrand?: Prisma.SortOrder;
    locationSubbrand?: Prisma.SortOrder;
    emailSubbrand?: Prisma.SortOrder;
    cellularSubbrand?: Prisma.SortOrder;
    facebookSubbrand?: Prisma.SortOrder;
    instagramSubbrand?: Prisma.SortOrder;
    whatsappSubbrand?: Prisma.SortOrder;
    ecommerceSubbrand?: Prisma.SortOrder;
    logoSubbrand?: Prisma.SortOrder;
    stateSubbrand?: Prisma.SortOrder;
    codUsuarioCargaDl?: Prisma.SortOrder;
    fehProcesoCargaDl?: Prisma.SortOrder;
    fehProcesoModifDl?: Prisma.SortOrder;
    desAccion?: Prisma.SortOrder;
    flgStatutActif?: Prisma.SortOrder;
};
export type MdSubbrandSumOrderByAggregateInput = {
    idDlkSubbrand?: Prisma.SortOrder;
    idDlkBrand?: Prisma.SortOrder;
    codUbigeoSubbrand?: Prisma.SortOrder;
    stateSubbrand?: Prisma.SortOrder;
    flgStatutActif?: Prisma.SortOrder;
};
export type MdSubbrandCreateNestedManyWithoutBrandInput = {
    create?: Prisma.XOR<Prisma.MdSubbrandCreateWithoutBrandInput, Prisma.MdSubbrandUncheckedCreateWithoutBrandInput> | Prisma.MdSubbrandCreateWithoutBrandInput[] | Prisma.MdSubbrandUncheckedCreateWithoutBrandInput[];
    connectOrCreate?: Prisma.MdSubbrandCreateOrConnectWithoutBrandInput | Prisma.MdSubbrandCreateOrConnectWithoutBrandInput[];
    createMany?: Prisma.MdSubbrandCreateManyBrandInputEnvelope;
    connect?: Prisma.MdSubbrandWhereUniqueInput | Prisma.MdSubbrandWhereUniqueInput[];
};
export type MdSubbrandUncheckedCreateNestedManyWithoutBrandInput = {
    create?: Prisma.XOR<Prisma.MdSubbrandCreateWithoutBrandInput, Prisma.MdSubbrandUncheckedCreateWithoutBrandInput> | Prisma.MdSubbrandCreateWithoutBrandInput[] | Prisma.MdSubbrandUncheckedCreateWithoutBrandInput[];
    connectOrCreate?: Prisma.MdSubbrandCreateOrConnectWithoutBrandInput | Prisma.MdSubbrandCreateOrConnectWithoutBrandInput[];
    createMany?: Prisma.MdSubbrandCreateManyBrandInputEnvelope;
    connect?: Prisma.MdSubbrandWhereUniqueInput | Prisma.MdSubbrandWhereUniqueInput[];
};
export type MdSubbrandUpdateManyWithoutBrandNestedInput = {
    create?: Prisma.XOR<Prisma.MdSubbrandCreateWithoutBrandInput, Prisma.MdSubbrandUncheckedCreateWithoutBrandInput> | Prisma.MdSubbrandCreateWithoutBrandInput[] | Prisma.MdSubbrandUncheckedCreateWithoutBrandInput[];
    connectOrCreate?: Prisma.MdSubbrandCreateOrConnectWithoutBrandInput | Prisma.MdSubbrandCreateOrConnectWithoutBrandInput[];
    upsert?: Prisma.MdSubbrandUpsertWithWhereUniqueWithoutBrandInput | Prisma.MdSubbrandUpsertWithWhereUniqueWithoutBrandInput[];
    createMany?: Prisma.MdSubbrandCreateManyBrandInputEnvelope;
    set?: Prisma.MdSubbrandWhereUniqueInput | Prisma.MdSubbrandWhereUniqueInput[];
    disconnect?: Prisma.MdSubbrandWhereUniqueInput | Prisma.MdSubbrandWhereUniqueInput[];
    delete?: Prisma.MdSubbrandWhereUniqueInput | Prisma.MdSubbrandWhereUniqueInput[];
    connect?: Prisma.MdSubbrandWhereUniqueInput | Prisma.MdSubbrandWhereUniqueInput[];
    update?: Prisma.MdSubbrandUpdateWithWhereUniqueWithoutBrandInput | Prisma.MdSubbrandUpdateWithWhereUniqueWithoutBrandInput[];
    updateMany?: Prisma.MdSubbrandUpdateManyWithWhereWithoutBrandInput | Prisma.MdSubbrandUpdateManyWithWhereWithoutBrandInput[];
    deleteMany?: Prisma.MdSubbrandScalarWhereInput | Prisma.MdSubbrandScalarWhereInput[];
};
export type MdSubbrandUncheckedUpdateManyWithoutBrandNestedInput = {
    create?: Prisma.XOR<Prisma.MdSubbrandCreateWithoutBrandInput, Prisma.MdSubbrandUncheckedCreateWithoutBrandInput> | Prisma.MdSubbrandCreateWithoutBrandInput[] | Prisma.MdSubbrandUncheckedCreateWithoutBrandInput[];
    connectOrCreate?: Prisma.MdSubbrandCreateOrConnectWithoutBrandInput | Prisma.MdSubbrandCreateOrConnectWithoutBrandInput[];
    upsert?: Prisma.MdSubbrandUpsertWithWhereUniqueWithoutBrandInput | Prisma.MdSubbrandUpsertWithWhereUniqueWithoutBrandInput[];
    createMany?: Prisma.MdSubbrandCreateManyBrandInputEnvelope;
    set?: Prisma.MdSubbrandWhereUniqueInput | Prisma.MdSubbrandWhereUniqueInput[];
    disconnect?: Prisma.MdSubbrandWhereUniqueInput | Prisma.MdSubbrandWhereUniqueInput[];
    delete?: Prisma.MdSubbrandWhereUniqueInput | Prisma.MdSubbrandWhereUniqueInput[];
    connect?: Prisma.MdSubbrandWhereUniqueInput | Prisma.MdSubbrandWhereUniqueInput[];
    update?: Prisma.MdSubbrandUpdateWithWhereUniqueWithoutBrandInput | Prisma.MdSubbrandUpdateWithWhereUniqueWithoutBrandInput[];
    updateMany?: Prisma.MdSubbrandUpdateManyWithWhereWithoutBrandInput | Prisma.MdSubbrandUpdateManyWithWhereWithoutBrandInput[];
    deleteMany?: Prisma.MdSubbrandScalarWhereInput | Prisma.MdSubbrandScalarWhereInput[];
};
export type MdSubbrandCreateWithoutBrandInput = {
    codSubbrand: string;
    codBrand: string;
    nameSubbrand: string;
    codUbigeoSubbrand: number;
    addressSubbrand: string;
    locationSubbrand?: string | null;
    emailSubbrand: string;
    cellularSubbrand: string;
    facebookSubbrand?: string | null;
    instagramSubbrand?: string | null;
    whatsappSubbrand?: string | null;
    ecommerceSubbrand?: string | null;
    logoSubbrand?: runtime.Bytes | null;
    stateSubbrand?: number;
    codUsuarioCargaDl: string;
    fehProcesoCargaDl?: Date | string;
    fehProcesoModifDl?: Date | string;
    desAccion: string;
    flgStatutActif?: number;
};
export type MdSubbrandUncheckedCreateWithoutBrandInput = {
    idDlkSubbrand?: number;
    codSubbrand: string;
    codBrand: string;
    nameSubbrand: string;
    codUbigeoSubbrand: number;
    addressSubbrand: string;
    locationSubbrand?: string | null;
    emailSubbrand: string;
    cellularSubbrand: string;
    facebookSubbrand?: string | null;
    instagramSubbrand?: string | null;
    whatsappSubbrand?: string | null;
    ecommerceSubbrand?: string | null;
    logoSubbrand?: runtime.Bytes | null;
    stateSubbrand?: number;
    codUsuarioCargaDl: string;
    fehProcesoCargaDl?: Date | string;
    fehProcesoModifDl?: Date | string;
    desAccion: string;
    flgStatutActif?: number;
};
export type MdSubbrandCreateOrConnectWithoutBrandInput = {
    where: Prisma.MdSubbrandWhereUniqueInput;
    create: Prisma.XOR<Prisma.MdSubbrandCreateWithoutBrandInput, Prisma.MdSubbrandUncheckedCreateWithoutBrandInput>;
};
export type MdSubbrandCreateManyBrandInputEnvelope = {
    data: Prisma.MdSubbrandCreateManyBrandInput | Prisma.MdSubbrandCreateManyBrandInput[];
    skipDuplicates?: boolean;
};
export type MdSubbrandUpsertWithWhereUniqueWithoutBrandInput = {
    where: Prisma.MdSubbrandWhereUniqueInput;
    update: Prisma.XOR<Prisma.MdSubbrandUpdateWithoutBrandInput, Prisma.MdSubbrandUncheckedUpdateWithoutBrandInput>;
    create: Prisma.XOR<Prisma.MdSubbrandCreateWithoutBrandInput, Prisma.MdSubbrandUncheckedCreateWithoutBrandInput>;
};
export type MdSubbrandUpdateWithWhereUniqueWithoutBrandInput = {
    where: Prisma.MdSubbrandWhereUniqueInput;
    data: Prisma.XOR<Prisma.MdSubbrandUpdateWithoutBrandInput, Prisma.MdSubbrandUncheckedUpdateWithoutBrandInput>;
};
export type MdSubbrandUpdateManyWithWhereWithoutBrandInput = {
    where: Prisma.MdSubbrandScalarWhereInput;
    data: Prisma.XOR<Prisma.MdSubbrandUpdateManyMutationInput, Prisma.MdSubbrandUncheckedUpdateManyWithoutBrandInput>;
};
export type MdSubbrandScalarWhereInput = {
    AND?: Prisma.MdSubbrandScalarWhereInput | Prisma.MdSubbrandScalarWhereInput[];
    OR?: Prisma.MdSubbrandScalarWhereInput[];
    NOT?: Prisma.MdSubbrandScalarWhereInput | Prisma.MdSubbrandScalarWhereInput[];
    idDlkSubbrand?: Prisma.IntFilter<"MdSubbrand"> | number;
    codSubbrand?: Prisma.StringFilter<"MdSubbrand"> | string;
    idDlkBrand?: Prisma.IntFilter<"MdSubbrand"> | number;
    codBrand?: Prisma.StringFilter<"MdSubbrand"> | string;
    nameSubbrand?: Prisma.StringFilter<"MdSubbrand"> | string;
    codUbigeoSubbrand?: Prisma.IntFilter<"MdSubbrand"> | number;
    addressSubbrand?: Prisma.StringFilter<"MdSubbrand"> | string;
    locationSubbrand?: Prisma.StringNullableFilter<"MdSubbrand"> | string | null;
    emailSubbrand?: Prisma.StringFilter<"MdSubbrand"> | string;
    cellularSubbrand?: Prisma.StringFilter<"MdSubbrand"> | string;
    facebookSubbrand?: Prisma.StringNullableFilter<"MdSubbrand"> | string | null;
    instagramSubbrand?: Prisma.StringNullableFilter<"MdSubbrand"> | string | null;
    whatsappSubbrand?: Prisma.StringNullableFilter<"MdSubbrand"> | string | null;
    ecommerceSubbrand?: Prisma.StringNullableFilter<"MdSubbrand"> | string | null;
    logoSubbrand?: Prisma.BytesNullableFilter<"MdSubbrand"> | runtime.Bytes | null;
    stateSubbrand?: Prisma.IntFilter<"MdSubbrand"> | number;
    codUsuarioCargaDl?: Prisma.StringFilter<"MdSubbrand"> | string;
    fehProcesoCargaDl?: Prisma.DateTimeFilter<"MdSubbrand"> | Date | string;
    fehProcesoModifDl?: Prisma.DateTimeFilter<"MdSubbrand"> | Date | string;
    desAccion?: Prisma.StringFilter<"MdSubbrand"> | string;
    flgStatutActif?: Prisma.IntFilter<"MdSubbrand"> | number;
};
export type MdSubbrandCreateManyBrandInput = {
    idDlkSubbrand?: number;
    codSubbrand: string;
    codBrand: string;
    nameSubbrand: string;
    codUbigeoSubbrand: number;
    addressSubbrand: string;
    locationSubbrand?: string | null;
    emailSubbrand: string;
    cellularSubbrand: string;
    facebookSubbrand?: string | null;
    instagramSubbrand?: string | null;
    whatsappSubbrand?: string | null;
    ecommerceSubbrand?: string | null;
    logoSubbrand?: runtime.Bytes | null;
    stateSubbrand?: number;
    codUsuarioCargaDl: string;
    fehProcesoCargaDl?: Date | string;
    fehProcesoModifDl?: Date | string;
    desAccion: string;
    flgStatutActif?: number;
};
export type MdSubbrandUpdateWithoutBrandInput = {
    codSubbrand?: Prisma.StringFieldUpdateOperationsInput | string;
    codBrand?: Prisma.StringFieldUpdateOperationsInput | string;
    nameSubbrand?: Prisma.StringFieldUpdateOperationsInput | string;
    codUbigeoSubbrand?: Prisma.IntFieldUpdateOperationsInput | number;
    addressSubbrand?: Prisma.StringFieldUpdateOperationsInput | string;
    locationSubbrand?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    emailSubbrand?: Prisma.StringFieldUpdateOperationsInput | string;
    cellularSubbrand?: Prisma.StringFieldUpdateOperationsInput | string;
    facebookSubbrand?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    instagramSubbrand?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    whatsappSubbrand?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    ecommerceSubbrand?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logoSubbrand?: Prisma.NullableBytesFieldUpdateOperationsInput | runtime.Bytes | null;
    stateSubbrand?: Prisma.IntFieldUpdateOperationsInput | number;
    codUsuarioCargaDl?: Prisma.StringFieldUpdateOperationsInput | string;
    fehProcesoCargaDl?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    fehProcesoModifDl?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    desAccion?: Prisma.StringFieldUpdateOperationsInput | string;
    flgStatutActif?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type MdSubbrandUncheckedUpdateWithoutBrandInput = {
    idDlkSubbrand?: Prisma.IntFieldUpdateOperationsInput | number;
    codSubbrand?: Prisma.StringFieldUpdateOperationsInput | string;
    codBrand?: Prisma.StringFieldUpdateOperationsInput | string;
    nameSubbrand?: Prisma.StringFieldUpdateOperationsInput | string;
    codUbigeoSubbrand?: Prisma.IntFieldUpdateOperationsInput | number;
    addressSubbrand?: Prisma.StringFieldUpdateOperationsInput | string;
    locationSubbrand?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    emailSubbrand?: Prisma.StringFieldUpdateOperationsInput | string;
    cellularSubbrand?: Prisma.StringFieldUpdateOperationsInput | string;
    facebookSubbrand?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    instagramSubbrand?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    whatsappSubbrand?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    ecommerceSubbrand?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logoSubbrand?: Prisma.NullableBytesFieldUpdateOperationsInput | runtime.Bytes | null;
    stateSubbrand?: Prisma.IntFieldUpdateOperationsInput | number;
    codUsuarioCargaDl?: Prisma.StringFieldUpdateOperationsInput | string;
    fehProcesoCargaDl?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    fehProcesoModifDl?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    desAccion?: Prisma.StringFieldUpdateOperationsInput | string;
    flgStatutActif?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type MdSubbrandUncheckedUpdateManyWithoutBrandInput = {
    idDlkSubbrand?: Prisma.IntFieldUpdateOperationsInput | number;
    codSubbrand?: Prisma.StringFieldUpdateOperationsInput | string;
    codBrand?: Prisma.StringFieldUpdateOperationsInput | string;
    nameSubbrand?: Prisma.StringFieldUpdateOperationsInput | string;
    codUbigeoSubbrand?: Prisma.IntFieldUpdateOperationsInput | number;
    addressSubbrand?: Prisma.StringFieldUpdateOperationsInput | string;
    locationSubbrand?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    emailSubbrand?: Prisma.StringFieldUpdateOperationsInput | string;
    cellularSubbrand?: Prisma.StringFieldUpdateOperationsInput | string;
    facebookSubbrand?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    instagramSubbrand?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    whatsappSubbrand?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    ecommerceSubbrand?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logoSubbrand?: Prisma.NullableBytesFieldUpdateOperationsInput | runtime.Bytes | null;
    stateSubbrand?: Prisma.IntFieldUpdateOperationsInput | number;
    codUsuarioCargaDl?: Prisma.StringFieldUpdateOperationsInput | string;
    fehProcesoCargaDl?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    fehProcesoModifDl?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    desAccion?: Prisma.StringFieldUpdateOperationsInput | string;
    flgStatutActif?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type MdSubbrandSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    idDlkSubbrand?: boolean;
    codSubbrand?: boolean;
    idDlkBrand?: boolean;
    codBrand?: boolean;
    nameSubbrand?: boolean;
    codUbigeoSubbrand?: boolean;
    addressSubbrand?: boolean;
    locationSubbrand?: boolean;
    emailSubbrand?: boolean;
    cellularSubbrand?: boolean;
    facebookSubbrand?: boolean;
    instagramSubbrand?: boolean;
    whatsappSubbrand?: boolean;
    ecommerceSubbrand?: boolean;
    logoSubbrand?: boolean;
    stateSubbrand?: boolean;
    codUsuarioCargaDl?: boolean;
    fehProcesoCargaDl?: boolean;
    fehProcesoModifDl?: boolean;
    desAccion?: boolean;
    flgStatutActif?: boolean;
    brand?: boolean | Prisma.MdBrandDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["mdSubbrand"]>;
export type MdSubbrandSelectScalar = {
    idDlkSubbrand?: boolean;
    codSubbrand?: boolean;
    idDlkBrand?: boolean;
    codBrand?: boolean;
    nameSubbrand?: boolean;
    codUbigeoSubbrand?: boolean;
    addressSubbrand?: boolean;
    locationSubbrand?: boolean;
    emailSubbrand?: boolean;
    cellularSubbrand?: boolean;
    facebookSubbrand?: boolean;
    instagramSubbrand?: boolean;
    whatsappSubbrand?: boolean;
    ecommerceSubbrand?: boolean;
    logoSubbrand?: boolean;
    stateSubbrand?: boolean;
    codUsuarioCargaDl?: boolean;
    fehProcesoCargaDl?: boolean;
    fehProcesoModifDl?: boolean;
    desAccion?: boolean;
    flgStatutActif?: boolean;
};
export type MdSubbrandOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"idDlkSubbrand" | "codSubbrand" | "idDlkBrand" | "codBrand" | "nameSubbrand" | "codUbigeoSubbrand" | "addressSubbrand" | "locationSubbrand" | "emailSubbrand" | "cellularSubbrand" | "facebookSubbrand" | "instagramSubbrand" | "whatsappSubbrand" | "ecommerceSubbrand" | "logoSubbrand" | "stateSubbrand" | "codUsuarioCargaDl" | "fehProcesoCargaDl" | "fehProcesoModifDl" | "desAccion" | "flgStatutActif", ExtArgs["result"]["mdSubbrand"]>;
export type MdSubbrandInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    brand?: boolean | Prisma.MdBrandDefaultArgs<ExtArgs>;
};
export type $MdSubbrandPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "MdSubbrand";
    objects: {
        brand: Prisma.$MdBrandPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        idDlkSubbrand: number;
        codSubbrand: string;
        idDlkBrand: number;
        codBrand: string;
        nameSubbrand: string;
        codUbigeoSubbrand: number;
        addressSubbrand: string;
        locationSubbrand: string | null;
        emailSubbrand: string;
        cellularSubbrand: string;
        facebookSubbrand: string | null;
        instagramSubbrand: string | null;
        whatsappSubbrand: string | null;
        ecommerceSubbrand: string | null;
        logoSubbrand: runtime.Bytes | null;
        stateSubbrand: number;
        codUsuarioCargaDl: string;
        fehProcesoCargaDl: Date;
        fehProcesoModifDl: Date;
        desAccion: string;
        flgStatutActif: number;
    }, ExtArgs["result"]["mdSubbrand"]>;
    composites: {};
};
export type MdSubbrandGetPayload<S extends boolean | null | undefined | MdSubbrandDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$MdSubbrandPayload, S>;
export type MdSubbrandCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<MdSubbrandFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: MdSubbrandCountAggregateInputType | true;
};
export interface MdSubbrandDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['MdSubbrand'];
        meta: {
            name: 'MdSubbrand';
        };
    };
    /**
     * Find zero or one MdSubbrand that matches the filter.
     * @param {MdSubbrandFindUniqueArgs} args - Arguments to find a MdSubbrand
     * @example
     * // Get one MdSubbrand
     * const mdSubbrand = await prisma.mdSubbrand.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MdSubbrandFindUniqueArgs>(args: Prisma.SelectSubset<T, MdSubbrandFindUniqueArgs<ExtArgs>>): Prisma.Prisma__MdSubbrandClient<runtime.Types.Result.GetResult<Prisma.$MdSubbrandPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one MdSubbrand that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MdSubbrandFindUniqueOrThrowArgs} args - Arguments to find a MdSubbrand
     * @example
     * // Get one MdSubbrand
     * const mdSubbrand = await prisma.mdSubbrand.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MdSubbrandFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, MdSubbrandFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__MdSubbrandClient<runtime.Types.Result.GetResult<Prisma.$MdSubbrandPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first MdSubbrand that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MdSubbrandFindFirstArgs} args - Arguments to find a MdSubbrand
     * @example
     * // Get one MdSubbrand
     * const mdSubbrand = await prisma.mdSubbrand.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MdSubbrandFindFirstArgs>(args?: Prisma.SelectSubset<T, MdSubbrandFindFirstArgs<ExtArgs>>): Prisma.Prisma__MdSubbrandClient<runtime.Types.Result.GetResult<Prisma.$MdSubbrandPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first MdSubbrand that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MdSubbrandFindFirstOrThrowArgs} args - Arguments to find a MdSubbrand
     * @example
     * // Get one MdSubbrand
     * const mdSubbrand = await prisma.mdSubbrand.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MdSubbrandFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, MdSubbrandFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__MdSubbrandClient<runtime.Types.Result.GetResult<Prisma.$MdSubbrandPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more MdSubbrands that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MdSubbrandFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MdSubbrands
     * const mdSubbrands = await prisma.mdSubbrand.findMany()
     *
     * // Get first 10 MdSubbrands
     * const mdSubbrands = await prisma.mdSubbrand.findMany({ take: 10 })
     *
     * // Only select the `idDlkSubbrand`
     * const mdSubbrandWithIdDlkSubbrandOnly = await prisma.mdSubbrand.findMany({ select: { idDlkSubbrand: true } })
     *
     */
    findMany<T extends MdSubbrandFindManyArgs>(args?: Prisma.SelectSubset<T, MdSubbrandFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MdSubbrandPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a MdSubbrand.
     * @param {MdSubbrandCreateArgs} args - Arguments to create a MdSubbrand.
     * @example
     * // Create one MdSubbrand
     * const MdSubbrand = await prisma.mdSubbrand.create({
     *   data: {
     *     // ... data to create a MdSubbrand
     *   }
     * })
     *
     */
    create<T extends MdSubbrandCreateArgs>(args: Prisma.SelectSubset<T, MdSubbrandCreateArgs<ExtArgs>>): Prisma.Prisma__MdSubbrandClient<runtime.Types.Result.GetResult<Prisma.$MdSubbrandPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many MdSubbrands.
     * @param {MdSubbrandCreateManyArgs} args - Arguments to create many MdSubbrands.
     * @example
     * // Create many MdSubbrands
     * const mdSubbrand = await prisma.mdSubbrand.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends MdSubbrandCreateManyArgs>(args?: Prisma.SelectSubset<T, MdSubbrandCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Delete a MdSubbrand.
     * @param {MdSubbrandDeleteArgs} args - Arguments to delete one MdSubbrand.
     * @example
     * // Delete one MdSubbrand
     * const MdSubbrand = await prisma.mdSubbrand.delete({
     *   where: {
     *     // ... filter to delete one MdSubbrand
     *   }
     * })
     *
     */
    delete<T extends MdSubbrandDeleteArgs>(args: Prisma.SelectSubset<T, MdSubbrandDeleteArgs<ExtArgs>>): Prisma.Prisma__MdSubbrandClient<runtime.Types.Result.GetResult<Prisma.$MdSubbrandPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one MdSubbrand.
     * @param {MdSubbrandUpdateArgs} args - Arguments to update one MdSubbrand.
     * @example
     * // Update one MdSubbrand
     * const mdSubbrand = await prisma.mdSubbrand.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends MdSubbrandUpdateArgs>(args: Prisma.SelectSubset<T, MdSubbrandUpdateArgs<ExtArgs>>): Prisma.Prisma__MdSubbrandClient<runtime.Types.Result.GetResult<Prisma.$MdSubbrandPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more MdSubbrands.
     * @param {MdSubbrandDeleteManyArgs} args - Arguments to filter MdSubbrands to delete.
     * @example
     * // Delete a few MdSubbrands
     * const { count } = await prisma.mdSubbrand.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends MdSubbrandDeleteManyArgs>(args?: Prisma.SelectSubset<T, MdSubbrandDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more MdSubbrands.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MdSubbrandUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MdSubbrands
     * const mdSubbrand = await prisma.mdSubbrand.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends MdSubbrandUpdateManyArgs>(args: Prisma.SelectSubset<T, MdSubbrandUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create or update one MdSubbrand.
     * @param {MdSubbrandUpsertArgs} args - Arguments to update or create a MdSubbrand.
     * @example
     * // Update or create a MdSubbrand
     * const mdSubbrand = await prisma.mdSubbrand.upsert({
     *   create: {
     *     // ... data to create a MdSubbrand
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MdSubbrand we want to update
     *   }
     * })
     */
    upsert<T extends MdSubbrandUpsertArgs>(args: Prisma.SelectSubset<T, MdSubbrandUpsertArgs<ExtArgs>>): Prisma.Prisma__MdSubbrandClient<runtime.Types.Result.GetResult<Prisma.$MdSubbrandPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of MdSubbrands.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MdSubbrandCountArgs} args - Arguments to filter MdSubbrands to count.
     * @example
     * // Count the number of MdSubbrands
     * const count = await prisma.mdSubbrand.count({
     *   where: {
     *     // ... the filter for the MdSubbrands we want to count
     *   }
     * })
    **/
    count<T extends MdSubbrandCountArgs>(args?: Prisma.Subset<T, MdSubbrandCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], MdSubbrandCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a MdSubbrand.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MdSubbrandAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends MdSubbrandAggregateArgs>(args: Prisma.Subset<T, MdSubbrandAggregateArgs>): Prisma.PrismaPromise<GetMdSubbrandAggregateType<T>>;
    /**
     * Group by MdSubbrand.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MdSubbrandGroupByArgs} args - Group by arguments.
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
    groupBy<T extends MdSubbrandGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: MdSubbrandGroupByArgs['orderBy'];
    } : {
        orderBy?: MdSubbrandGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, MdSubbrandGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMdSubbrandGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the MdSubbrand model
     */
    readonly fields: MdSubbrandFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for MdSubbrand.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__MdSubbrandClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    brand<T extends Prisma.MdBrandDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.MdBrandDefaultArgs<ExtArgs>>): Prisma.Prisma__MdBrandClient<runtime.Types.Result.GetResult<Prisma.$MdBrandPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
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
 * Fields of the MdSubbrand model
 */
export interface MdSubbrandFieldRefs {
    readonly idDlkSubbrand: Prisma.FieldRef<"MdSubbrand", 'Int'>;
    readonly codSubbrand: Prisma.FieldRef<"MdSubbrand", 'String'>;
    readonly idDlkBrand: Prisma.FieldRef<"MdSubbrand", 'Int'>;
    readonly codBrand: Prisma.FieldRef<"MdSubbrand", 'String'>;
    readonly nameSubbrand: Prisma.FieldRef<"MdSubbrand", 'String'>;
    readonly codUbigeoSubbrand: Prisma.FieldRef<"MdSubbrand", 'Int'>;
    readonly addressSubbrand: Prisma.FieldRef<"MdSubbrand", 'String'>;
    readonly locationSubbrand: Prisma.FieldRef<"MdSubbrand", 'String'>;
    readonly emailSubbrand: Prisma.FieldRef<"MdSubbrand", 'String'>;
    readonly cellularSubbrand: Prisma.FieldRef<"MdSubbrand", 'String'>;
    readonly facebookSubbrand: Prisma.FieldRef<"MdSubbrand", 'String'>;
    readonly instagramSubbrand: Prisma.FieldRef<"MdSubbrand", 'String'>;
    readonly whatsappSubbrand: Prisma.FieldRef<"MdSubbrand", 'String'>;
    readonly ecommerceSubbrand: Prisma.FieldRef<"MdSubbrand", 'String'>;
    readonly logoSubbrand: Prisma.FieldRef<"MdSubbrand", 'Bytes'>;
    readonly stateSubbrand: Prisma.FieldRef<"MdSubbrand", 'Int'>;
    readonly codUsuarioCargaDl: Prisma.FieldRef<"MdSubbrand", 'String'>;
    readonly fehProcesoCargaDl: Prisma.FieldRef<"MdSubbrand", 'DateTime'>;
    readonly fehProcesoModifDl: Prisma.FieldRef<"MdSubbrand", 'DateTime'>;
    readonly desAccion: Prisma.FieldRef<"MdSubbrand", 'String'>;
    readonly flgStatutActif: Prisma.FieldRef<"MdSubbrand", 'Int'>;
}
/**
 * MdSubbrand findUnique
 */
export type MdSubbrandFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MdSubbrand
     */
    select?: Prisma.MdSubbrandSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the MdSubbrand
     */
    omit?: Prisma.MdSubbrandOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MdSubbrandInclude<ExtArgs> | null;
    /**
     * Filter, which MdSubbrand to fetch.
     */
    where: Prisma.MdSubbrandWhereUniqueInput;
};
/**
 * MdSubbrand findUniqueOrThrow
 */
export type MdSubbrandFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MdSubbrand
     */
    select?: Prisma.MdSubbrandSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the MdSubbrand
     */
    omit?: Prisma.MdSubbrandOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MdSubbrandInclude<ExtArgs> | null;
    /**
     * Filter, which MdSubbrand to fetch.
     */
    where: Prisma.MdSubbrandWhereUniqueInput;
};
/**
 * MdSubbrand findFirst
 */
export type MdSubbrandFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MdSubbrand
     */
    select?: Prisma.MdSubbrandSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the MdSubbrand
     */
    omit?: Prisma.MdSubbrandOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MdSubbrandInclude<ExtArgs> | null;
    /**
     * Filter, which MdSubbrand to fetch.
     */
    where?: Prisma.MdSubbrandWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of MdSubbrands to fetch.
     */
    orderBy?: Prisma.MdSubbrandOrderByWithRelationInput | Prisma.MdSubbrandOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for MdSubbrands.
     */
    cursor?: Prisma.MdSubbrandWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` MdSubbrands from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` MdSubbrands.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of MdSubbrands.
     */
    distinct?: Prisma.MdSubbrandScalarFieldEnum | Prisma.MdSubbrandScalarFieldEnum[];
};
/**
 * MdSubbrand findFirstOrThrow
 */
export type MdSubbrandFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MdSubbrand
     */
    select?: Prisma.MdSubbrandSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the MdSubbrand
     */
    omit?: Prisma.MdSubbrandOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MdSubbrandInclude<ExtArgs> | null;
    /**
     * Filter, which MdSubbrand to fetch.
     */
    where?: Prisma.MdSubbrandWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of MdSubbrands to fetch.
     */
    orderBy?: Prisma.MdSubbrandOrderByWithRelationInput | Prisma.MdSubbrandOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for MdSubbrands.
     */
    cursor?: Prisma.MdSubbrandWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` MdSubbrands from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` MdSubbrands.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of MdSubbrands.
     */
    distinct?: Prisma.MdSubbrandScalarFieldEnum | Prisma.MdSubbrandScalarFieldEnum[];
};
/**
 * MdSubbrand findMany
 */
export type MdSubbrandFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MdSubbrand
     */
    select?: Prisma.MdSubbrandSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the MdSubbrand
     */
    omit?: Prisma.MdSubbrandOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MdSubbrandInclude<ExtArgs> | null;
    /**
     * Filter, which MdSubbrands to fetch.
     */
    where?: Prisma.MdSubbrandWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of MdSubbrands to fetch.
     */
    orderBy?: Prisma.MdSubbrandOrderByWithRelationInput | Prisma.MdSubbrandOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing MdSubbrands.
     */
    cursor?: Prisma.MdSubbrandWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` MdSubbrands from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` MdSubbrands.
     */
    skip?: number;
    distinct?: Prisma.MdSubbrandScalarFieldEnum | Prisma.MdSubbrandScalarFieldEnum[];
};
/**
 * MdSubbrand create
 */
export type MdSubbrandCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MdSubbrand
     */
    select?: Prisma.MdSubbrandSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the MdSubbrand
     */
    omit?: Prisma.MdSubbrandOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MdSubbrandInclude<ExtArgs> | null;
    /**
     * The data needed to create a MdSubbrand.
     */
    data: Prisma.XOR<Prisma.MdSubbrandCreateInput, Prisma.MdSubbrandUncheckedCreateInput>;
};
/**
 * MdSubbrand createMany
 */
export type MdSubbrandCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many MdSubbrands.
     */
    data: Prisma.MdSubbrandCreateManyInput | Prisma.MdSubbrandCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * MdSubbrand update
 */
export type MdSubbrandUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MdSubbrand
     */
    select?: Prisma.MdSubbrandSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the MdSubbrand
     */
    omit?: Prisma.MdSubbrandOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MdSubbrandInclude<ExtArgs> | null;
    /**
     * The data needed to update a MdSubbrand.
     */
    data: Prisma.XOR<Prisma.MdSubbrandUpdateInput, Prisma.MdSubbrandUncheckedUpdateInput>;
    /**
     * Choose, which MdSubbrand to update.
     */
    where: Prisma.MdSubbrandWhereUniqueInput;
};
/**
 * MdSubbrand updateMany
 */
export type MdSubbrandUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update MdSubbrands.
     */
    data: Prisma.XOR<Prisma.MdSubbrandUpdateManyMutationInput, Prisma.MdSubbrandUncheckedUpdateManyInput>;
    /**
     * Filter which MdSubbrands to update
     */
    where?: Prisma.MdSubbrandWhereInput;
    /**
     * Limit how many MdSubbrands to update.
     */
    limit?: number;
};
/**
 * MdSubbrand upsert
 */
export type MdSubbrandUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MdSubbrand
     */
    select?: Prisma.MdSubbrandSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the MdSubbrand
     */
    omit?: Prisma.MdSubbrandOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MdSubbrandInclude<ExtArgs> | null;
    /**
     * The filter to search for the MdSubbrand to update in case it exists.
     */
    where: Prisma.MdSubbrandWhereUniqueInput;
    /**
     * In case the MdSubbrand found by the `where` argument doesn't exist, create a new MdSubbrand with this data.
     */
    create: Prisma.XOR<Prisma.MdSubbrandCreateInput, Prisma.MdSubbrandUncheckedCreateInput>;
    /**
     * In case the MdSubbrand was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.MdSubbrandUpdateInput, Prisma.MdSubbrandUncheckedUpdateInput>;
};
/**
 * MdSubbrand delete
 */
export type MdSubbrandDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MdSubbrand
     */
    select?: Prisma.MdSubbrandSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the MdSubbrand
     */
    omit?: Prisma.MdSubbrandOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MdSubbrandInclude<ExtArgs> | null;
    /**
     * Filter which MdSubbrand to delete.
     */
    where: Prisma.MdSubbrandWhereUniqueInput;
};
/**
 * MdSubbrand deleteMany
 */
export type MdSubbrandDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which MdSubbrands to delete
     */
    where?: Prisma.MdSubbrandWhereInput;
    /**
     * Limit how many MdSubbrands to delete.
     */
    limit?: number;
};
/**
 * MdSubbrand without action
 */
export type MdSubbrandDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MdSubbrand
     */
    select?: Prisma.MdSubbrandSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the MdSubbrand
     */
    omit?: Prisma.MdSubbrandOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MdSubbrandInclude<ExtArgs> | null;
};
export {};
