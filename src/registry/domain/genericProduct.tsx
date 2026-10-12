import useGoToDetails from "@/hooks/use-goto-details";
import { ReactNode } from "react";

type GenericProductCardProps = {
  imageUrl: string;
  title: string;
  brand: string;
  price: string;
  id: string;
  sku: string;
  children: ReactNode;
};

export const GenericProductCard = (props: GenericProductCardProps) => {
  const { children, brand, id, sku } = props;
  const goToProduct = useGoToDetails();

  const handleClick = () => {
    goToProduct(id, { brand: brand, sku: sku });
  };

  return <div onClick={handleClick}>{children}</div>;
};
