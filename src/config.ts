export const USER_AUTH_TOKEN = "USER-AUTH-TOKEN";
export const TEST_MODE = JSON.parse(import.meta.env.VITE_TEST_MODE) || false;
export const MOBILE_WIDTH = 1024;
export const IS_DEV = import.meta.env.DEV;

export const OCAPI_CLIENT_ID = import.meta.env.VITE_OCAPI_CLIENT_ID;
export const OCAPI_CLIENT_SECRET = import.meta.env.VITE_OCAPI_CLIENT_SECRET;

export const SIZE_GUIDE_URI =
  "https://www.citybeach.com/au/size-guide-make-selection.html";

export const AUTHENTICATION_SERVER = import.meta.env.VITE_AUTH_SERVER;
export const LANGFLOW_URI = import.meta.env.VITE_LANGFLOW_URI;

export const DETAILS_URI = import.meta.env.VITE_DETAILS_URI;

export const TREND_URI = `${LANGFLOW_URI}/active-trends`;

export const ADD_TO_CART_URI = import.meta.env.VITE_ADD_TO_CART_URI;
export const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === "true" || false;

export const ADD_WISHLIST_URI = import.meta.env.VITE_ADD_TO_WISHLIST_URI;

export const REMOVE_WISHLIST_URI = import.meta.env.VITE_REMOVE_TO_WISHLIST_URI;

export const BASE_PATH = import.meta.env.VITE_BASE_PATH || "";

export const DEFAULT_HEADER_HEIGHT = 170.891;

export const SESSION_KEY = "session-id";
export const CHAT_PREFIX = "CHAT";
export const PRODUCT_PREFIX = "PRODUCT";

//Auth Credentials

export const BEYZON_USERNAME = import.meta.env.VITE_BEYZON_USERNAME;
export const BEYZON_PASSWORD = import.meta.env.VITE_BEYZON_PASSWORD;

export const CITYBEACH_USERNAME = import.meta.env.VITE_CITYBEACH_USERNAME;
export const CITYBEACH_PASSWORD = import.meta.env.VITE_CITYBEACH_PASSWORD;

export const TIME_TO_REFRESH_TOKEN_IN_SECONDS = 60;

export const THEME_CONFIG_URI = import.meta.env.VITE_THEME_CONFIG_URI;

export const TENANT_ID = import.meta.env.VITE_TENANT_ID;
export const TENANT_PLATFORM = import.meta.env.VITE_TENANT_PLATFORM;
export const TENANT_NAME = import.meta.env.VITE_TENANT_NAME;

export const DEFAULT_REGION = import.meta.env.VITE_DEFAULT_REGION || "";

export const BUILD_REGISTRY_VERSION = import.meta.env.VITE_REGISTRY_VERSION;
