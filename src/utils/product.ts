import { PRODUCT_PREFIX } from "@/config";
import { getSession } from "./session";
import { ProductListItem } from "@/types/product";

const genProductsID = () => {
  const sessionID = getSession();
  if (!sessionID) {
    return null;
  }
  return `${PRODUCT_PREFIX}-${sessionID}`;
};

export const getProductsFromSessionStorage = () => {
  const productID = genProductsID();
  const existingProducts = sessionStorage.getItem(productID);
  return existingProducts;
};

export const saveProductToSessionStorage = (product: ProductListItem[]) => {
  const productID = genProductsID();
  if (!productID) {
    return;
  }

  sessionStorage.setItem(productID, JSON.stringify(product));
};
