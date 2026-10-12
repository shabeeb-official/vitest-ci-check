import ProductDetailDescription from "../product-page/description";
import { Details } from "../product-page/details";

export const ProductDescriptionComponent = ({
  productDescriptionTextStyle,
}: {
  productDescriptionTextStyle: string;
}) => {
  return <ProductDetailDescription textStyle={productDescriptionTextStyle} />;
};

export const ProductMoreDetailsComponent = ({
  moreDetailsLabel,
  moreDetailsStyle,
}: {
  moreDetailsLabel: string;
  moreDetailsStyle: any;
}) => {
  return (
    <Details
      moreDetailsStyle={moreDetailsStyle}
      moreDetailsLabel={moreDetailsLabel}
    />
  );
};
