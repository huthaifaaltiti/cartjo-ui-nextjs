import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { getAccessTokenFromServerSession } from "@/lib/serverSession";
import { fetchTypeHintConfigs } from "@/hooks/react-query/useTypeHintConfigsQuery";
import TypeHintConfigsPage from "@/components/admin/routes/typeHintConfigs/TypeHintConfigsPage";

const Page = async () => {
  const token = await getAccessTokenFromServerSession();

  const { data } = await fetchTypeHintConfigs({
    token,
    limit: PAGINATION_LIMITS.TYPE_HINT_CONFIGS,
  });

  return <TypeHintConfigsPage data={data} token={token} />;
};

export default Page;
