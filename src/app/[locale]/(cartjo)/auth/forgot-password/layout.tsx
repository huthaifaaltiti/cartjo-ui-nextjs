import MaxWidthWrapper from "@/components/shared/MaxWidthWrapper";
import TopBar from "@/components/TopBar";

export default async function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TopBar />
      <MaxWidthWrapper className="w-full min-h-screen flex flex-col py-8">
        {children}
      </MaxWidthWrapper>
    </>
  );
}
