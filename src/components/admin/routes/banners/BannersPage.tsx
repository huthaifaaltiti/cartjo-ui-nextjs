import { memo } from "react";

import { Banner } from "@/types/banner.type";

type LogosBannersProps = {
  data: Banner[];
  token: string;
};

const BannersPage = ({ data, token }: LogosBannersProps) => {
  return <div>BannersPage</div>;
};

export default memo(BannersPage);
