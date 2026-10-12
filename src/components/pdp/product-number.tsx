import { useProdctDetail } from "@/store/product-detail";

export const ProductNumberComponent = ({
  infoSectionStyle = "",
  infoTextStyle = "",
}: {
  infoSectionStyle?: string;
  infoTextStyle?: string;
}) => {
  const product = useProdctDetail();
  return (
    <div className={infoSectionStyle}>
      <p className={infoTextStyle}>Item Number: {product.sku}</p>
    </div>
  );
};
