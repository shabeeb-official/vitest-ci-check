import { useProdctDetail } from "@/store/product-detail";
import Currency from "../currency";
import { ShoppingCart } from "lucide-react";
import useAddToCart from "@/hooks/use-add-cart";
import { useCallback } from "react";

const MobilePrice = () => {
  const { price, title } = useProdctDetail();
  const { mutate, isPending } = useAddToCart(title);

  const onAddToCart = useCallback(() => {
    if (isPending) {
      return;
    }
    mutate({
      qty: 1,
      opts: "[]",
    });
  }, [mutate, isPending]);

  if (!price) return null;

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex flex-col gap-1">
        <p className="capitalize text-xs font-light">total price</p>
        <p className="text-lg font-semibold">
          <Currency>{price}</Currency>
        </p>
      </div>
      <div className="flex items-center gap-2">
        <div className="bg-[#f8e300] p-2 rounded-md">
          <ShoppingCart />
        </div>
        <button
          className="capitalize bg-accent rounded-lg text-white py-2 px-4"
          onClick={onAddToCart}
        >
          buy now
        </button>
      </div>
    </div>
  );
};

export default MobilePrice;
