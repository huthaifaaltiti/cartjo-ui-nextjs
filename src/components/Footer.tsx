import MaxWidthWrapper from "./shared/MaxWidthWrapper";
import FooterBot from "./user/general/footer/FooterBot";
import FooterMid from "./user/general/footer/FooterMid";
import FooterTop from "./user/general/footer/FooterTop";

const Footer = () => {
  return (
    <div className="w-full bg-gray-50 min-h-80">
      <MaxWidthWrapper className="py-10">
        <FooterTop />
        <FooterMid />
        <FooterBot />
      </MaxWidthWrapper>
    </div>
  );
};

export default Footer;
