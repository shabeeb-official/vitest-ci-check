import { useParams } from "react-router-dom";

const useGetProductID = () => {
  const { productId } = useParams<{ productId: string }>();
  return productId;
};

export default useGetProductID;
