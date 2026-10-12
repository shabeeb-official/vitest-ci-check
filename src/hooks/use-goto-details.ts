import { PATHS } from "@/paths";
import { Query } from "@/types/req-resonse";
import { startTransition } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

const useGoToDetails = () => {
  const outletContext: React.MutableRefObject<HTMLElement> = useOutletContext();
  const navigate = useNavigate();
  const goToProduct = (id: string, query: Query) => {
    startTransition(() => {
      if (!outletContext.current) return;
      outletContext.current.scroll({
        top: 0,
        behavior: "smooth",
      });
      navigate(PATHS.products.view(id, query));
    });
  };

  return goToProduct;
};

export default useGoToDetails;
