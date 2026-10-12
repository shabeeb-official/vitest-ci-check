import useExpandableText from "@/hooks/use-expandable-text";
import { useProdctDetail } from "@/store/product-detail";
import { Render } from "../conditional";
import ExpandableTextOption from "../expandable-text-option";

const ProductDetailDescription = (
  {textStyle = "text-[#585858] text-[0.875rem]"}:{textStyle?: string}
) => {
  const product = useProdctDetail();
  if (!product?.description) {
    return null;
  }
  const { text, toggle, isOpen } = useExpandableText(product.description);
  return (
    <div className="inline">
      <p className={textStyle}>
        {text}
        <span className="capitalize cursor-pointer" onClick={toggle}>
          <Render
            when={isOpen}
            show={<ExpandableTextOption label="less" />}
            otherwise={<ExpandableTextOption label="read more" />}
          />
        </span>
      </p>
    </div>
  );
};

export default ProductDetailDescription;
