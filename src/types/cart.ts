export type AddToCartPayload = {
  qty: number;
  sku: string;
  name?: string;
  cartAction?: "add";
  options?: string[];
  preferredStoreId?: string;
};
