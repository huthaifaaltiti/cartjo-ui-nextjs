import { memo } from "react";
import { TypeHintConfigContextProvider } from "@/contexts/TypeHintConfig.context";
import { TypeHintConfig } from "@/types/typeHintConfig.type";
import SearchTypeHintConfigs from "./SearchTypeHintConfigs";
import ModalCreateButton from "@/components/shared/ModalCreateButton";
import { Blocks } from "lucide-react";
import CreateTypeHintConfigForm from "./CreateTypeHintConfigForm";
import TypeHintConfigsList from "./TypeHintConfigsList";

type TypeHintConfigsPageProps = {
  data: TypeHintConfig[];
  token: string | null;
};

const TypeHintConfigsPage = ({ data, token }: TypeHintConfigsPageProps) => {
  return (
    <TypeHintConfigContextProvider token={token}>
      <div className="w-full flex flex-col items-start gap-1 md:flex-row md:items-center md:justify-between md:gap-5 mb-3">
        <SearchTypeHintConfigs />
        <ModalCreateButton
          icon={<Blocks />}
          createTranslationKey="routes.dashboard.routes.typeHintConfigs.createTypeHintConfig.label"
          ModalContent={<CreateTypeHintConfigForm />}
        />
      </div>
      <TypeHintConfigsList initialData={data} />
    </TypeHintConfigContextProvider>
  );
};

export default memo(TypeHintConfigsPage);
