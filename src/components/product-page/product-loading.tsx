import { Loader } from "lucide-react";

const ProductLoading = () => {
  return (
    <div className="flex flex-1 items-center justify-center w-full bg-white h-screen">
      <Loader className="h-4 w-4 mr-2 animate-spin" />
      <h2 className="text-2xl font-medium">Loading</h2>
    </div>
  );
};

export default ProductLoading;
