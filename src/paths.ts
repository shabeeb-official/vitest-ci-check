import { BASE_PATH } from "@/config";

const ROOT = BASE_PATH;

const buildPath = (...args: unknown[]) => args.join("/");

const objectToQueryString = (query: any) => {
  const searchParams = new URLSearchParams(query);
  return searchParams.toString();
};

const squashPathAndQueryString = (path: string, query: unknown) => {
  return `${path}?${objectToQueryString(query)}`;
};

export const PATHS = {
  root: ROOT,
  products: {
    root: buildPath(ROOT, "products"),
    trend: (trendName: string) =>
      squashPathAndQueryString(buildPath(ROOT, "products"), {
        trend: trendName,
      }),
    view: (params: string, query: unknown) =>
      squashPathAndQueryString(buildPath(ROOT, "products", params), query),
  },
};
