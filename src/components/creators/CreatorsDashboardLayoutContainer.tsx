import React from "react";
import MaxWidthWrapper from "@/components/shared/MaxWidthWrapper";

interface CreatorsDashboardLayoutContainerProps {
  children: React.ReactNode;
}

export default function CreatorsDashboardLayoutContainer({
  children,
}: CreatorsDashboardLayoutContainerProps) {
  return (
    <main className="min-h-screen bg-[#f5f4fe] flex flex-col font-sans flex-1 md:overflow-y-auto p-4 md:p-6 lg:p-8">
      <MaxWidthWrapper className="max-w-7xl">{children}</MaxWidthWrapper>
    </main>
  );
}
