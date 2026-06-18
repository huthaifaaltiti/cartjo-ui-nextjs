import { memo } from "react";
import { TypeHintConfigContextProvider } from "@/contexts/TypeHintConfig.context";
import SearchTypeHintConfigs from "./SearchTypeHintConfigs";
import ModalCreateButton from "@/components/shared/ModalCreateButton";
import { Blocks } from "lucide-react";
import CreateTypeHintConfigForm from "./CreateTypeHintConfigForm";
import TypeHintConfigsList from "./TypeHintConfigsList";

const TypeHintConfigsPage = () => {
  return (
    <TypeHintConfigContextProvider>
      <div className="w-full flex flex-col items-start gap-1 md:flex-row md:items-center md:justify-between md:gap-5 mb-3">
        <SearchTypeHintConfigs />
        <ModalCreateButton
          icon={<Blocks />}
          createTranslationKey="routes.dashboard.routes.typeHintConfigs.createTypeHintConfig.label"
          ModalContent={<CreateTypeHintConfigForm />}
        />
      </div>
      <TypeHintConfigsList />
    </TypeHintConfigContextProvider>
  );
};

export default memo(TypeHintConfigsPage);
