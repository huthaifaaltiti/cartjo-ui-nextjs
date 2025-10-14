import { useTranslations } from "next-intl";
import Link from "next/link";

const FooterBot = () => {
  const t = useTranslations();

  const links = [
    { label: "terms", href: "/terms-of-use" },
    { label: "privacy", href: "/privacy-policy" },
    { label: "warranty", href: "/warranty-policy" },
  ];

  return (
    <footer className="w-full border-t border-gray-100 py-4 text-sm text-gray-600">
      <div className="flex flex-col items-start justify-between gap-2 md:flex-row">
        <span className="text-sm text-text-primary-200">
          {t("components.Footer.components.FooterBot.rights", {
            date: new Date().getFullYear(),
          })}
        </span>

        <ul className="flex flex-wrap items-center gap-4">
          {links.map(({ label, href }) => (
            <li key={href}>
              <Link
                href={href}
                target="_blank"
                className="text-sm text-text-primary-200 hover:text-primary-500 hover:underline transition-colors duration-200"
              >
                {t(`components.Footer.components.FooterBot.items.${label}`)}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
};

export default FooterBot;
