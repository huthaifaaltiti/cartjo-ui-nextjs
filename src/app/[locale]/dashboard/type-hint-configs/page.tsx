import { fetchShowcases } from "@/hooks/react-query/useShowcasesQuery";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { getAccessTokenFromServerSession } from "@/lib/serverSession";
import ShowcasesPage from "@/components/admin/routes/showcases/ShowcasesPage";

const Page = async () => {
  const token = await getAccessTokenFromServerSession();

  const { data } = await fetchShowcases({
    token,
    limit: PAGINATION_LIMITS.SHOWCASES,
  });

  return <ShowcasesPage data={data} token={token} />;
};

export default Page;
