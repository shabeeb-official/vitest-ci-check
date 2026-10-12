import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PATHS } from "@/paths";
import { startTransition } from "react";

const BackToProducts = ({ className = "" }: { className?: string }) => {
  const navigate = useNavigate();
  return (
    <Button
      onClick={() => {
        startTransition(() => navigate(PATHS.products.root));
      }}
      className={className}
    >
      back to products
    </Button>
  );
};

export default BackToProducts;
