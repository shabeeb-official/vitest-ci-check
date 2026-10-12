import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PATHS } from "@/paths";
import { startTransition } from "react";

const BackToProducts = ({ styles = "" }: { styles?: string }) => {
  const navigate = useNavigate();
  return (
    <Button
      onClick={() => {
        startTransition(() => navigate(PATHS.products.root));
      }}
      className={styles}
    >
      back to products
    </Button>
  );
};

export default BackToProducts;
