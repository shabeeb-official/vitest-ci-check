import useSizeObject from "@/hooks/product-page/use-size-object";
import useGetSkuFromQuery from "@/hooks/use-get-sku-from-query";
import { compareSizes } from "@/utils/sort-sizes";
import { Label } from "@radix-ui/react-label";
import clsx from "clsx";
import { useMemo } from "react";

const findSelectedProduct = (values = [], sku: string) => {
  for (let i = 0; i < values.length; i++) {
    const sizes = values[i].sizes || [];
    const found = sizes.find(({ id }) => id === sku);
    if (found) {
      return sizes;
    }
  }
  return [];
};

type SizeSelectorProps = {
  sizeSectionStyle: string;
  sizeLabelStyle: string;
  sizeGridStyle: string;
  sizeItemStyle: string;
  sizeItemSelectedStyle: string;
  sizeLabel: string;
  showSelectedSize: boolean;
};

export const SizeSelector = (props: SizeSelectorProps) => {
  const {
    sizeSectionStyle,
    sizeLabelStyle,
    sizeGridStyle,
    sizeItemStyle,
    sizeItemSelectedStyle,
    sizeLabel,
    showSelectedSize,
  } = props;
  const sizeObject = useSizeObject();
  const [sku, updateSku] = useGetSkuFromQuery();
  const sizes = useMemo(() => {
    if (!sku) return [];
    const values = Object.values(sizeObject);
    // return findSelectedProduct(values, sku).sort(compareSizes);

    const foundSizes = findSelectedProduct(values, sku).sort(compareSizes);

    // Deduplicate sizes by their size value to avoid duplicates across different SKU IDs
    const seen = new Set();
    return foundSizes.filter(({ size }) => {
      if (seen.has(size)) return false;
      seen.add(size);
      return true;
    });
  }, [sku, sizeObject]);
  const selectedSize = sizes?.find((s) => s.id === sku)?.size;
  return (
    <div className={sizeSectionStyle}>
      <Label className={sizeLabelStyle}>
        {sizeLabel}
        {showSelectedSize && selectedSize && (
          <span className="ml-2 font-medium text-sm text-[#1A1A1A]">
            {selectedSize}
          </span>
        )}
      </Label>
      <div className={sizeGridStyle}>
        {sizes?.map(({ id, size: label }: any) => {
          const isSelected = id === sku;
          const style = clsx(
            sizeItemStyle,
            isSelected ? sizeItemSelectedStyle : "",
          );
          return (
            <div
              onClick={() => updateSku(id)}
              key={id}
              aria-label={`Select ${label} size`}
              className={style}
              // style={{
              //   background: "none",
              //   color: "black",
              // }}
            >
              {label}
            </div>
          );
        })}
      </div>
    </div>
  );
};
