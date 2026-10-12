import { SESSION_KEY, USER_AUTH_TOKEN } from "@/config";

export const setSession = (sessionID: string) => {
  sessionStorage.setItem(SESSION_KEY, sessionID);
};

export const getRawSession = () => {
  return sessionStorage.getItem(SESSION_KEY) || "";
};

export const getSession = (): string => {
  const rawSession = getRawSession();
  return getSessionId(rawSession);
};

const getSessionId = (rawSession: string) => {
  return rawSession.split(":")[0];
};

export const getUserSession = () => {
  const token = localStorage.getItem(USER_AUTH_TOKEN);
  if (token) {
    return token;
  }
  return null;
};

export const setUserSession = (token: string) => {
  localStorage.setItem(USER_AUTH_TOKEN, token);
};
