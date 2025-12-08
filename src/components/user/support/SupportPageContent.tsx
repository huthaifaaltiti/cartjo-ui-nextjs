"use client";

import { memo, useState } from "react";
import SupportHeroSection from "./SupportHeroSection";
import MaxWidthWrapper from "@/components/shared/MaxWidthWrapper";
import SupportContactMethods from "./SupportContactMethods";
import SupportFAQ from "./SupportFAQ";
import HelpSection from "@/components/shared/HelpSection";
import SupportQuickLicks from "./SupportQuickLicks";

const SupportPageContent = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  return (
    <div className="w-full">
      <SupportHeroSection
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <MaxWidthWrapper className="mt-5 py-8">
        <SupportContactMethods />
        <SupportFAQ searchQuery={searchQuery} />
        <HelpSection
          title="Still need help?"
          description="Can't find what you're looking for? Our support team is ready to assist you with any questions or concerns."
          primaryAction={{
            label: "Contact Support",
            onClick: () => console.log("Contact Support clicked"),
          }}
          secondaryAction={{
            label: "View All Articles",
            onClick: () => console.log("View All Articles clicked"),
          }}
        />
        <SupportQuickLicks />
      </MaxWidthWrapper>
    </div>
  );
};

export default memo(SupportPageContent);
