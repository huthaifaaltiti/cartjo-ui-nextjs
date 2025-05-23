import { memo } from "react";
import Image from "next/image";

const Logo = () => {
  return (
    <Image
      className="w-32"
      src="/assets/image/png/DL-logo-23525.png"
      alt="app logo"
      width={200}
      height={100}
      priority
    />
  );
};

export default memo(Logo);
