import { memo } from "react";
import { TypeHintConfigContextProvider } from "@/contexts/TypeHintConfig.context";
import SearchTypeHintConfigs from "./SearchTypeHintConfigs";
import TypeHintConfigsList from "./TypeHintConfigsList";
import CreateTypeHintConfigButton from "./CreateTypeHintConfigButton";

const TypeHintConfigsPage = () => {
  return (
    <TypeHintConfigContextProvider>
      <div className="w-full flex flex-col items-start gap-1 md:flex-row md:items-center md:justify-between md:gap-5 mb-3">
        <SearchTypeHintConfigs />
        <CreateTypeHintConfigButton />
      </div>
      <TypeHintConfigsList />
    </TypeHintConfigContextProvider>
  );
};

export default memo(TypeHintConfigsPage);
