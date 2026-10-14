import { describe, it, expect, vi } from "vitest";

vi.mock("@/config", () => ({
  OCAPI_CLIENT_ID: "test-client-id",
  OCAPI_CLIENT_SECRET: "test-client-secret",
}));

import generateBasicAuthToken from "@/utils/get-basic-auth-token";

describe("generateBasicAuthToken", () => {
  it("returns the Base64-encoded Basic credentials", () => {
    const result = generateBasicAuthToken();

    expect(result).toBe(
      btoa("Basic test-client-id:test-client-secret"),
    );
  });

  it("returns a string", () => {
    expect(typeof generateBasicAuthToken()).toBe("string");
  });
});
