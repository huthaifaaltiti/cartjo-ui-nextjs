import DashboardSideNav from "@/components/admin/DashboardSideNav";
import MaxWidthWrapper from "@/components/shared/MaxWidthWrapper";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full min-h-screen bg-[#f5f4fe]">
      <MaxWidthWrapper className="py-5">
        <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
          <div className="w-full flex-none md:w-64">
            <DashboardSideNav />
          </div>
          <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
            {children}
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}
