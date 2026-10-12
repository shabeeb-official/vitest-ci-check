import useGetSkuFromQuery from "@/hooks/use-get-sku-from-query";
import { Product } from "@/types/product";
import { useEffect, useRef } from "react";
import { nextSku, ResolvedVariant } from "../resolve-variants";

export const typeMaps: Record<string, string> = {
  colors: "color",
  size: "size",
  length: "length",
};

function useVariantSelect(variant: Product, resolved: ResolvedVariant[]) {
  const [_, updateSku] = useGetSkuFromQuery();
  const currntVariantType = useRef<string>(null);

  useEffect(() => {
    const handleVariantSelected = (event: Event) => {
      const customEvent = event as CustomEvent<{
        type: string;
        name: string;
      }>;

      const { type, name } = customEvent.detail;
      const axis = typeMaps[type] ?? type;
      const selectedAxes =
        resolved.find((item) => item.sku === variant.sku)?.axes ?? {};
      const sku = nextSku(resolved, selectedAxes, axis, name);

      if (sku) {
        updateSku(sku);
        currntVariantType.current = type;
      }
    };

    document.addEventListener("variant:selected", handleVariantSelected);

    return () => {
      document.removeEventListener("variant:selected", handleVariantSelected);
    };
  }, [resolved, updateSku, variant.sku]);

  return currntVariantType;
}

export default useVariantSelect;
