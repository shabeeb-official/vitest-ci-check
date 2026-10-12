import { useEffect, useState } from "react";
import { useAuth } from "@/store/auth/use-auth";
import { TREND_URI } from "@/config";

const useActiveTrends = () => {
  const [activeTrends, setActiveTrends] = useState([]);
  const auth = useAuth();
  useEffect(() => {
    const getActiveTrends = async () => {
      try {
        const res = await fetch(TREND_URI, {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });
        if (res.ok) {
          const parsedData = await res.json();
          if (parsedData.data?.length > 0) {
            setActiveTrends(parsedData.data);
          }
        }
      } catch (err) {
        console.log("Trend:", err.message);
      }
    };
    if (auth.token) {
      getActiveTrends();
    }
  }, [auth.token]);
  return activeTrends;
};

export default useActiveTrends;
