import React, { createContext, useState, useContext } from "react";
import { Product } from "@/types/product";

// Define the context type
interface CartContextType {
  items: Product[];
  addToCart: (item: Product) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  getItemCount: () => number;
}

// Create the context with default values
const CartContext = createContext<CartContextType>({
  items: [],
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  getItemCount: () => 0,
});

// Create the provider component
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<Product[]>([]);

  const addToCart = (product: Product) => {
    setItems((prevItems) => [...prevItems, product]);
  };

  const removeFromCart = (productId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const getItemCount = () => {
    return items.length;
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        clearCart,
        getItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Create a custom hook for using the cart context
export const useCart = () => useContext(CartContext);
