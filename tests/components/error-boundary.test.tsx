import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import { ErrorBoundary } from "@/components/error-boundary";
import { expectAccessible } from "./expect-accessible";

const Boom = (): JSX.Element => {
  throw new Error("kaboom");
};

// jsdom reports errors React rethrows during render; suppress the expected one.
const suppressWindowError = (event: ErrorEvent) => event.preventDefault();

describe("ErrorBoundary", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    window.addEventListener("error", suppressWindowError);
  });

  afterEach(() => {
    window.removeEventListener("error", suppressWindowError);
  });

  it("renders children when nothing throws", () => {
    render(
      <ErrorBoundary>
        <p>healthy</p>
      </ErrorBoundary>,
    );

    expect(screen.getByText("healthy")).toBeInTheDocument();
  });

  it("renders the custom fallback when a child throws", () => {
    render(
      <ErrorBoundary fallback={<p>custom fallback</p>}>
        <Boom />
      </ErrorBoundary>,
    );

    expect(screen.getByText("custom fallback")).toBeInTheDocument();
  });

  it("renders the default error page with details in dev", async () => {
    const { container } = render(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>,
    );

    expect(
      screen.getByRole("heading", { name: "Internal Server Error" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /try again/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Error Details")).toBeInTheDocument();
    expect(screen.getByText(/kaboom/)).toBeInTheDocument();
    await expectAccessible(container);
  });
});
