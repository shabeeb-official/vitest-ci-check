import {
  extractAndParseImagesFromProduct,
  getActiveProductVariant,
  preloadImages,
} from "./pdp/image-helpers";
import useAddToCart from "@/hooks/use-add-cart";
import useGetProductById from "@/hooks/use-get-product-by-id";
import { useIsMobileWidth } from "@/hooks/use-mobile-width";
import { composeRegistry, domainRegistry, genericRegistry } from "@/registry";
import { LoadingStatus, useProdctDetailDispatch } from "@/store/product-detail";
import { Product } from "@/types/product";
import { selectItem } from "@/utils/gtm_events";
import { renderNodeList } from "@/utils/render-ui";
import { useEffect, useMemo, useState } from "react";
import useVariantSelect from "./pdp/hooks/use-variant-select";
import useGetSkuFromQuery from "@/hooks/use-get-sku-from-query";
import { QueryStatus } from "@tanstack/react-query";
import { getActiveClientConfig } from "@/utils/clients";
import {
  buildAxisOptions,
  ResolvedVariant,
  resolveVariants,
} from "./pdp/resolve-variants";

function extractImageUrl(imageString: string) {
  if (!imageString) {
    return [];
  }

  return imageString
    .split(",")
    .slice(0, 4)
    .map((item) => ({
      url: item.trim(),
    }));
}

function getLoadingStatus(products: Product[], status: QueryStatus) {
  if (status === "success") {
    if (products?.length === 0) {
      return "empty";
    }
    return "success";
  }

  if (status === "error") {
    return "failed";
  }
  return "loading";
}

function V2PDP() {
  const variants = useGetProductById();
  const [sku] = useGetSkuFromQuery();
  const variantList = variants.data ?? [];
  const resolved = useMemo(() => resolveVariants(variantList), [variantList]);

  const loadingStatus = getLoadingStatus(variantList, variants.status);
  const variant = getActiveProductVariant(variantList, sku);
  const images = extractAndParseImagesFromProduct(variant);

  useEffect(() => {
    preloadImages(images);
  }, [images]);

  useVariantSelect(variant, resolved);

  return (
    <VariantDisplay
      variant={variant}
      resolved={resolved}
      loadingStatus={loadingStatus}
    />
  );
}

type VariantDisplayProps = {
  variant: Product;
  resolved: ResolvedVariant[];
  loadingStatus: LoadingStatus;
};

function VariantDisplay(props: VariantDisplayProps) {
  const layouts = getActiveClientConfig();
  const { variant, resolved, loadingStatus } = props;
  const selectedAxes = useMemo(
    () => resolved.find((item) => item.sku === variant.sku)?.axes ?? {},
    [resolved, variant.sku],
  );
  const axisOptions = useMemo(
    () => buildAxisOptions(resolved, selectedAxes),
    [resolved, selectedAxes],
  );
  const dispatch = useProdctDetailDispatch();

  useEffect(() => {
    if (variant?.sku && dispatch) {
      dispatch({ type: "LOAD_PRODUCT", payload: variant });
    }
  }, [variant, dispatch]);

  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);

  const isMobileView = useIsMobileWidth();
  const { mutate, isPending } = useAddToCart(variant.title);

  useEffect(() => {
    selectItem(variant.title, variant.sku);
  }, [variant]);

  useEffect(() => {
    const handleQuantitySelected = (event: Event) => {
      const customEvent = event as CustomEvent<{
        quantity: "+" | "-";
      }>;

      const { quantity } = customEvent.detail;

      setSelectedQuantity((prev) => {
        if (quantity === "+") {
          return prev + 1;
        }

        return Math.max(1, prev - 1);
      });
    };

    const handleQuantityChange = (event: Event) => {
      const customEvent = event as CustomEvent<{
        value: string;
      }>;

      const nextValue = Number(customEvent.detail.value);

      if (Number.isNaN(nextValue) || nextValue < 1) {
        return;
      }

      setSelectedQuantity(nextValue);
    };

    document.addEventListener("quantity:selected", handleQuantitySelected);

    document.addEventListener("quantity:change", handleQuantityChange);

    return () => {
      document.removeEventListener("quantity:selected", handleQuantitySelected);

      document.removeEventListener("quantity:change", handleQuantityChange);
    };
  }, []);

  const runtimeScope = {
    sku: variant.sku,
    brand: variant.brand,
    title: variant.title,
    sale_price: variant.sale_price,
    price: variant.price,
    swatchName: variant.swatchName,
    description: variant.description,
    pattern: variant.pattern,
    images: extractImageUrl(variant.imageUrl),
    colorOption: axisOptions.color ?? [],
    sizeOption: (axisOptions.size ?? []).filter((option) => !option.disabled),
    lengthOption: axisOptions.length ?? [],
    selectedColor: selectedAxes.color ?? "",
    selectedLength: selectedAxes.length ?? "",
    selectedSize: selectedAxes.size ?? "",
    selectedQuantity,
    isMobileView,
    loading_status: loadingStatus,
    handleSubmit: () => {
      if (isPending) {
        return;
      }
      mutate({
        qty: selectedQuantity,
        sku: variant?.id,
        opts: "[]",
      });
    },
  };

  const view = renderNodeList(layouts.layouts.pdp.layout, {
    registry: composeRegistry(genericRegistry, domainRegistry),
    runtimeScope,
  });

  return (
    <div className="h-full min-h-0 w-full flex-1 overflow-y-auto">{view}</div>
  );
}

export default V2PDP;
