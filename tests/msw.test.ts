import { describe, expect, it } from "vitest";

import { http, HttpResponse } from "msw";

import { server } from "./setup/server";

describe("MSW setup", () => {
  it("intercepts a request", async () => {
    server.use(
      http.get("http://localhost:4000/test", () => {
        return HttpResponse.json({
          message: "MSW is working",
        });
      }),
    );

    const response = await fetch("http://localhost:4000/test");

    const data = await response.json();

    expect(data).toEqual({
      message: "MSW is working",
    });
  });
});