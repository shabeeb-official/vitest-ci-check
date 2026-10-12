import authenticateSession from "@/api/get-token";
import { TIME_TO_REFRESH_TOKEN_IN_SECONDS } from "@/config";
import { useAuth } from "@/store/auth/use-auth";
import { ReactNode, useEffect, useState } from "react";

type Props = {
  token: string;
  children: ReactNode;
};

const AuthWrapper = ({ token, children }: Props) => {
  const [timeToRefresh, setTimeToRefresh] = useState(
    TIME_TO_REFRESH_TOKEN_IN_SECONDS,
  );
  useEffect(() => {
    let intervalID = null;
    if (token) {
      intervalID = setInterval(() => {
        setTimeToRefresh((prev) => prev - 1);
        if (timeToRefresh === 0) {
          clearInterval(intervalID);
        }
      }, 1000);
    }

    return () => {
      clearInterval(intervalID);
    };
  }, [token, timeToRefresh]);

  const { onReAuthentication } = useAuth();

  useEffect(() => {
    if (timeToRefresh > 0) {
      return;
    }

    const handler = async () => {
      const token = await authenticateSession();
      if (token) {
        // console.log("time to refresh: ", token);
        onReAuthentication(token);
        setTimeToRefresh(TIME_TO_REFRESH_TOKEN_IN_SECONDS);
      }
    };

    handler();
  }, [timeToRefresh, onReAuthentication]);

  return <>{children}</>;
};

export default AuthWrapper;
