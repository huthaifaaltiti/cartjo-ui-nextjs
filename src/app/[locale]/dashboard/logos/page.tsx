import { getAccessTokenFromServerSession } from "@/lib/serverSession";
import { fetchLogos } from "@/hooks/react-query/useLogosQuery";

import { PAGINATION_LIMITS } from "@/config/paginationConfig";

import LogosPage from "@/components/admin/routes/logos/LogosPage";

export default async function Page() {
  const accessToken = await getAccessTokenFromServerSession();

  const { data } = await fetchLogos({
    token: accessToken,
    limit: PAGINATION_LIMITS.LOGOS,
  });

  return <LogosPage initialLogos={data} accessToken={accessToken} />;
}
