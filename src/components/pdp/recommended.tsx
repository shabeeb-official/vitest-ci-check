import RecomendedProducts from "@/components/product-page/recomended-products";
import { useProdctDetail } from "@/store/product-detail";

type RecommendedProductsComponentProps = {
  children?: any;
  recommendedProductsLabel?: string;
  recommendedProductsLabelStyle?: string;
};

const RecommendedProductsComponent = ({ 
  children,
  recommendedProductsLabel = "You might also like",
  recommendedProductsLabelStyle = "text-2xl font-medium mb-6"
}: RecommendedProductsComponentProps) => {
  const product = useProdctDetail();

  return (
    <>
      {children}
      <RecomendedProducts recommendedProductsLabelStyle={recommendedProductsLabelStyle} recommendedProductsLabel={recommendedProductsLabel}  currentProductId={product.sku} />
    </>
  );
};

export default RecommendedProductsComponent;
