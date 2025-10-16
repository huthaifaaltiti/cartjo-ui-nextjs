import TopBar from "@/components/TopBar";

export default async function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TopBar />
      <div className="w-full h-screen">{children}</div>
    </>
  );
}
