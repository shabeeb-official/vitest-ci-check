import dayjs from "dayjs";
import { v4 } from "uuid";
import { getActiveClientConfig } from "./clients";

const clientConfig = getActiveClientConfig();

export const genUUID = () => {
  const id = v4();
  return `${clientConfig.session_id}-${id}`;
};

export const genSessionID = () => {
  const id = v4();
  const expiry = dayjs().add(1, "hours").valueOf();
  return `${clientConfig.session_id}-${id}:${expiry}`;
};
