import { customEvent } from "@/utils/events";
import React, { ReactNode } from "react";

type VariantItemProps = {
  children: ReactNode;
  type: string;
  className: string;
  isSelectedStyle?: string;
  name: string;
  object?: any;
  selectedVariant?: string;
};

const PdpProductSelector = (props: VariantItemProps) => {
  const { children, type, className, name, selectedVariant, isSelectedStyle } =
    props;
  if (!selectedVariant) return null;
  const onSelect = () => {
    customEvent.publish("variant:selected", {
      type,
      name,
    });
  };

  return (
    <div
      onClick={onSelect}
      className={name === selectedVariant ? isSelectedStyle : className}
    >
      {children}
    </div>
  );
};

export default PdpProductSelector;
