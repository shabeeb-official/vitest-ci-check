import RecomendedProducts from "./recomendedProduct";

type RecommendedProductsComponentProps = {
  children?: any;
  sku: string;
  recommendedProductsLabel?: string;
  recommendedProductsLabelStyle?: string;
};

export const RecommendedProductsComponent = ({
  children,
  sku,
  recommendedProductsLabel = "You might also like",
  recommendedProductsLabelStyle = "text-2xl font-medium mb-6",
}: RecommendedProductsComponentProps) => {

  return (
    <>
      {children}
      <RecomendedProducts
        recommendedProductsLabelStyle={recommendedProductsLabelStyle}
        recommendedProductsLabel={recommendedProductsLabel}
        currentProductId={sku}
      />
    </>
  );
};

export default RecommendedProductsComponent;
