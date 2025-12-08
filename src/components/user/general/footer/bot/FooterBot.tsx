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
    <footer className="w-full border-t border-gray-100 py-4 text-xs sm:text-sm md:text-base text-gray-600">
      <div className="flex flex-col items-start justify-between gap-2 sm:gap-4 md:flex-row md:items-center px-4 sm:px-6 lg:px-8">
        {/* Rights */}
        <span className="text-xs sm:text-sm md:text-base text-text-primary-200">
          {t("components.Footer.components.FooterBot.rights", {
            date: new Date().getFullYear(),
          })}
        </span>

        {/* Links */}
        <ul className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-6 mt-2 md:mt-0">
          {links.map(({ label, href }) => (
            <li key={href}>
              <Link
                href={href}
                target="_blank"
                className="text-xs sm:text-sm md:text-base text-text-primary-200 hover:text-primary-500 hover:underline transition-colors duration-200 cursor-pointer"
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
