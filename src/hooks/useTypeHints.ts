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

const typeHintGradients: Record<
  TypeHint,
  { from: string; to: string; textColor: string }
> = {
  [TypeHint.COLD_SALE]: {
    from: "#A5EFFF", // pastel blue
    to: "#E7F8FD", // very light blue
    textColor: "#0891B2", // rich cyan accent
  },
  [TypeHint.IMPORTED]: {
    from: "#FFB3B3", // pastel red
    to: "#FFE5E5", // very light pink
    textColor: "#B91C1C", // deep red accent
  },
  [TypeHint.HOT_DEAL]: {
    from: "#FFE86B", // pastel yellow
    to: "#FFF7DA", // very light cream
    textColor: "#D97706", // amber accent
  },
  [TypeHint.LOCAL]: {
    from: "#A7F3D0", // pastel mint green
    to: "#E7FDF5", // light mint
    textColor: "#047857", // dark emerald accent
  },
  [TypeHint.STATIC]: {
    from: "#D1D5DB",
    to: "#F3F4F6", // very light gray
    textColor: "#374151", // charcoal accent
  },
  [TypeHint.BEST_SELLERS]: {
    from: "#FDE18A", // pastel amber
    to: "#FFFCEA", // very light amber
    textColor: "#B49309", // deep amber accent
  },
  [TypeHint.MOST_VIEWED]: {
    from: "#D8B4FE", // pastel purple
    to: "#F5F3FF", // very light lavender
    textColor: "#6D28D9", // deep violet accent
  },
  [TypeHint.EDITOR_PICK]: {
    from: "#F9A8D4", // pastel pink
    to: "#FFF0F8", // light blush
    textColor: "#BE185D", // rose accent
  },
  [TypeHint.NEW_ARRIVAL]: {
    from: "#A5F3FC", // pastel cyan
    to: "#ECFEFF", // very light cyan
    textColor: "#0E7490", // teal accent
  },
  [TypeHint.TRENDING]: {
    from: "#FDBA74", // pastel orange
    to: "#FFF4E6", // light peach
    textColor: "#C2410C", // burnt orange accent
  },
  [TypeHint.FEATURED_AUTHOR]: {
    from: "#99F6E4", // pastel teal
    to: "#E0FCF6", // light aqua
    textColor: "#155E75", // deep teal accent
  },
  [TypeHint.RECOMMENDED_FOR_YOU]: {
    from: "#6EE7B7", // pastel green
    to: "#E9FFF7", // very light mint
    textColor: "#065F46", // dark green accent
  },
  [TypeHint.LIMITED_EDITION]: {
    from: "#C4B5FD", // pastel violet
    to: "#F5F3FF", // light lavender
    textColor: "#5B21B6", // deep violet accent
  },
};

export const useTypeHints = () => {
  const getLabel = (typeHint: TypeHint, isArabic: boolean): string =>
    isArabic ? typeHintLabelsAr[typeHint] : typeHintLabelsEn[typeHint];

  const getIcon = (typeHint: TypeHint) => {
    return typeHintIcons[typeHint];
  };

  const getGradientStyle = (typeHint: TypeHint) => {
    const colors = typeHintGradients[typeHint];

    if (!colors) return {};

    return {
      background: `linear-gradient(to right, ${colors.from}, ${colors.to})`,
      color: colors.textColor,
      width: "auto",
    };
  };

  const getAllTypeHints = (): TypeHint[] => Object.values(TypeHint);

  return {
    typeHintLabelsAr,
    typeHintLabelsEn,
    typeHintIcons,
    getLabel,
    getIcon,
    getAllTypeHints,
    getGradientStyle,
  };
};
