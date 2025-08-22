import { useInfiniteQuery } from "@tanstack/react-query";

const useTypeHintConfigsQuery = ({ search }: { search: string }) => {
  return useInfiniteQuery({ queryKey: ["typeHintConfigs", search] });
};
