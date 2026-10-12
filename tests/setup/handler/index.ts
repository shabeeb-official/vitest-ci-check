import { http, HttpResponse, type HttpHandler } from "msw";
import { getDefaultTestEnv } from "../env";

type ResponseSpec = {
  status?: number;
  body?: unknown;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  requireQuery?: string[];
  requireForm?: string[];
  error?: "network" | "empty";
};

type HandlerMap = {
  details?: ResponseSpec[];
  langflow?: ResponseSpec[];
  cart?: ResponseSpec[];
  wishlist?: ResponseSpec[];
  removeWishlist?: ResponseSpec[];
  trend?: ResponseSpec[];
};

const getEndpoint = (routeName: keyof HandlerMap): string => {
  const env = getDefaultTestEnv();

  switch (routeName) {
    case "details":
      return env.VITE_DETAILS_URI;

    case "langflow":
      return env.VITE_LANGFLOW_URI;

    case "cart":
      return env.VITE_ADD_TO_CART_URI;

    case "wishlist":
      return env.VITE_ADD_TO_WISHLIST_URI;

    case "removeWishlist":
      return env.VITE_REMOVE_TO_WISHLIST_URI;

    case "trend":
      return `${env.VITE_LANGFLOW_URI.replace(/\/$/, "")}/active-trends`;

    default:
      return "";
  }
};

const createEndpointResponse = (spec: ResponseSpec = {}) => {
  const status = spec.status ?? 200;

  if (spec.error === "network") {
    return HttpResponse.error();
  }

  if (spec.error === "empty") {
    return new HttpResponse(null, { status });
  }

  if (spec.body === undefined) {
    return HttpResponse.json({ ok: true }, { status });
  }

  return HttpResponse.json(spec.body, { status });
};

const createRouteHandlers = (
  routeName: keyof HandlerMap,
  specs: ResponseSpec[],
): HttpHandler[] => {
  const url = getEndpoint(routeName);

  return specs.map((spec) => {
    const method = (spec.method ?? "GET").toLowerCase();

    const handler =
      http[method as "get" | "post" | "put" | "delete"];

    return handler(url, async ({ request }) => {
      const requestUrl = new URL(request.url);

      // Validate query parameters
      const requiredQueryParams = spec.requireQuery ?? [];

      const missingQueryParams = requiredQueryParams.filter(
        (key) => !requestUrl.searchParams.has(key),
      );

      if (missingQueryParams.length > 0) {
        return HttpResponse.json(
          {
            error: "missing query params",
            missing: missingQueryParams,
          },
          { status: 400 },
        );
      }

      // Validate form parameters
      const requiredFormParams = spec.requireForm ?? [];

      if (requiredFormParams.length > 0) {
        const contentType = request.headers.get("content-type") ?? "";

        if (contentType.includes("application/x-www-form-urlencoded")) {
          const body = await request.text();
          const formParams = new URLSearchParams(body);

          const missingFormParams = requiredFormParams.filter(
            (key) => !formParams.has(key),
          );

          if (missingFormParams.length > 0) {
            return HttpResponse.json(
              {
                error: "missing form params",
                missing: missingFormParams,
              },
              { status: 400 },
            );
          }
        }
      }

      return createEndpointResponse(spec);
    });
  });
};

export const createHandlers = (
  routes: HandlerMap = {},
): HttpHandler[] => {
  const handlers: HttpHandler[] = [];

  const routeNames: (keyof HandlerMap)[] = [
    "details",
    "langflow",
    "cart",
    "wishlist",
    "removeWishlist",
    "trend",
  ];

  routeNames.forEach((routeName) => {
    const specs = routes[routeName] ?? [];

    handlers.push(...createRouteHandlers(routeName, specs));
  });

  return handlers;
};