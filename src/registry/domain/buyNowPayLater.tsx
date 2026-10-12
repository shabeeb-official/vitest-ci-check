type PaymentMethod = {
  name: string;
  src: string;
  className?: string;
};

const BuyNowPayLater = ({
  label = "buy now pay later",
  labelStyle = "capitalize font-semibold mb-2",
  paymentMethods = [],
  wrapperClassName = "w-full flex flex-wrap gap-2",
}: {
  label?: string;
  labelStyle?: string;
  paymentMethods?: PaymentMethod[];
  wrapperClassName?: string;
}) => {
  return (
    <div className="my-3">
      <p className={labelStyle}>{label}</p>
      <div className={wrapperClassName}>
        {paymentMethods.map((method) => (
          <img
            key={method.name}
            className={method.className || "w-[80px] h-[35px]"}
            src={method.src}
            alt={method.name}
          />
        ))}
      </div>
    </div>
  );
};

export default BuyNowPayLater;
