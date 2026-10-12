import { SizeObject } from "@/types/product";
import RenderLoop from "@/components/render-loop";
import RenderComponents from "@/utils/render-components";
import { pdpRegistry } from "./pdpRegistry";
import { useProdctDetail } from "@/store/product-detail";
import { useEffect } from "react";
import { addUserContext, clearUserContext } from "@/utils/user-context";

type ProductDetailWrapperProps = {
  sizeObject: SizeObject;
  detailColumnStyle: string;
  nested?: any[];
};

const ProductDetail = ({
  detailColumnStyle,
  nested,
}: ProductDetailWrapperProps) => {
  const product = useProdctDetail();


  useEffect(() => {
    if (product.sku) {
      addUserContext(
        {
          sku: product.sku,
          brand: product.brand,
          name: product.title,
          color: product.colors[0],
          pdp_context_attributes: product.pdp_context_attributes
        },
        { page: "PDP" },
      );
    }
    return () => {
      clearUserContext();
    };
  }, [product]);
  return (
    <div className={detailColumnStyle}>
      <div>
        <RenderLoop
          list={nested}
          render={(item: any) => (
            <RenderComponents
              item={item}
              registry={pdpRegistry}
              runtimeScope={{}}
            />
          )}
        />
      </div>
    </div>
  );
};

export default ProductDetail;
