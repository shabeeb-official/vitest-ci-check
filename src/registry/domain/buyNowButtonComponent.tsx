import { useProdctDetail } from "@/store/product-detail";
import BuyNowButton from "./buyNowButton";
import BuyNowPayLater from "./buyNowPayLater";

type BuyNowButtonProps = {
  label: string;
  buttonIsPendingStyle: string;
  buttonStyle: string;
  buttonNormalStyle: string;
};

export const BuyNowButtonComponent = (props: BuyNowButtonProps) => {
  const { label, buttonIsPendingStyle, buttonStyle, buttonNormalStyle } = props;
  const product = useProdctDetail();
  return (
    <BuyNowButton
      buttonIsPendingStyle={buttonIsPendingStyle}
      buttonStyle={buttonStyle}
      buttonNormalStyle={buttonNormalStyle}
      label={label}
      name={product.title}
    />
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
