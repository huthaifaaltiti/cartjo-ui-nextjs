export default async function UserProfilePageLayout({
  children
}: {
  children: React.ReactNode;
  params?: Promise<{ slug?: string[] }>;
}) {
  // If you need to use params, await it here:
  // const resolvedParams = params ? await params : undefined;
  // const slug = resolvedParams?.slug;

  return <div className="fw-full h-full">{children}</div>;
}