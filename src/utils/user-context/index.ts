import dayjs from "dayjs";

const getCurrentTimestamp = (): string => {
  return dayjs().toISOString();
};

export type AddUserContextParams = {
  sku: string;
  brand: string;
  name: string;
  color: string;
  pdp_context_attributes?: string | null
};

type UserContextOpts = {
  page: "PLP" | "PDP" | "CHAT";
};

export const initUserContext = () => {
  if (!window.userContext) {
    window.userContext = [];
  }
};

export const addUserContext = (
  payload: AddUserContextParams,
  opts?: UserContextOpts,
) => {
  if (opts?.page === "PDP") {
    window.userContext.push({
      timestamp: getCurrentTimestamp(),
      sku: payload.sku,
      brand: payload.brand,
      name: payload.name,
      color: payload.color,
      pdp_context_attributes: payload.pdp_context_attributes
    });
  }
};

export const clearUserContext = () => {
  window.userContext = [];
};

const getUserContext = (): AddUserContextParams[] => {
  const userContext = window.userContext || [];
  return userContext as AddUserContextParams[];
};

const parseContext = () => {
  const userContext = getUserContext();
  if (userContext.length > 0) {




    const message = userContext.map((context) => {
      if (context.pdp_context_attributes) {
        return `${context.name} by the brand ${context.brand} of the color ${context.color}, ${context.pdp_context_attributes}`;
      }

      return `${context.name} by the brand ${context.brand} of the color ${context.color}`;
    });
    return message.join(", ");
  }
};

export const generateUserContextMessage = (): string => {
  const contextMessage = parseContext();
  if (!contextMessage) {
    return "";
  }

  return "** User is currently viewing " + contextMessage;
};
