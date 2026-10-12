import { customEvent } from "@/utils/events";
import React, { ReactNode } from "react";

type QuantitySelectorProps = {
  children: ReactNode;
  quantity: "+" | "-";
  className?: string;
};

const QuantitySelector = (props: QuantitySelectorProps) => {
  const { children, quantity, className } = props;
  const onSelect = () => {
    customEvent.publish("quantity:selected", {
      quantity,
    });
  };

  return (
    <div onClick={onSelect} className={className}>
      {children}
    </div>
  );
};

export default QuantitySelector;
