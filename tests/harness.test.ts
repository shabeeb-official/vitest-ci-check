import { describe, expect, it, vi } from "vitest";
import { createElement } from "react";

import {
  getDefaultTestEnv,
  renderWithProviders,
  server,
  stubTestEnv,
  createHandlers,
} from "./setup/index";

describe("shared test harness", () => {
  it("exposes a default env fixture and environment stubs", () => {
    const env = getDefaultTestEnv();

    expect(env.VITE_DETAILS_URI).toBe("http://localhost:4000/pdp");
    expect(env.VITE_LANGFLOW_URI).toBe("http://localhost:4000/plp");
    expect(env.VITE_ADD_TO_CART_URI).toBe("http://localhost:4000/cart/add");
  });

  it("can stub env values without leaking between tests", () => {
    stubTestEnv({ VITE_DETAILS_URI: "https://example.test/details" });
    expect(import.meta.env.VITE_DETAILS_URI).toBe(
      "https://example.test/details",
    );

    vi.unstubAllEnvs();
    stubTestEnv();
    expect(import.meta.env.VITE_DETAILS_URI).toBe(
      getDefaultTestEnv().VITE_DETAILS_URI,
    );
  });

  it("creates reusable MSW handlers", () => {
    const handlers = createHandlers({
      details: [{ status: 200, body: { ok: true } }],
    });

    expect(handlers.length).toBeGreaterThan(0);
  });

  it("renders wrapped components", () => {
    const { getByText } = renderWithProviders(
      createElement("div", null, "wrapped"),
    );

    expect(getByText("wrapped")).toBeInTheDocument();
  });

  it("supports a no-op handler registration", () => {
    server.use(
      ...createHandlers({
        details: [{ status: 200, body: { ok: true } }],
      }),
    );

    expect(server).toBeDefined();
  });
});
