import { describe, expect, it } from "vitest";
import axios from "axios";
import { getDefaultTestEnv } from "./setup/env";

import { server } from "./setup/server";
import { createHandlers } from "./setup/handler";

const LANGFLOW_URI = getDefaultTestEnv().VITE_LANGFLOW_URI;

describe("LANGFLOW MSW handler", () => {
  it("intercepts POST requests to LANGFLOW_URI", async () => {
    server.use(
      ...createHandlers({
        langflow: [
          {
            method: "POST",
            requireQuery: ["country"],
            status: 200,
            body: {
              textMessage: "Test search response",
              richContent: {
                products: [
                  {
                    id: "product-1",
                    name: "Test Product",
                    price: 100,
                  },
                ],
                chips: [
                  {
                    label: "Test Chip",
                    value: "test",
                  },
                ],
              },
            },
          },
        ],
      }),
    );

    const response = await axios.post(
      LANGFLOW_URI,
      {
        text: "test search",
        sessionInfo: {
          session: "test-session",
          parameters: {
            test: true,
          },
        },
      },
      {
        params: {
          country: "IN",
        },
        headers: {
          Authorization: "Bearer test-token",
        },
      },
    );

    expect(response.status).toBe(200);

    expect(response.data.textMessage).toBe("Test search response");

    expect(response.data.richContent.products).toHaveLength(1);

    expect(response.data.richContent.chips).toHaveLength(1);
  });
});
