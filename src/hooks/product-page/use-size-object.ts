import { useProductList } from "@/pages/ProductPage";
import { useMemo } from "react";

const useSizeObject = () => {
  const { products } = useProductList();
  const sizeObject = useMemo(() => {
    const temp = {};
    products?.forEach((product) => {
      if (product.swatchName == "") {
        return;
      }
      if (temp[product.swatchName]) {
        temp[product.swatchName] = {
          ...temp[product.swatchName],
          sizes: [
            ...temp[product.swatchName].sizes,
            { id: product.sku, size: product.sizes[0] },
          ],
        };
      } else {
        temp[product.swatchName] = {
          src: product.swatch,
          sizes: [{ id: product.sku, size: product.sizes[0] }],
        };
      }
    });
    return temp;
  }, [products]);

  return sizeObject;
};

export default useSizeObject;
