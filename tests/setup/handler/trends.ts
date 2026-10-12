import { http, HttpResponse } from "msw";
import { getDefaultTestEnv } from "../env";

const trendUri = `${getDefaultTestEnv().VITE_LANGFLOW_URI}/active-trends`;

export const trendHandlers = [
  http.get(trendUri, ({ request }) => {
    const authorization = request.headers.get("Authorization");

    if (!authorization) {
      return HttpResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    return HttpResponse.json({
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
  }),
];