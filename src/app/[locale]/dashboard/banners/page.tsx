import { fetchBanners } from "@/hooks/react-query/useBannersQuery";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { getAccessTokenFromServerSession } from "@/lib/serverSession";
import BannersPage from "@/components/admin/routes/banners/BannersPage";
import { requireAuth } from "@/utils/authRedirect";

const Page = async () => {
  const token = await getAccessTokenFromServerSession();
  requireAuth(token)

  const { data } = await fetchBanners({
    token,
    limit: PAGINATION_LIMITS.BANNERS,
  });

  return <BannersPage data={data} token={token} />;
};

export default Page;
