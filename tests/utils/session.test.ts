import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config", () => ({
  SESSION_KEY: "test-session",
  USER_AUTH_TOKEN: "test-auth-token",
}));

import {
  setSession,
  getRawSession,
  getSession,
  getUserSession,
  setUserSession,
} from "@/utils/session";

describe("session utilities", () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe("setSession", () => {
    it("stores the session ID", () => {
      setSession("session-123:expiry");

      expect(sessionStorage.getItem("test-session")).toBe("session-123:expiry");
    });
  });

  describe("getRawSession", () => {
    it("returns the stored raw session", () => {
      sessionStorage.setItem("test-session", "session-123:expiry");

      expect(getRawSession()).toBe("session-123:expiry");
    });

    it("returns an empty string when no session exists", () => {
      expect(getRawSession()).toBe("");
    });
  });

  describe("getSession", () => {
    it("returns the session ID without the expiry suffix", () => {
      sessionStorage.setItem("test-session", "session-123:expiry");

      expect(getSession()).toBe("session-123");
    });

    it("returns an empty string when no session exists", () => {
      expect(getSession()).toBe("");
    });

    it("returns the whole value when there is no colon", () => {
      sessionStorage.setItem("test-session", "session-123");

      expect(getSession()).toBe("session-123");
    });

    it("returns the part before the first colon", () => {
      sessionStorage.setItem("test-session", "session-123:expiry:extra");

      expect(getSession()).toBe("session-123");
    });
  });

  describe("getUserSession", () => {
    it("returns the stored user token", () => {
      localStorage.setItem("test-auth-token", "user-token-123");

      expect(getUserSession()).toBe("user-token-123");
    });

    it("returns null when no user token exists", () => {
      expect(getUserSession()).toBeNull();
    });
  });

  describe("setUserSession", () => {
    it("stores the user token", () => {
      setUserSession("user-token-456");

      expect(localStorage.getItem("test-auth-token")).toBe("user-token-456");
    });
  });
});
