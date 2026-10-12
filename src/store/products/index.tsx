import { createContext, useContext, useReducer } from "react";
import { getProductsFromSessionStorage } from "@/utils/product";
import {
  productsInitialState,
  productsReducer,
  type ProductsState,
} from "./reducer";

const dataContext = createContext<ProductsState>(productsInitialState);
const dispatchContext = createContext(null);

export const useProducts = () => {
  return useContext(dataContext);
};

export const useProductsDispatch = () => {
  return useContext(dispatchContext);
};

export {
  productsReducer,
  productsInitialState,
} from "./reducer";
export type {
  PRODUCTS_ACTION,
  PRODUCT_LOADING_STATUS,
  ProductsAction,
  ProductsState,
} from "./reducer";

const ProductsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(productsReducer, productsInitialState, (_) => {
    const prevProducts = getProductsFromSessionStorage();
    if (prevProducts) {
      return {
        products: JSON.parse(prevProducts),
        status: "success",
      };
    }
    return productsInitialState;
  });

  return (
    <dataContext.Provider value={state}>
      <dispatchContext.Provider value={dispatch}>
        {children}
      </dispatchContext.Provider>
    </dataContext.Provider>
  );
};

export default ProductsProvider;
