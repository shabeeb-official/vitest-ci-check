export type FilterType = "range" | "option";

export interface FilterConfigItem {
  code: string;
  label: string;
  type: FilterType;
  min?: number;
  max?: number;
}

// common products
export const filterConfig: Record<string, FilterConfigItem[]> = {
  clothing: [
  ],
};