import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

type QueryParameters = {
  query: string | null;
  trend: string | null;
  isQueryPresent: boolean;
  resetQuery: () => void;
};

const useGetQueryParameters = (): QueryParameters => {
  const [searchTerm, setQuery] = useSearchParams();
  const query = searchTerm.get("query");
  const trend = searchTerm.get("trend");

  const resetQuery = useCallback(() => {
    setQuery({}, { replace: true });
  }, [setQuery]);

  const isQueryPresent = useMemo(() => {
    return Boolean(query) || Boolean(trend);
  }, [query, trend]);

  return { query, trend, resetQuery, isQueryPresent };
};

export default useGetQueryParameters;
