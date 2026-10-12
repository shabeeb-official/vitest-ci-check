import { Product } from "@/types/product";
import { defaultDetailData } from "@/hooks/product-page/use-serialize-product";

export type PRODUCT_DETAIL_ACTION = "LOAD_PRODUCT" | "SET_QUANTITY";

export type ProductDetailAction =
  | { type: "LOAD_PRODUCT"; payload: Product }
  | { type: "SET_QUANTITY"; payload: number }
  | { type: string; payload?: unknown };

export type ProductDetailState = {
  product: Product;
  quantity: number;
};

export const productDetailInitialState: ProductDetailState = {
  product: defaultDetailData,
  quantity: 1,
};

export const productDetailReducer = (
  state: ProductDetailState,
  action: ProductDetailAction,
): ProductDetailState => {
  switch (action.type) {
    case "LOAD_PRODUCT": {
      return { ...state, product: action.payload as Product };
    }
    case "SET_QUANTITY": {
      return { ...state, quantity: action.payload as number };
    }
    default: {
      return state;
    }
  }
};
