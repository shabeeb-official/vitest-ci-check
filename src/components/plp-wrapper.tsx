import { useLayout } from "@/contexts/layoutContext";
import useGoToDetails from "@/hooks/use-goto-details";
import useFilterProducts from "@/hooks/use-filter-products";
import { ReactNode } from "react";

type Props = ReactNode;

const ProductDisplay = ({ children }: { children: Props }) => {
  const goToProduct = useGoToDetails();

  const { sideBarExpanded } = useLayout();

  const filteredProducts = useFilterProducts();

  return (
    <div id="category-recs" className="p-3 w-full h-full max-md:h-screen">
      <div className="mx-auto">
        <div className="mb-6">
           {children}
        </div>
      </div>
    </div>
  );
};

export default ProductDisplay;
