import React from "react";

type Props = {
  children: React.ReactNode;
  sku: string;
};

function ProductSizeSelectHandler({ children, sku }: Props) {
  const handelSkuIdSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return <div onClick={handelSkuIdSelection}>{children}</div>;
}

export default ProductSizeSelectHandler;
