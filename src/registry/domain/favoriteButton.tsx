import { Heart } from "lucide-react";
import useWishlist from "@/hooks/use-add-favorites";
import clsx from "clsx";
import { DEMO_MODE } from "@/config";

const FavoriteButton = ({
  sku,
  position = "absolute",
  styles,
}: {
  sku: string | { sku?: string };
  position?: "absolute" | "relative" | "static";
  styles?: any;
}) => {
  const { checked, addToWishlist, removeFromWishlist } = useWishlist();
  const actualSku = typeof sku === "string" ? sku : sku?.sku;

  if (DEMO_MODE) {
    return null;
  }

  return (
    <div
      className={clsx(
        styles?.favorite ??
          "cursor-pointer right-2 top-2 z-1 rounded-[50%] p-1",
        position,
      )}
      onClick={(e) => {
        e.stopPropagation();
        if (checked) {
          removeFromWishlist(actualSku);
        } else {
          addToWishlist(actualSku);
        }
      }}
    >
      <Heart
        className={clsx(
          styles?.favoriteIcon ??
            "text-[#242321]  font-light h-[25px] w-[25px]",
          checked ? (styles?.favoriteIconChecked ?? "fill-[#242321]") : "",
        )}
        strokeWidth={1.5}
      />
    </div>
  );
};

export default FavoriteButton;
