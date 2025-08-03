import { memo, ReactNode } from "react";
import { MoveRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import Link from "next/link";

type ShowcaseSectionProps = {
  header: string;
  desc: string;
  uri: string;
  children: ReactNode;
};

const ShowcaseSection = ({
  header,
  desc,
  uri,
  children,
}: ShowcaseSectionProps) => {
  const t = useTranslations();

  return (
    <div className="w-full h-auto">
      <div className="w-full flex items-center justify-between">
        <div className="w-auto flex items-center gap-4">
          <h3 className="text-lg text-text-primary-400 font-extrabold">
            {header}
          </h3>
          <p className="text-xs text-text-secondary-200">{desc}</p>
        </div>

        <Link href={uri}>
          <Button
            variant="default"
            className="bg-white-50 rounded-[20px] border border-gray-100 shadow-none flex items-center gap-1 group text-[#212529] font-bold hover:shadow transition-all"
          >
            {t("components.ShowcaseSection.btnText")}
            <MoveRight className="w-3 h-3 group-hover:translate-x-1 transition-all" />
          </Button>
        </Link>
      </div>

      <div className="w-full mt-5">{children}</div>
    </div>
  );
};

export default memo(ShowcaseSection);
