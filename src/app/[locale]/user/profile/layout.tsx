export default async function UserProfilePageLayout({
  children,
  // params,
}: {
  children: React.ReactNode;
  params?: { slug?: string[] };
}) {
  return <div className="fw-full h-full">{children}</div>;
}
