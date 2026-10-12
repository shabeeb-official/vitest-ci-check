import { useCallback } from "react";
import { TENANT_NAME, TENANT_PLATFORM } from "@/config";
import debug from "debug";
import { useMutation } from "@tanstack/react-query";
import { addToCartEvent } from "@/utils/gtm_events";
import cartApi from "@/utils/api/cart";
import { AddToCartPayload } from "@/types/cart";
import cartUtils from "@/utils/cart";
import platforms from "@/utils/platforms";
import clients from "@/utils/clients";
import { useRegion } from "@/contexts/layoutContext";

const log = debug("app:Chat");

const useAddToCart = (name: string) => {
  const region = useRegion();
  const addToCart = useCallback(
    async ({ qty, sku }: AddToCartPayload) => {
      if (!sku) {
        console.error("SKU missing");
        return;
      }

      if (platforms.shopify.isActive(TENANT_PLATFORM)) {
        cartApi.shopifyAddToCart("/cart/add.js", { qty, sku, name });
      }

      console.log("add to cart region: ", region);
      if (platforms.salesforce.isActive(TENANT_PLATFORM)) {
        const URI = cartUtils.getURI(cartUtils.getRoddAndGunnURIS(), region);
        console.log("Add to cart URI: ", URI);

        if (!URI) {
          return;
        }

        const data = await cartApi.salesForceAddToCart(URI, {
          qty,
          sku,
          cartAction: "add",
          preferredStoreId: "",
        });

        if (data) {
          addToCartEvent(name, sku);
          if (clients.roddGunn.isActive(TENANT_NAME)) {
            window.refreshCart(name);
          } else {
            window.handlePostCartAdd(data, sku, false);
          }
        }
      }
    },
    [name, region],
  );

  return useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      log("[INFO] successfully added to cart");
    },
    onError: (error) => {
      log("[ERROR] add to cart failed", error);
    },
  });
};

export default useAddToCart;
