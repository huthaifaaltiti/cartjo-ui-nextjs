import { memo } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

const SupportQuickLicks = () => {
  const t = useTranslations();

  const links = [
    {
      href: "/track-order",
      label: t("routes.support.components.SupportQuickLicks.links.trackOrder"),
    },
    {
      href: "/returns",
      label: t("routes.support.components.SupportQuickLicks.links.returns"),
    },
    {
      href: "/shipping-info",
      label: t(
        "routes.support.components.SupportQuickLicks.links.shippingInfo"
      ),
    },
    {
      href: "/account",
      label: t("routes.support.components.SupportQuickLicks.links.account"),
    },
    {
      href: "/size-guide",
      label: t("routes.support.components.SupportQuickLicks.links.sizeGuide"),
    },
    {
      href: "/warranty",
      label: t("routes.support.components.SupportQuickLicks.links.warranty"),
    },
    {
      href: "/gift-cards",
      label: t("routes.support.components.SupportQuickLicks.links.giftCards"),
    },
    {
      href: "/terms",
      label: t("routes.support.components.SupportQuickLicks.links.terms"),
    },
  ];

  return (
    <div className="mt-12 bg-white-50 rounded-xl border border-gray-200 p-8">
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        {t("routes.support.components.SupportQuickLicks.title")}
      </h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {links.map((link, index) => (
          <Link
            key={index}
            href={link.href}
            className="text-primary-600 hover:text-primary-700 hover:underline"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default memo(SupportQuickLicks);
