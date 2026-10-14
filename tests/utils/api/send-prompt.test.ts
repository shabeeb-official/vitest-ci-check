import { beforeEach, afterEach, describe, it, expect, vi } from "vitest";
import axios from "axios";
import sendPrompt from "@/utils/api/send-prompt";
import { getSession } from "@/utils/session";
import { generateUserContextMessage } from "@/utils/user-context";
import { LANGFLOW_URI, TEST_MODE } from "@/config";

vi.mock("axios", () => ({
  default: {
    post: vi.fn(),
  },
}));

vi.mock("@/config", () => ({
  LANGFLOW_URI: "https://test-langflow.example.com",
  TEST_MODE: true,
}));

vi.mock("@/utils/session", () => ({
  getSession: vi.fn(),
}));

vi.mock("@/utils/user-context", () => ({
  generateUserContextMessage: vi.fn(),
}));

describe("sendPrompt", () => {
  const mockedPost = vi.mocked(axios.post);
  const mockedGetSession = vi.mocked(getSession);
  const mockedGenerateContext = vi.mocked(generateUserContextMessage);

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});

    mockedGetSession.mockReturnValue("test-session");
    mockedGenerateContext.mockReturnValue("");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("sends a text prompt and returns products and chips", async () => {
    const response = {
      products: [{ id: "product-1" }],
      chips: ["chip-1"],
    };

    mockedPost.mockResolvedValue({
      data: {
        richContent: response,
        textMessage: "Results found",
      },
    } as any);

    const result = await sendPrompt(
      "Find shoes",
      { token: "test-token", trend: false },
      "india",
    );

    expect(mockedPost).toHaveBeenCalledWith(
      LANGFLOW_URI,
      {
        sessionInfo: {
          session: "test-session",
          parameters: { test: TEST_MODE },
        },
        text: "Find shoes",
      },
      {
        params: { country: "india" },
        headers: { Authorization: "Bearer test-token" },
        withCredentials: true,
      },
    );

    expect(result).toEqual({
      products: response.products,
      chips: response.chips,
      message: "Results found",
      status: true,
    });
  });

  it("sends a trend prompt", async () => {
    mockedPost.mockResolvedValue({
      data: {
        richContent: {
          products: [],
          chips: [],
        },
        textMessage: "Trend results",
      },
    } as any);

    const result = await sendPrompt(
      "Trending now",
      { token: "trend-token", trend: true },
      "india",
    );

    expect(mockedPost).toHaveBeenCalledWith(
      LANGFLOW_URI,
      expect.objectContaining({
        trend: "Trending now",
        sessionInfo: {
          session: "test-session",
          parameters: { test: TEST_MODE },
        },
      }),
      expect.any(Object),
    );

    expect(mockedPost.mock.calls[0][1]).not.toHaveProperty("text");
    expect(result).toEqual({
      products: [],
      chips: [],
      message: "Trend results",
      status: true,
    });
  });

  it("uses an empty country parameter for global requests", async () => {
    mockedPost.mockResolvedValue({
      data: {
        textMessage: "Global results",
      },
    } as any);

    await sendPrompt(
      "Global search",
      { token: "token", trend: false },
      "global",
    );

    expect(mockedPost).toHaveBeenCalledWith(
      LANGFLOW_URI,
      expect.any(Object),
      expect.objectContaining({
        params: { country: "" },
      }),
    );
  });

  it("appends the user context to a text prompt", async () => {
    mockedGenerateContext.mockReturnValue("User prefers running shoes");

    mockedPost.mockResolvedValue({
      data: {
        textMessage: "Contextual results",
      },
    } as any);

    await sendPrompt(
      "Find shoes",
      { token: "token", trend: false },
      "india",
    );

    expect(mockedPost).toHaveBeenCalledWith(
      LANGFLOW_URI,
      expect.objectContaining({
        text: "Find shoes User prefers running shoes",
      }),
      expect.any(Object),
    );
  });

  it("returns an empty product and chip list when richContent is absent", async () => {
    mockedPost.mockResolvedValue({
      data: {
        textMessage: "No rich content",
      },
    } as any);

    const result = await sendPrompt(
      "Search",
      { token: "token", trend: false },
      "india",
    );

    expect(result).toEqual({
      products: [],
      chips: [],
      message: "No rich content",
      status: true,
    });
  });

  it("returns an empty product list when richContent has no products", async () => {
    mockedPost.mockResolvedValue({
      data: {
        richContent: {
          chips: ["chip-1"],
        },
        textMessage: "Chips only",
      },
    } as any);

    const result = await sendPrompt(
      "Search",
      { token: "token", trend: false },
      "india",
    );

    expect(result).toEqual({
      products: [],
      chips: ["chip-1"],
      message: "Chips only",
      status: true,
    });
  });

  it("returns the fallback response when the request fails", async () => {
    const error = new Error("Network error");
    mockedPost.mockRejectedValue(error);

    const result = await sendPrompt(
      "Search",
      { token: "token", trend: false },
      "india",
    );

    expect(console.error).toHaveBeenCalledWith(error);
    expect(result).toEqual({
      products: [],
      chips: [],
      message:
        "I can't fetch the results right now. Please try again later.",
      status: false,
    });
  });
});