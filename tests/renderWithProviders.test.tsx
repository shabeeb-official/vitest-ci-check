import { describe, expect, it } from "vitest";
import { renderWithProviders } from "./setup";

import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";

const TestComponent = () => {
  const location = useLocation();

  const { data } = useQuery({
    queryKey: ["test-harness"],
    queryFn: async () => "query works",
  });

  return (
    <div>
      <span data-testid="pathname">{location.pathname}</span>
      <span data-testid="query-data">{data ?? "loading"}</span>
    </div>
  );
};

describe("renderWithProviders", () => {
  it("provides router and React Query context", async () => {
    const { findByTestId } = renderWithProviders(<TestComponent />, {
      initialEntries: ["/products"],
    });

    expect(await findByTestId("pathname")).toHaveTextContent("/products");
    expect(await findByTestId("query-data")).toHaveTextContent("query works");
  });

  it("creates an isolated QueryClient for each render", async () => {
    const first = renderWithProviders(<TestComponent />);

    expect(await first.findByTestId("query-data")).toHaveTextContent(
      "query works",
    );

    first.unmount();

    const second = renderWithProviders(<TestComponent />);

    expect(await second.findByTestId("query-data")).toHaveTextContent(
      "query works",
    );
  });

  it("uses the default route when initialEntries is not provided", () => {
    const { getByTestId } = renderWithProviders(<TestComponent />);

    expect(getByTestId("pathname")).toHaveTextContent("/");
  });
});