export default async function UserPageLayout({
  children,
  // params,
}: {
  children: React.ReactNode;
  params?: { slug?: string[] };
}) {
  return <div className="fw-full h-full">{children}</div>;
}
