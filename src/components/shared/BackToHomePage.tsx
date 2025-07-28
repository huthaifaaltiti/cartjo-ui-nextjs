import Link from "next/link";
import { Home } from "lucide-react";
import { useTranslations } from "next-intl";

export default function BackToHomePage() {
  const t = useTranslations();

  return (
    <div className="w-auto border rounded p-2">
      <Link
        href="/"
        className="flex items-center gap-2 text-sm text-text-primary-100"
      >
        <Home size={16} />
        <span>{t("components.BackToHomePage.backToHome")}</span>
      </Link>
    </div>
  );
}
