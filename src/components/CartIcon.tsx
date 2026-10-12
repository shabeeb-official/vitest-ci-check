import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { startTransition } from "react";

const CartIcon = () => {
  const { items, removeFromCart } = useCart();
  const navigate = useNavigate();
  const cartCount = items.length;
  const cartTotal = items.reduce((total, item) => total + item.price, 0);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {cartCount > 0 && (
            <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-[#0071e3] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="py-2 px-4">
          <h3 className="text-lg font-medium">Your Cart</h3>
          <p className="text-sm text-gray-500">{cartCount} items</p>
        </div>
        <DropdownMenuSeparator />
        {items.length === 0 ? (
          <div className="py-6 px-4 text-center">
            <p className="text-gray-500">Your cart is empty</p>
          </div>
        ) : (
          <>
            <div className="max-h-60 overflow-auto">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center py-2 px-4 hover:bg-gray-50"
                >
                  <div className="h-12 w-12 rounded overflow-hidden flex-shrink-0">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="ml-4 flex-grow">
                    <p className="text-sm font-medium">{item.name}</p>
                    <div className="flex text-xs text-gray-500">
                      {item.sizes && (
                        <span className="mr-2">Size: {item.sizes[0]}</span>
                      )}
                      {item.colors && <span>Color: {item.colors[0]}</span>}
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs">1 × ${item.price}</span>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-xs text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <DropdownMenuSeparator />
            <div className="p-4">
              <div className="flex justify-between mb-4">
                <span className="font-medium">Total:</span>
                <span className="font-medium">${cartTotal}</span>
              </div>
              <Button
                onClick={() => startTransition(() => navigate("/cart"))}
                className="w-full"
              >
                View Cart & Checkout
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CartIcon;
