import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { PATHS } from "@/paths";
import { startTransition } from "react";

const ProuductNotFound = () => {
  const navigate = useNavigate();

  const handleBackToProducts = () => {
    startTransition(() => {
      navigate(PATHS.products.root, { state: { showProducts: true } });
    });
  };

  return (
    <div className="bg-white flex flex-1 flex-col items-center justify-center h-screen">
      <h2 className="text-2xl font-medium mb-4">Product details not found</h2>
      <Button onClick={handleBackToProducts} variant="outline">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to products
      </Button>
    </div>
  );
};

export default ProuductNotFound;
