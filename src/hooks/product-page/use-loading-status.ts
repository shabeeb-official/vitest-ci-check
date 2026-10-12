import { LoadingStatus } from "@/store/product-detail";
import { Product } from "@/types/product";
import { QueryStatus } from "@tanstack/react-query";
import { useMemo } from "react";

const useLoadingStatus = (products: Product[], status: QueryStatus) => {
  const loadingStatus: LoadingStatus = useMemo(() => {
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
  }, [products, status]);

  return loadingStatus;
};

export default useLoadingStatus;
