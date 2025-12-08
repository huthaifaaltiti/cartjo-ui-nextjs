import { Locale } from "@/types/locale";
import MaxWidthWrapper from "./shared/MaxWidthWrapper";
import FooterBot from "./user/general/footer/bot/FooterBot";
import FooterMid from "./user/general/footer/mid/FooterMid";
import FooterTop from "./user/general/footer/top/FooterTop";

interface FooterProps {
  locale: Locale;
  isArabic: boolean;
}

const Footer = ({ locale, isArabic }: FooterProps) => {
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
