import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface QuickActionCardProps {
  href?: string;
  icon: LucideIcon;
  title: string;
  description: string;
  ctaLabel: string;
  ctaIcon?: ReactNode;
  accentColor: "purple" | "pink" | "blue";
  trailing?: ReactNode; // e.g. a "Live" badge instead of an arrow
}

const ACCENT_STYLES = {
  purple: {
    iconBg: "bg-purple-50 text-purple-600",
    iconHoverBg: "group-hover:bg-purple-600 group-hover:text-white",
    border: "hover:border-primary-300",
    cta: "text-primary-600 group-hover:text-primary-700",
  },
  pink: {
    iconBg: "bg-pink-50 text-pink-600",
    iconHoverBg: "group-hover:bg-pink-600 group-hover:text-white",
    border: "hover:border-pink-300",
    cta: "text-pink-600 group-hover:text-pink-700",
  },
  blue: {
    iconBg: "bg-blue-50 text-blue-600",
    iconHoverBg: "group-hover:bg-blue-600 group-hover:text-white",
    border: "hover:border-blue-300",
    cta: "text-blue-600",
  },
};

const QuickActionCard = ({
  href,
  icon: Icon,
  title,
  description,
  ctaLabel,
  ctaIcon,
  accentColor,
  trailing,
}: QuickActionCardProps) => {
  const accent = ACCENT_STYLES[accentColor];

  const content = (
    <>
      <div>
        <div
          className={`w-8 h-8 rounded-lg ${accent.iconBg} flex items-center justify-center mb-2 group-hover:scale-105 ${accent.iconHoverBg} transition-all`}
        >
          <Icon className="w-4 h-4" />
        </div>
        <h3 className="text-sm font-semibold text-gray-900 mb-0.5">{title}</h3>
        <p className="text-xs text-gray-500 leading-snug line-clamp-2">
          {description}
        </p>
      </div>
      <div
        className={`mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between text-xs font-semibold ${accent.cta}`}
      >
        <span>{ctaLabel}</span>
        {trailing ?? ctaIcon}
      </div>
    </>
  );

  const className = `group relative flex flex-col justify-between p-3.5 sm:p-4 rounded-xl bg-white border border-gray-200/90 shadow-2xs hover:shadow-md ${accent.border} transition-all`;

  if (!href) {
    return <div className={className}>{content}</div>;
  }

  return (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
};

export default QuickActionCard;
