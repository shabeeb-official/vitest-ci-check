import { afterEach, describe, expect, it, vi } from "vitest";
import productDetailsScrollToTop from "@/utils/product-details-scroll-to-top";

describe("productDetailsScrollToTop", () => {
  afterEach(() => {
    document.body.innerHTML = "";
    vi.restoreAllMocks();
  });

  it("does nothing when the root container is missing", () => {
    const querySpy = vi.spyOn(document, "querySelector");

    productDetailsScrollToTop();

    expect(querySpy).toHaveBeenCalledWith("#sunny-root");
    expect(querySpy).toHaveReturnedWith(null);
  });

  it("does nothing when the layout container is missing", () => {
    const root = document.createElement("div");
    root.id = "sunny-root";
    document.body.appendChild(root);

    const shadowRoot = root.attachShadow({ mode: "open" });
    const wrapper = document.createElement("div");
    shadowRoot.appendChild(wrapper);

    productDetailsScrollToTop();

    expect(shadowRoot.querySelector("#layout-container")).toBeNull();
  });

  it("scrolls the layout container to the top smoothly", () => {
    const root = document.createElement("div");
    root.id = "sunny-root";
    document.body.appendChild(root);

    const shadowRoot = root.attachShadow({ mode: "open" });
    const wrapper = document.createElement("div");
    const target = document.createElement("div");

    target.id = "layout-container";
    const scrollSpy = vi.fn();
    target.scroll = scrollSpy;

    wrapper.appendChild(target);
    shadowRoot.appendChild(wrapper);

    productDetailsScrollToTop();

    expect(scrollSpy).toHaveBeenCalledWith({
      top: 0,
      behavior: "smooth",
    });
  });
});
