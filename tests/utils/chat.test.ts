import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  genUUID: vi.fn(),
  genISODate: vi.fn(),
  getSession: vi.fn(),
}));

vi.mock("@/utils/gen-id", () => ({
  genUUID: mocks.genUUID,
}));

vi.mock("@/utils/date", () => ({
  genISODate: mocks.genISODate,
}));

vi.mock("@/utils/session", () => ({
  getSession: mocks.getSession,
}));

vi.mock("@/config", () => ({
  CHAT_PREFIX: "test-chat",
}));

import {
  genUserChatMessage,
  genAssistantChatMessage,
  getChatFromSessionStorage,
  saveChatToSessionStorage,
} from "@/utils/chat";

describe("chat utilities", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();

    mocks.genUUID.mockReturnValue("uuid-123");
    mocks.genISODate.mockReturnValue("2026-10-14T10:00:00.000Z");
    mocks.getSession.mockReturnValue("session-123");
  });

  describe("genUserChatMessage", () => {
    it("creates a user message", () => {
      expect(genUserChatMessage("Hello")).toEqual({
        id: "uuid-123",
        type: "user",
        content: "Hello",
        timestamp: "2026-10-14T10:00:00.000Z",
        chips: undefined,
      });
    });
  });

  describe("genAssistantChatMessage", () => {
    it("creates an assistant message with default empty chips", () => {
      expect(genAssistantChatMessage("Hello")).toEqual({
        id: "uuid-123",
        type: "assistant",
        content: "Hello",
        timestamp: "2026-10-14T10:00:00.000Z",
        chips: [],
      });
    });

    it("creates an assistant message with supplied chips", () => {
      expect(genAssistantChatMessage("Choose one", ["A", "B"])).toEqual({
        id: "uuid-123",
        type: "assistant",
        content: "Choose one",
        timestamp: "2026-10-14T10:00:00.000Z",
        chips: ["A", "B"],
      });
    });
  });

  describe("getChatFromSessionStorage", () => {
    it("returns chat history for the current session", () => {
      const chats = JSON.stringify([{ content: "Hello" }]);
      sessionStorage.setItem("test-chat-session-123", chats);

      expect(getChatFromSessionStorage()).toBe(chats);
    });

    it("returns null when no chat history exists", () => {
      expect(getChatFromSessionStorage()).toBeNull();
    });

    it("uses the empty session value when no session exists", () => {
      mocks.getSession.mockReturnValue("");

      expect(getChatFromSessionStorage()).toBeNull();
      expect(sessionStorage.getItem("test-chat-")).toBeNull();
    });
  });

  describe("saveChatToSessionStorage", () => {
    it("saves the first chat message as an array", () => {
      const chat = genUserChatMessage("Hello");

      saveChatToSessionStorage(chat);

      expect(sessionStorage.getItem("test-chat-session-123")).toBe(
        JSON.stringify([chat]),
      );
    });

    it("appends a message to existing chat history", () => {
      const existingChat = genUserChatMessage("First");
      const newChat = genAssistantChatMessage("Second");

      sessionStorage.setItem(
        "test-chat-session-123",
        JSON.stringify([existingChat]),
      );

      saveChatToSessionStorage(newChat);

      expect(
        JSON.parse(sessionStorage.getItem("test-chat-session-123")!),
      ).toEqual([existingChat, newChat]);
    });

    it("does not save when the session ID is empty", () => {
      mocks.getSession.mockReturnValue("");
      const setItemSpy = vi.spyOn(Storage.prototype, "setItem");

      saveChatToSessionStorage(genUserChatMessage("Hello"));

      expect(setItemSpy).not.toHaveBeenCalled();
    });
  });
});
