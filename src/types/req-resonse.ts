import { ProductListItem } from "./product";

export type SerializedData = {
  products: ProductListItem[];
  chips: string[];
};

export type PromptResponse = {
  products: ProductListItem[];
  chips: string[];
  message: string;
  status: boolean;
};

export type RequestStatus = "idle" | "pending" | "failed" | "success";

export type Query = { brand: string; sku: string };
