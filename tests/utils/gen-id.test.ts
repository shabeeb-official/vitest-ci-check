import { beforeEach, describe, expect, it, vi } from "vitest";
import dayjs from "dayjs";

const mocks = vi.hoisted(() => ({
  v4: vi.fn(),
  getActiveClientConfig: vi.fn(() => ({
    session_id: "test-session",
  })),
}));

vi.mock("uuid", () => ({
  v4: mocks.v4,
}));

vi.mock("@/utils/clients", () => ({
  getActiveClientConfig: mocks.getActiveClientConfig,
}));

import { genSessionID, genUUID } from "@/utils/gen-id";

describe("gen-id", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mocks.getActiveClientConfig.mockReturnValue({
      session_id: "test-session",
    });

    mocks.v4.mockReturnValue("test-uuid");
  });

  describe("genUUID", () => {
    it("returns the session ID combined with a UUID", () => {
      expect(genUUID()).toBe("test-session-test-uuid");
      expect(mocks.v4).toHaveBeenCalledOnce();
    });
  });

  describe("genSessionID", () => {
    it("returns the session ID, UUID, and expiry timestamp", () => {
      const before = dayjs().add(1, "hours").valueOf();

      const result = genSessionID();

      const after = dayjs().add(1, "hours").valueOf();
      const expiry = Number(result.split(":")[1]);

      expect(result).toMatch(/^test-session-test-uuid:\d+$/);
      expect(expiry).toBeGreaterThanOrEqual(before);
      expect(expiry).toBeLessThanOrEqual(after);
      expect(mocks.v4).toHaveBeenCalledOnce();
    });
  });
});
