import { memo } from "react";
import { Blocks } from "lucide-react";

import { Showcase } from "@/types/showcase.type";

import { ShowcasesContextProvider } from "@/contexts/Showcase.context";
import ModalCreateButton from "@/components/shared/ModalCreateButton";

import SearchShowcases from "./SearchShowcases";
import ShowcasesList from "./ShowcasesList";
import CreateShowcaseForm from "./CreateShowcaseForm";

type ShowcasesPageProps = {
  data: Showcase[];
  token: string;
};

const ShowcasesPage = ({ data, token }: ShowcasesPageProps) => {
  return (
    <ShowcasesContextProvider accessToken={token}>
      <div className="w-full flex flex-col items-start gap-1 md:flex-row md:items-center md:justify-between md:gap-5 mb-3">
        <SearchShowcases />
        <ModalCreateButton
          icon={<Blocks />}
          createTranslationKey="routes.dashboard.routes.showcases.createShowcase.label"
          ModalContent={<CreateShowcaseForm />}
        />
      </div>
      <ShowcasesList initialShowcases={data} />
    </ShowcasesContextProvider>
  );
};

export default memo(ShowcasesPage);
