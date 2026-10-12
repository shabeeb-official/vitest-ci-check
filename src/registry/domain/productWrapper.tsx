import useGoToDetails from "@/hooks/use-goto-details";

type ProductWrapperProps = {
  skuId: string;
  id: string;
  brand: string;
  children: React.ReactNode;
  className?: string;
};

const ProductWrapper = (props: ProductWrapperProps) => {
  const { children, className, skuId, id, brand } = props;
  const goToProduct = useGoToDetails();
  const handleProductClick = () => {
    if (!id) {
      return;
    }

    goToProduct(id, {
      brand: brand,
      sku: skuId,
    });
  };
  return (
    <div className={className} onClick={handleProductClick}>
      {children}
    </div>
  );
};

export default ProductWrapper;

// const navigateToProduct = (product: any) => {
//   selectItem(product.title, product.sku);

//   goToProduct(product.id, {
//     brand: product.brand,
//     sku: product.sku,
//   });
// };
