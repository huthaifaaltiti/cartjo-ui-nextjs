import { getAccessTokenFromServerSession } from "@/lib/serverSession";

export default async function Page() {
  const accessToken = await getAccessTokenFromServerSession();

  return <div></div>;
}
