import { ProductListItem } from "@/types/product";

export type PRODUCTS_ACTION =
  | "APPEND_PRODUCT"
  | "REPLACE_PRODUCT"
  | "CLEAR_PRODUCT"
  | "LOADING_PRODUCT";

export type PRODUCT_LOADING_STATUS = "idle" | "loading" | "success";

export type ProductsAction = {
  type: PRODUCTS_ACTION;
  payload: ProductListItem[];
};

export type ProductsState = {
  products: ProductListItem[];
  status: PRODUCT_LOADING_STATUS;
};

export const productsInitialState: ProductsState = {
  products: [],
  status: "idle",
};

export const productsReducer = (
  state: ProductsState,
  { type, payload }: ProductsAction,
): ProductsState => {
  switch (type) {
    case "LOADING_PRODUCT": {
      return { products: state.products, status: "loading" };
    }
    case "APPEND_PRODUCT": {
      return { products: [...state.products, ...payload], status: "success" };
    }
    case "REPLACE_PRODUCT": {
      return { products: payload, status: "success" };
    }
    case "CLEAR_PRODUCT": {
      return { products: [], status: "success" };
    }
    default: {
      return state;
    }
  }
};
