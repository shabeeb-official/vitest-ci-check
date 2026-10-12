import { ProductListItem } from "@/types/product";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const AddToCartDialog = ({
  open,
  onClose,
  product,
}: {
  open: boolean;
  onClose: () => void;
  product: ProductListItem;
}) => {
  const { addToCart } = useCart();
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || "");
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || "");

  const handleAddToCart = () => {
    // Create a product with selected options
    const productWithOptions = {
      ...product,
      selectedColor,
      selectedSize,
    };
    addToCart(productWithOptions);
    onClose();
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="mb-4">Select Options</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6">
          <div className="flex items-center gap-4">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-20 h-20 object-cover rounded-md"
            />
            <div>
              <h3 className="font-medium">{product.name}</h3>
              <p className="text-sm text-muted-foreground">{product.price}</p>
            </div>
          </div>

          {product.colors && product.colors.length > 0 && (
            <div>
              <Label className="font-medium mb-2 block">Color</Label>
              <div className="flex flex-wrap gap-3 mt-2">
                {product.colors.map((color) => (
                  <div
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={cn(
                      "cursor-pointer border px-4 py-2 rounded-md text-sm",
                      selectedColor === color
                        ? "bg-gray-100 border-gray-400"
                        : "border-gray-200",
                    )}
                  >
                    {color}
                  </div>
                ))}
              </div>
            </div>
          )}

          {product.sizes && product.sizes.length > 0 && (
            <div>
              <Label className="font-medium mb-2 block">Size</Label>
              <RadioGroup
                value={selectedSize}
                onValueChange={setSelectedSize}
                className="flex flex-wrap gap-3 mt-2"
              >
                {product.sizes.map((size) => (
                  <div key={size} className="flex items-center">
                    <RadioGroupItem
                      id={`size-${size}`}
                      value={size}
                      className="sr-only"
                    />
                    <Label
                      htmlFor={`size-${size}`}
                      className={cn(
                        "px-3 py-2 border rounded-md cursor-pointer text-sm",
                        selectedSize === size
                          ? "bg-gray-100 border-gray-400"
                          : "border-gray-200",
                      )}
                    >
                      {size}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          <div className="mt-4">
            <Button onClick={handleAddToCart} className="w-full">
              Add to Cart
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddToCartDialog;
