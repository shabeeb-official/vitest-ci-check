export type ColorFilterItem = {
  colorName: string;
  src: string;
};

export type BrandFilterItem = {
  name: string;
};

export type SizeFilterItem = {
  name: string;
};

export type FilterTypes = {
  sort: string[];
  color: string[];
  brand: string[];
  size: string[];
  price: number[];
};
