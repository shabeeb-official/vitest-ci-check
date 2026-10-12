import { afterEach, describe, expect, it } from "vitest";
import { getDefaultTestEnv } from "./setup/env";
import { server, createHandlers } from "./setup";
const { VITE_LANGFLOW_URI } = getDefaultTestEnv();
const TREND_URI = `${VITE_LANGFLOW_URI.replace(/\/$/, "")}/active-trends`;

describe("Active Trends API", () => {
  afterEach(() => {
    server.resetHandlers();
  });

  it("returns active trends successfully", async () => {
    server.use(
      ...createHandlers({
        trend: [
          {
            method: "GET",
            body: {
              data: [
                {
                  id: "trend-1",
                  name: "Summer Collection",
                },
                {
                  id: "trend-2",
                  name: "New Arrivals",
                },
              ],
            },
          },
        ],
      }),
    );

    const response = await fetch(TREND_URI, {
      headers: {
        Authorization: "Bearer test-token",
      },
    });

    expect(response.status).toBe(200);

    const data = await response.json();

    expect(data).toEqual({
      data: [
        {
          id: "trend-1",
          name: "Summer Collection",
        },
        {
          id: "trend-2",
          name: "New Arrivals",
        },
      ],
    });
  });

  it("handles an empty trends response", async () => {
    server.use(
      ...createHandlers({
        trend: [
          {
            method: "GET",
            body: {
              data: [],
            },
          },
        ],
      }),
    );

    const response = await fetch(TREND_URI, {
      headers: {
        Authorization: "Bearer test-token",
      },
    });

    expect(response.status).toBe(200);

    const data = await response.json();

    expect(data).toEqual({
      data: [],
    });
  });

  it("handles a 400 response", async () => {
    server.use(
      ...createHandlers({
        trend: [
          {
            method: "GET",
            status: 400,
            body: {
              error: "Bad request",
            },
          },
        ],
      }),
    );

    const response = await fetch(TREND_URI, {
      headers: {
        Authorization: "Bearer test-token",
      },
    });

    expect(response.status).toBe(400);

    const data = await response.json();

    expect(data).toEqual({
      error: "Bad request",
    });
  });

  it("handles a 500 response", async () => {
    server.use(
      ...createHandlers({
        trend: [
          {
            method: "GET",
            status: 500,
            body: {
              error: "Trend service failed",
            },
          },
        ],
      }),
    );

    const response = await fetch(TREND_URI, {
      headers: {
        Authorization: "Bearer test-token",
      },
    });

    expect(response.status).toBe(500);

    const data = await response.json();

    expect(data).toEqual({
      error: "Trend service failed",
    });
  });

  it("handles a network error", async () => {
    server.use(
      ...createHandlers({
        trend: [
          {
            method: "GET",
            error: "network",
          },
        ],
      }),
    );

    await expect(
      fetch(TREND_URI, {
        headers: {
          Authorization: "Bearer test-token",
        },
      }),
    ).rejects.toThrow();
  });
});