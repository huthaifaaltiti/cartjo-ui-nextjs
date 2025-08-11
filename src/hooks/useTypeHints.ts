import { TypeHint } from "@/enums/typeHint.enum";

export const useTypeHints = () => {
  const typeHintLabelsAr: Partial<Record<TypeHint, string>> = {
    [TypeHint.COLD_SALE]: "تخفيضات باردة",
    [TypeHint.IMPORTED]: "مُستورد",
    [TypeHint.STATIC]: "مضاف حالياً",
    [TypeHint.BEST_SELLERS]: "مضاف حالياً",
    [TypeHint.MOST_VIEWED]: "مضاف حالياً",
    [TypeHint.EDITOR_PICK]: "مضاف حالياً",
  };

  const typeHintLabelsEn: Partial<Record<TypeHint, string>> = {
    [TypeHint.COLD_SALE]: "Cold Sale",
    [TypeHint.IMPORTED]: "Imported",
    [TypeHint.STATIC]: "Static",
    [TypeHint.BEST_SELLERS]: "Best Sellers",
    [TypeHint.MOST_VIEWED]: "Most Viewed",
    [TypeHint.EDITOR_PICK]:  حالياً",
  };

  console.log(typeHintLabelsAr["cold_sale"]);

  //   return {
  //     ...TypeHint,
  //   };
};
