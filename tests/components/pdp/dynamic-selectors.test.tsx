import React from "react";
import "@testing-library/jest-dom/vitest";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { fireEvent, screen } from "@testing-library/react";

import { renderWithProviders } from "../../setup";
import { DynamicVariantSelector } from "@/components/pdp/dynamic-selectors";

const updateSkuMock = vi.fn();

const useProductListMock = vi.fn();
const useGetSkuFromQueryMock = vi.fn();
const useProdctDetailMock = vi.fn();

vi.mock("@/pages/ProductPage", () => ({
  useProductList: () => useProductListMock(),
}));

vi.mock("@/hooks/use-get-sku-from-query", () => ({
  default: () => useGetSkuFromQueryMock(),
}));

vi.mock("@/store/product-detail", () => ({
  useProdctDetail: () => useProdctDetailMock(),
}));

const styles = {
  sectionStyle: "section",
  labelStyle: "label",
  labelBoldStyle: "label-bold",
  wrapperStyle: "wrapper",
  pillStyle: "pill",
  pillSelectedStyle: "pill-selected",
  pillImageStyle: "pill-image",
  valueStyle: "selected-value",
};

const optionStyles = {
  sectionStyle: "option-section",
  labelStyle: "option-label",
  wrapperStyle: "option-wrapper",
  itemStyle: "option-item",
  itemSelectedStyle: "option-item-selected",
};

const renderComponent = () => {
  return renderWithProviders(
    <DynamicVariantSelector styles={styles} optionStyles={optionStyles} />,
  );
};

describe("DynamicVariantSelector", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    useGetSkuFromQueryMock.mockReturnValue(["SKU123", updateSkuMock]);

    useProdctDetailMock.mockReturnValue({
      attributes: {},
    });

    useProductListMock.mockReturnValue({
      products: [],
    });
  });

  it("returns nothing when there are no product attributes", () => {
    useProductListMock.mockReturnValue({
      products: [
        {
          sku: "SKU123",
          attributes: {},
        },
      ],
    });

    const { container } = renderComponent();

    expect(container.firstChild).toBeNull();
  });

  it("renders available attributes", () => {
    useProductListMock.mockReturnValue({
      products: [
        {
          sku: "SKU123",
          attributes: {
            color: "Black",
            size: "M",
          },
        },
      ],
    });

    renderComponent();

    expect(screen.getByText("Color")).toBeInTheDocument();
    expect(screen.getByText("Size")).toBeInTheDocument();
  });

  it("renders color options", () => {
    useProductListMock.mockReturnValue({
      products: [
        {
          sku: "SKU123",
          swatch: "/black.jpg",
          attributes: {
            color: "Black",
          },
        },
        {
          sku: "SKU456",
          swatch: "/white.jpg",
          attributes: {
            color: "White",
          },
        },
      ],
    });

    renderComponent();

    expect(screen.getByTitle("Black")).toBeInTheDocument();
    expect(screen.getByTitle("White")).toBeInTheDocument();

    expect(screen.getByAltText("Black")).toHaveAttribute("src", "/black.jpg");

    expect(screen.getByAltText("White")).toHaveAttribute("src", "/white.jpg");
  });

  it("renders size options", () => {
    useProductListMock.mockReturnValue({
      products: [
        {
          sku: "SKU123",
          attributes: {
            size: "M",
          },
        },
        {
          sku: "SKU456",
          attributes: {
            size: "L",
          },
        },
        {
          sku: "SKU789",
          attributes: {
            size: "S",
          },
        },
      ],
    });

    renderComponent();

    expect(screen.getByTitle("S")).toBeInTheDocument();
    expect(screen.getByTitle("M")).toBeInTheDocument();
    expect(screen.getByTitle("L")).toBeInTheDocument();
  });

  it("sorts standard sizes in size order", () => {
    useProductListMock.mockReturnValue({
      products: [
        {
          sku: "SKU1",
          attributes: {
            size: "XL",
          },
        },
        {
          sku: "SKU2",
          attributes: {
            size: "S",
          },
        },
        {
          sku: "SKU3",
          attributes: {
            size: "M",
          },
        },
        {
          sku: "SKU4",
          attributes: {
            size: "XS",
          },
        },
      ],
    });

    renderComponent();

    const options = [
      screen.getByTitle("XS"),
      screen.getByTitle("S"),
      screen.getByTitle("M"),
      screen.getByTitle("XL"),
    ];

    expect(options.map((option) => option.getAttribute("title"))).toEqual([
      "XS",
      "S",
      "M",
      "XL",
    ]);
  });

  it("sorts numeric sizes numerically", () => {
    useProductListMock.mockReturnValue({
      products: [
        {
          sku: "SKU1",
          attributes: {
            size: "12",
          },
        },
        {
          sku: "SKU2",
          attributes: {
            size: "8",
          },
        },
        {
          sku: "SKU3",
          attributes: {
            size: "10",
          },
        },
      ],
    });

    renderComponent();

    const options = [
      screen.getByTitle("8"),
      screen.getByTitle("10"),
      screen.getByTitle("12"),
    ];

    expect(options.map((option) => option.getAttribute("title"))).toEqual([
      "8",
      "10",
      "12",
    ]);
  });

  it("removes duplicate attribute values", () => {
    useProductListMock.mockReturnValue({
      products: [
        {
          sku: "SKU1",
          attributes: {
            color: "Black",
          },
        },
        {
          sku: "SKU2",
          attributes: {
            color: "Black",
          },
        },
        {
          sku: "SKU3",
          attributes: {
            color: "White",
          },
        },
      ],
    });

    renderComponent();

    expect(screen.getAllByTitle("Black")).toHaveLength(1);
    expect(screen.getAllByTitle("White")).toHaveLength(1);
  });

  it("supports attributes containing multiple values", () => {
    useProductListMock.mockReturnValue({
      products: [
        {
          sku: "SKU123",
          attributes: {
            size: ["S", "M", "L"],
          },
        },
      ],
    });

    renderComponent();

    expect(screen.getByTitle("S")).toBeInTheDocument();
    expect(screen.getByTitle("M")).toBeInTheDocument();
    expect(screen.getByTitle("L")).toBeInTheDocument();
  });

  it("shows the selected attribute value", () => {
    useProductListMock.mockReturnValue({
      products: [
        {
          sku: "SKU123",
          attributes: {
            color: "Black",
            size: "M",
          },
        },
      ],
    });

    useProdctDetailMock.mockReturnValue({
      attributes: {
        color: "Black",
        size: "M",
      },
    });
    renderComponent();
    const colorLabel = screen.getByText("Color").closest("label");
    const sizeLabel = screen.getByText("Size").closest("label");
    expect(colorLabel).toHaveTextContent("Black");
    expect(sizeLabel).toHaveTextContent("M");
  });

  it("uses the selected style for the selected option", () => {
    useProductListMock.mockReturnValue({
      products: [
        {
          sku: "SKU123",
          attributes: {
            size: "M",
          },
        },
      ],
    });

    useProdctDetailMock.mockReturnValue({
      attributes: {
        size: "M",
      },
    });

    renderComponent();

    expect(screen.getByTitle("M")).toHaveClass("option-item-selected");
  });

  it("updates SKU when a variant is selected", () => {
    useProductListMock.mockReturnValue({
      products: [
        {
          sku: "SKU123",
          attributes: {
            color: "Black",
          },
        },
        {
          sku: "SKU456",
          attributes: {
            color: "White",
          },
        },
      ],
    });

    renderComponent();

    fireEvent.click(screen.getByTitle("White"));

    expect(updateSkuMock).toHaveBeenCalledWith("SKU456");
  });

  it("selects the product matching the other selected attributes", () => {
    useProductListMock.mockReturnValue({
      products: [
        {
          sku: "BLACK-M",
          attributes: {
            color: "Black",
            size: "M",
          },
        },
        {
          sku: "BLACK-L",
          attributes: {
            color: "Black",
            size: "L",
          },
        },
        {
          sku: "WHITE-M",
          attributes: {
            color: "White",
            size: "M",
          },
        },
      ],
    });

    useProdctDetailMock.mockReturnValue({
      attributes: {
        color: "Black",
        size: "M",
      },
    });

    renderComponent();

    fireEvent.click(screen.getByTitle("L"));

    expect(updateSkuMock).toHaveBeenCalledWith("BLACK-L");
  });

  it("falls back to the first matching product when no exact combination exists", () => {
    useProductListMock.mockReturnValue({
      products: [
        {
          sku: "BLACK-M",
          attributes: {
            color: "Black",
            size: "M",
          },
        },
        {
          sku: "WHITE-M",
          attributes: {
            color: "White",
            size: "M",
          },
        },
        {
          sku: "WHITE-L",
          attributes: {
            color: "White",
            size: "L",
          },
        },
      ],
    });

    useProdctDetailMock.mockReturnValue({
      attributes: {
        color: "Black",
        size: "M",
      },
    });

    renderComponent();

    fireEvent.click(screen.getByTitle("White"));

    expect(updateSkuMock).toHaveBeenCalledWith("WHITE-M");
  });

  it("does not update SKU when the selected value does not exist", () => {
    useProductListMock.mockReturnValue({
      products: [
        {
          sku: "SKU123",
          attributes: {
            color: "Black",
          },
        },
      ],
    });

    renderComponent();

    const blackOption = screen.getByTitle("Black");

    fireEvent.click(blackOption);

    expect(updateSkuMock).toHaveBeenCalledWith("SKU123");
  });

  it("handles shade as a color-like attribute", () => {
    useProductListMock.mockReturnValue({
      products: [
        {
          sku: "SKU123",
          swatch: "/navy.jpg",
          attributes: {
            shade: "Navy",
          },
        },
      ],
    });

    renderComponent();

    expect(screen.getByTitle("Navy")).toBeInTheDocument();
    expect(screen.getByAltText("Navy")).toHaveAttribute("src", "/navy.jpg");
  });
});
