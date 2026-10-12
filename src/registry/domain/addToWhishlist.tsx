import useWishlist from "@/hooks/use-add-favorites";
import { INode, renderNodeList } from "@/utils/render-ui";
import React, { ReactNode } from "react";
import { composeRegistry, domainRegistry, genericRegistry } from "@/registry";
interface AddToWhishlistProps {
  productId: string;
  isAdded: string;
  isDefault: string;
  className?: string;
}

function AddToWishlist(props: AddToWhishlistProps) {
  const { productId, isAdded, className, isDefault } = props;
  const { checked, addToWishlist, removeFromWishlist } = useWishlist();
  const renderTriggerForAddedProduct = (isAdded: string | INode) => {
    if (typeof isAdded === "string") {
      return isAdded;
    }

    return renderNodeList(isAdded, {
      registry: composeRegistry(genericRegistry, domainRegistry),
      runtimeScope: {},
    });
  };
  const renderTriggerForDefaultProduct = (isDefault: string | INode) => {
    if (typeof isDefault === "string") {
      return isDefault;
    }

    return renderNodeList(isDefault, {
      registry: composeRegistry(genericRegistry, domainRegistry),
      runtimeScope: {},
    });
  };

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        if (checked) {
          removeFromWishlist(productId);
        } else {
          addToWishlist(productId);
        }
      }}
      className={className}
    >
      {checked
        ? renderTriggerForAddedProduct(isAdded)
        : renderTriggerForDefaultProduct(isDefault)}
    </div>
  );
}

export default AddToWishlist;
