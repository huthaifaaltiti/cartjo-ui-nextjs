"use client";

import React, { memo } from "react";
import Link from "next/link";
import {
  FaFacebook,
  FaGlobe,
  FaInstagram,
  FaSnapchat,
  FaTelegram,
  FaTiktok,
  FaWhatsapp,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";
import { StoreSocialLinks } from "@/types/storeSocialLinks";
import { cn } from "@/lib/utils";

interface StoreSocialLinksListProps {
  links?: StoreSocialLinks | null;
  className?: string;
  itemClassName?: string;
  size?: "sm" | "md" | "lg";
  variant?: "icons" | "badges" | "compact";
  emptyPlaceholder?: React.ReactNode;
}

const formatHref = (
  platform: keyof StoreSocialLinks,
  rawValue: string,
): string => {
  const value = rawValue.trim();
  if (!value) return "";

  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  switch (platform) {
    case "whatsapp":
      return `https://wa.me/${value.replace(/[^0-9+]/g, "")}`;
    case "telegram":
      return `https://t.me/${value.replace(/^@/, "")}`;
    case "instagram":
      return `https://instagram.com/${value.replace(/^@/, "")}`;
    case "tiktok":
      return `https://tiktok.com/@${value.replace(/^@/, "")}`;
    case "x":
      return `https://x.com/${value.replace(/^@/, "")}`;
    case "snapchat":
      return `https://snapchat.com/add/${value.replace(/^@/, "")}`;
    case "youtube":
      return `https://youtube.com/${value.startsWith("@") ? value : `@${value}`}`;
    default:
      return `https://${value}`;
  }
};

const SOCIAL_CONFIG = [
  {
    key: "instagram" as const,
    name: "Instagram",
    icon: FaInstagram,
    hoverClass:
      "hover:text-[#E4405F] hover:border-[#E4405F]/40 hover:bg-[#E4405F]/10",
  },
  {
    key: "facebook" as const,
    name: "Facebook",
    icon: FaFacebook,
    hoverClass:
      "hover:text-[#1877F2] hover:border-[#1877F2]/40 hover:bg-[#1877F2]/10",
  },
  {
    key: "tiktok" as const,
    name: "TikTok",
    icon: FaTiktok,
    hoverClass:
      "hover:text-neutral-900 dark:hover:text-white hover:border-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800",
  },
  {
    key: "youtube" as const,
    name: "YouTube",
    icon: FaYoutube,
    hoverClass:
      "hover:text-[#FF0000] hover:border-[#FF0000]/40 hover:bg-[#FF0000]/10",
  },
  {
    key: "x" as const,
    name: "X",
    icon: FaXTwitter,
    hoverClass:
      "hover:text-neutral-900 dark:hover:text-white hover:border-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800",
  },
  {
    key: "snapchat" as const,
    name: "Snapchat",
    icon: FaSnapchat,
    hoverClass:
      "hover:text-[#FFFC00] hover:border-[#FFFC00]/40 hover:bg-amber-400/10",
  },
  {
    key: "whatsapp" as const,
    name: "WhatsApp",
    icon: FaWhatsapp,
    hoverClass:
      "hover:text-[#25D366] hover:border-[#25D366]/40 hover:bg-[#25D366]/10",
  },
  {
    key: "telegram" as const,
    name: "Telegram",
    icon: FaTelegram,
    hoverClass:
      "hover:text-[#229ED9] hover:border-[#229ED9]/40 hover:bg-[#229ED9]/10",
  },
  {
    key: "website" as const,
    name: "Website",
    icon: FaGlobe,
    hoverClass:
      "hover:text-primary-600 hover:border-primary-500/40 hover:bg-primary-50 dark:hover:bg-primary-950/40",
  },
];

const sizeClasses = {
  sm: "h-7 w-7 text-xs",
  md: "h-8 w-8 text-sm",
  lg: "h-10 w-10 text-base",
};

const iconSizes = {
  sm: "h-3.5 w-3.5",
  md: "h-4 w-4",
  lg: "h-5 w-5",
};

const StoreSocialLinksList: React.FC<StoreSocialLinksListProps> = ({
  links,
  className,
  itemClassName,
  size = "md",
  variant = "icons",
  emptyPlaceholder = <span className="text-gray-400">—</span>,
}) => {
  if (!links) return <>{emptyPlaceholder}</>;

  const activeSocials = SOCIAL_CONFIG.filter(
    (item) => links[item.key] && links[item.key]!.trim().length > 0,
  );

  if (activeSocials.length === 0) {
    return <>{emptyPlaceholder}</>;
  }

  if (variant === "compact") {
    return (
      <div className={cn("flex flex-wrap items-center gap-2", className)}>
        {activeSocials.map(({ key, name, icon: Icon, hoverClass }) => {
          const href = formatHref(key, links[key]!);
          return (
            <Link
              key={key}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              title={name}
              className={cn(
                "inline-flex items-center gap-1.5 text-xs text-gray-600 transition-colors dark:text-gray-400",
                hoverClass,
                itemClassName,
              )}
            >
              <Icon className={iconSizes[size]} />
              <span className="truncate max-w-[120px]">{links[key]}</span>
            </Link>
          );
        })}
      </div>
    );
  }

  if (variant === "badges") {
    return (
      <div className={cn("flex flex-wrap items-center gap-2", className)}>
        {activeSocials.map(({ key, name, icon: Icon, hoverClass }) => {
          const href = formatHref(key, links[key]!);
          return (
            <Link
              key={key}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              title={name}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 shadow-2xs transition-all dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300",
                hoverClass,
                itemClassName,
              )}
            >
              <Icon className={iconSizes[size]} />
              <span>{name}</span>
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {activeSocials.map(({ key, name, icon: Icon, hoverClass }) => {
        const href = formatHref(key, links[key]!);
        return (
          <Link
            key={key}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            title={name}
            className={cn(
              "inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 shadow-2xs transition-all dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300",
              sizeClasses[size],
              hoverClass,
              itemClassName,
            )}
          >
            <Icon className={iconSizes[size]} />
          </Link>
        );
      })}
    </div>
  );
};

export default memo(StoreSocialLinksList);
