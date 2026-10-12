import { useAuth } from "@/store/auth/use-auth";
import { useEffect } from "react";
import useGetQueryParameters from "./use-get-query-parameters";

const useAutomaticSend = (
  handleSend?: (query: string) => void,
  handleSendTrend?: (trend: string) => void,
) => {
  const auth = useAuth();
  const { trend, query, resetQuery } = useGetQueryParameters();
  useEffect(() => {
    if (auth.token) {
      if (trend) {
        handleSendTrend(trend);
        resetQuery();
        return;
      }
      if (query) {
        handleSend(query);
        resetQuery();
      }
    }
  }, [query, resetQuery, trend, auth.token]);
};

export default useAutomaticSend;
