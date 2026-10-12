import { DEMO_MODE } from "@/config";
import useAddToCart from "@/hooks/use-add-cart";
import clsx from "clsx";
import { useCallback, useMemo } from "react";
import { useProductQuantity } from "@/store/product-detail";
import { useSearchParams } from "react-router-dom";

type Props = {
  name: string;
  label: string;
  buttonStyle?: string;
  buttonIsPendingStyle?: string;
  buttonNormalStyle?: string;
};

const BuyNowButton = (props: Props) => {
  const {
    name,
    label,
    buttonStyle = "capitalize  rounded-full  px-[20px] py-[15px] w-full",
    buttonIsPendingStyle = "cursor-progress bg-gray-400 text-gray-500",
    buttonNormalStyle = "bg-accent text-white",
  } = props;
  if (DEMO_MODE) {
    return null;
  }
  const { mutate, isPending } = useAddToCart(name);
  const qty = useProductQuantity();

  const [search] = useSearchParams();
  const sku = search.get("sku");

  const handleAddCart = useCallback(() => {
    if (isPending) {
      return;
    }
    mutate({
      qty,
      sku,
      opts: "[]",
    });
  }, [mutate, isPending, qty, sku]);

  const style = useMemo(() => {
    return clsx(
      buttonStyle,
      isPending ? buttonIsPendingStyle : buttonNormalStyle,
    );
  }, [isPending]);

  return (
    <div className="flex gap-2 flex-row max-sm:flex-col">
      <button className={style} onClick={handleAddCart}>
        {label}
      </button>
    </div>
  );
};

export default BuyNowButton;
