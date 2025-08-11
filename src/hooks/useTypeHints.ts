import { RefAttributes, ForwardRefExoticComponent } from "react";
import {
  Snowflake,
  Flame,
  Package,
  Home,
  Lock,
  TrendingUp,
  Eye,
  Star,
  PlusCircle,
  Users,
  BookOpen,
  Gift,
  LucideProps,
} from "lucide-react";

import { TypeHint } from "@/enums/typeHint.enum";

const typeHintLabelsAr: Record<TypeHint, string> = {
  [TypeHint.COLD_SALE]: "تخفيضات باردة",
  [TypeHint.HOT_DEAL]: "صفقة ساخنة",
  [TypeHint.IMPORTED]: "مُستورد",
  [TypeHint.LOCAL]: "محلي",
  [TypeHint.STATIC]: "ثابت",
  [TypeHint.BEST_SELLERS]: "الأكثر مبيعاً",
  [TypeHint.MOST_VIEWED]: "الأكثر مشاهدة",
  [TypeHint.EDITOR_PICK]: "اختيار المحرر",
  [TypeHint.NEW_ARRIVAL]: "وصل حديثاً",
  [TypeHint.TRENDING]: "رائج",
  [TypeHint.FEATURED_AUTHOR]: "كاتب مميز",
  [TypeHint.RECOMMENDED_FOR_YOU]: "موصى به لك",
  [TypeHint.LIMITED_EDITION]: "إصدار محدود",
};

const typeHintLabelsEn: Record<TypeHint, string> = {
  [TypeHint.COLD_SALE]: "Cold Sale",
  [TypeHint.HOT_DEAL]: "Hot Deal",
  [TypeHint.IMPORTED]: "Imported",
  [TypeHint.LOCAL]: "Local",
  [TypeHint.STATIC]: "Static",
  [TypeHint.BEST_SELLERS]: "Best Sellers",
  [TypeHint.MOST_VIEWED]: "Most Viewed",
  [TypeHint.EDITOR_PICK]: "Editor's Pick",
  [TypeHint.NEW_ARRIVAL]: "New Arrival",
  [TypeHint.TRENDING]: "Trending",
  [TypeHint.FEATURED_AUTHOR]: "Featured Author",
  [TypeHint.RECOMMENDED_FOR_YOU]: "Recommended for You",
  [TypeHint.LIMITED_EDITION]: "Limited Edition",
};

const typeHintIcons: Record<
  TypeHint,
  ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >
> = {
  [TypeHint.COLD_SALE]: Snowflake,
  [TypeHint.HOT_DEAL]: Flame,
  [TypeHint.IMPORTED]: Package,
  [TypeHint.LOCAL]: Home,
  [TypeHint.STATIC]: Lock,
  [TypeHint.BEST_SELLERS]: TrendingUp,
  [TypeHint.MOST_VIEWED]: Eye,
  [TypeHint.EDITOR_PICK]: Star,
  [TypeHint.NEW_ARRIVAL]: PlusCircle,
  [TypeHint.TRENDING]: TrendingUp,
  [TypeHint.FEATURED_AUTHOR]: Users,
  [TypeHint.RECOMMENDED_FOR_YOU]: BookOpen,
  [TypeHint.LIMITED_EDITION]: Gift,
};

export const useTypeHints = () => {
  const getLabel = (typeHint: TypeHint, lang: "ar" | "en" = "ar"): string =>
    lang === "ar" ? typeHintLabelsAr[typeHint] : typeHintLabelsEn[typeHint];

  const getIcon = (typeHint: TypeHint) => {
    return typeHintIcons[typeHint];
  };

  const getAllTypeHints = (): TypeHint[] => Object.values(TypeHint);

  return {
    typeHintLabelsAr,
    typeHintLabelsEn,
    typeHintIcons,
    getLabel,
    getIcon,
    getAllTypeHints,
  };
};
