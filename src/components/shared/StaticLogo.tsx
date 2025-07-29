import { memo } from "react";
import CustomImage from "../admin/shared/CustomImage";

const StaticLogo = () => {
  return (
    <CustomImage
      src="/assets/image/png/DL-logo-23525.png"
      alt="app logo"
      height={40}
      width={120}
      loading="lazy"
    />
  );
};

export default memo(StaticLogo);
