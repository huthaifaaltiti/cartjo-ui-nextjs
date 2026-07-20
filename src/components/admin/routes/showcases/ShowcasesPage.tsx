"use client";

import { memo } from "react";
import { ShowcasesContextProvider } from "@/contexts/Showcase.context";
import SearchShowcases from "./SearchShowcases";
import ShowcasesList from "./ShowcasesList";
import CreateShowcaseButton from "./CreateShowcaseButton";

const ShowcasesPage = () => {
  return (
    <ShowcasesContextProvider>
      <div className="w-full flex flex-col items-start gap-1 md:flex-row md:items-center md:justify-between md:gap-5 mb-3">
        <SearchShowcases />
        <CreateShowcaseButton />
      </div>
      <ShowcasesList />
    </ShowcasesContextProvider>
  );
};

export default memo(ShowcasesPage);
