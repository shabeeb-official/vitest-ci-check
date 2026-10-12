import { vi } from "vitest";

export const TEST_ENV = {
  VITE_TEST_MODE: "false",
  VITE_TENANT_ID: "test-tenant-id",
  VITE_TENANT_PLATFORM: "salesforce",
  VITE_TENANT_NAME: "gracestella",

  VITE_AUTH_SERVER: "http://localhost:4000/auth",
  VITE_LANGFLOW_URI: "http://localhost:4000/plp",
  VITE_DETAILS_URI: "http://localhost:4000/pdp",

  VITE_ADD_TO_CART_URI: "http://localhost:4000/cart/add",
  VITE_ADD_TO_WISHLIST_URI: "http://localhost:4000/wishlist/add",
  VITE_REMOVE_TO_WISHLIST_URI:
    "http://localhost:4000/wishlist/remove",

  VITE_CITYBEACH_USERNAME: "test_citybeach_admin",
  VITE_CITYBEACH_PASSWORD: "test-citybeach-password",

  VITE_BEYZON_USERNAME: "test-beyzon-user",
  VITE_BEYZON_PASSWORD: "test-beyzon-password",

  VITE_BUILD_MODE: "library",
  VITE_BASE_URI: "http://localhost:3000",
  VITE_BASE_PATH: "",

  VITE_OCAPI_CLIENT_ID: "test-ocapi-client-id",
  VITE_OCAPI_CLIENT_SECRET: "test-ocapi-client-secret",

  VITE_THEME_CONFIG_URI:
    "http://localhost:4000/frontendconfig",

  VITE_DEFAULT_REGION: "en_AU",
  VITE_REGISTRY_VERSION: "V2",
  VITE_DEMO_MODE: "false",
} as const;

export const getDefaultTestEnv = () => ({
  ...TEST_ENV,
});

export const stubTestEnv = (
  overrides: Record<string, string> = {},
) => {
  const values = {
    ...TEST_ENV,
    ...overrides,
  };

  Object.entries(values).forEach(([key, value]) => {
    vi.stubEnv(key, String(value));
  });

  return values;
};