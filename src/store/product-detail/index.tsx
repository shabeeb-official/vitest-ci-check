import { createContext, useContext, useReducer } from "react";
import { Product } from "@/types/product";
import { defaultDetailData } from "@/hooks/product-page/use-serialize-product";
import {
  productDetailInitialState,
  productDetailReducer,
} from "./reducer";

export type LoadingStatus = "loading" | "success" | "empty" | "failed" | "idle";

const dataContext = createContext<Product>(defaultDetailData);
const dispatchContext = createContext<React.Dispatch<any> | null>(null);
const quantityContext = createContext<number>(1);

export {
  productDetailReducer,
  productDetailInitialState,
} from "./reducer";
export type {
  PRODUCT_DETAIL_ACTION,
  ProductDetailAction,
  ProductDetailState,
} from "./reducer";

const ProductProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(
    productDetailReducer,
    productDetailInitialState,
  );

  return (
    <dataContext.Provider value={state.product}>
      <quantityContext.Provider value={state.quantity}>
        <dispatchContext.Provider value={dispatch}>
          {children}
        </dispatchContext.Provider>
      </quantityContext.Provider>
    </dataContext.Provider>
  );
};

export const useProdctDetail = () => useContext(dataContext);
export const useProductQuantity = () => useContext(quantityContext);
export const useProdctDetailDispatch = () => useContext(dispatchContext);

export default ProductProvider;
