import { LoadingStatus } from "@/pages/ProductPage";
import { Product, SizeObject } from "@/types/product";
import { useState, useEffect } from "react";

const useGetSize = (products: Product[], loadingStatus: LoadingStatus) => {
  const [sizeObject, setSizeObject] = useState<SizeObject>({});

  useEffect(() => {
    if (loadingStatus === "success") {
      const temp: SizeObject = {};
      products.map((product: Product) => {
        product.colors.forEach((color) => {
          if (temp[color]) {
            temp[color].sizes = [
              ...temp[color].sizes,
              ...product.sizes.map((size: string) => ({
                id: product.sku,
                label: size,
              })),
            ];
          } else {
            temp[color] = {
              id: product.sku,
              label: color,
              sizes: product.sizes.map((size: string) => ({
                id: product.sku,
                label: size,
              })),
            };
          }
        });
      });
      setSizeObject(temp);
    }
  }, [products, loadingStatus]);

  return sizeObject;
};

export default useGetSize;
