import useGetSkuFromQuery from "@/hooks/use-get-sku-from-query";
import { compareSizes } from "@/utils/sort-sizes";
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
  sizeItemStyle: string;
  sizeItemSelectedStyle: string;
  sizeObject: any;
};

export const SizeSelector = (props: SizeSelectorProps) => {
  const { sizeItemStyle, sizeItemSelectedStyle, sizeObject } = props;
  const [sku, updateSku] = useGetSkuFromQuery();

  const sizes = useMemo(() => {
    if (sku === null) return [];
    const values = Object.values(sizeObject);
    return findSelectedProduct(values, sku).sort(compareSizes);
  }, [sku, sizeObject]);

  return sizes?.map(({ id, size: label }: any) => {
    const isSelected = id === sku;
    const style = clsx(sizeItemStyle, isSelected ? sizeItemSelectedStyle : "");

    return (
      <div
        onClick={() => updateSku(id)}
        key={id}
        aria-label={`Select ${label} size`}
        className={style}
      >
        {label}
      </div>
    );
  });
};
