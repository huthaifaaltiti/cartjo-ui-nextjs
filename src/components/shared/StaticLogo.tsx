import { memo } from "react";
import CustomImage from "../admin/shared/CustomImage";

const StaticLogo = () => {
  return (
    <CustomImage
      src="/assets/image/png/CartJO_LOGO_minimize.png"
      alt="app logo"
      height={40}
      width={120}
      loading="lazy"
    />
  );
};

export default memo(StaticLogo);
