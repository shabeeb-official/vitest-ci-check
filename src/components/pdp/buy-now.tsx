import { useProdctDetail, useProductQuantity } from "@/store/product-detail";
import BuyNowButton from "../product-page/buy-now-button";
import BuyNowPayLater from "../product-page/buy-now-pay-later";

type BuyNowButtonProps = {
  buttonWrapperStyle: string;
  label: string;
  buttonIsPendingStyle: string;
  buttonStyle: string;
  buttonNormalStyle: string;
};

export const BuyNowButtonComponent = (props: BuyNowButtonProps) => {
  const {
    buttonWrapperStyle,
    label,
    buttonIsPendingStyle,
    buttonStyle,
    buttonNormalStyle,
  } = props;
  const product = useProdctDetail();
  const quantity = useProductQuantity();

  return (
    <div className={buttonWrapperStyle}>
      <BuyNowButton
        buttonIsPendingStyle={buttonIsPendingStyle}
        buttonStyle={buttonStyle}
        buttonNormalStyle={buttonNormalStyle}
        label={label}
        name={product.title}
        qty={quantity}
      />
    </div>
  );
};

type BuyNowPayLaterProps = {
  label: string;
  buyNowPayLaterLabelStyle: string;
  paymentMethods?: any[];
  wrapperClassName?: string;
};

export const BuyNowPayLaterComponent = (props: BuyNowPayLaterProps) => {
  const { label, buyNowPayLaterLabelStyle, paymentMethods, wrapperClassName } =
    props;
  return (
    <BuyNowPayLater
      labelStyle={buyNowPayLaterLabelStyle}
      label={label}
      paymentMethods={paymentMethods}
      wrapperClassName={wrapperClassName}
    />
  );
};
