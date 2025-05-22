import MaxWidthWrapper from "@/components/shared/MaxWidthWrapper";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MaxWidthWrapper>{children}</MaxWidthWrapper>;
}
