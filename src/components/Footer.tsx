import { Locale } from "@/types/locale";
import MaxWidthWrapper from "./shared/MaxWidthWrapper";
import FooterBot from "./user/general/footer/bot/FooterBot";
import FooterMid from "./user/general/footer/mid/FooterMid";
import FooterTop from "./user/general/footer/top/FooterTop";
import { isArabicLocale } from "@/config/locales.config";

interface FooterProps {
  locale: Locale;
}

const Footer = ({ locale }: FooterProps) => {
  const isArabic = isArabicLocale(locale);

  return (
    <div className="w-full bg-gray-50 min-h-10">
      <MaxWidthWrapper className="py-10">
        <FooterTop />
        <FooterMid locale={locale} isArabic={isArabic} />
        <FooterBot />
      </MaxWidthWrapper>
    </div>
  );
};

export default Footer;
