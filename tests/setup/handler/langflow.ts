import { http, HttpResponse } from "msw";
import { getDefaultTestEnv } from "../env";

const langflowUri = getDefaultTestEnv().VITE_LANGFLOW_URI;

export const langflowHandlers = [
  http.post(langflowUri, () => {
    return HttpResponse.json({
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
    });
  }),
];