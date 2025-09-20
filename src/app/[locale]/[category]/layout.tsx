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
      <MaxWidthWrapper className="w-full  min-h-[70vh]">
        <div className="w-full">{children}</div>
      </MaxWidthWrapper>
    </>
  );
}
