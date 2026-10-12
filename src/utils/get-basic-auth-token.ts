import { OCAPI_CLIENT_ID, OCAPI_CLIENT_SECRET } from "@/config";

const generateBasicAuthToken = (): string => {
  return btoa(`Basic ${OCAPI_CLIENT_ID}:${OCAPI_CLIENT_SECRET}`);
};

export default generateBasicAuthToken;
