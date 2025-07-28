export enum TypeHint {
  ORGANIC = "organic",
  COLD_SALE = "cold_sale",
  IMPORTED = "imported",
  CURRENTLY_ADDED = "Currently added",
}

export const typeHintLabels: Record<TypeHint, string> = {
  [TypeHint.ORGANIC]: "عضوي",
  [TypeHint.COLD_SALE]: "تخفيضات باردة",
  [TypeHint.IMPORTED]: "مُستورد",
  [TypeHint.CURRENTLY_ADDED]: "مضافة حاليا",
};
