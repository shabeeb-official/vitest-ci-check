import {
  Brand,
  FilterColor,
  FilterProvider,
  Filters,
  FilterSize,
  FilterValues,
  OnUpdateFilter,
  Price,
  Sort,
} from "@/types/product";
import { useState, createContext, useContext, useCallback } from "react";

const initialValue: FilterValues = {
  brand: "none",
  price: "none",
  sort: "none",
  color: "none",
  size: "none",
};

const noop = () => {};

const productListFilterContext = createContext<FilterProvider>({
  selectedFilter: "none",
  filterValues: initialValue,
  onSelectFilter: noop,
  onUpdateFilter: noop,
  clearFilter: noop,
  onCloseFilter: noop,
});

const ProductListFilterProvider = ({ children }) => {
  const [selectedFilter, setSelectedFilter] = useState<Filters>("none");
  const [filterValues, setFilterValues] = useState<FilterValues>(initialValue);

  const clearFilter = useCallback(() => {
    setSelectedFilter("none");
    setFilterValues(initialValue);
  }, []);

  const onUpdateFilter: OnUpdateFilter = useCallback(
    (v, filterCode) => {
      if (selectedFilter === "sort") {
        setFilterValues((prev) => {
          return {
            ...prev,
            sort: prev.sort === v ? "none" : (v as Sort),
          };
        });
        return;
      }

      const key = filterCode || selectedFilter;

      if (key === "price") {
        setFilterValues((prev) => {
          return { ...prev, price: v as Price };
        });
        return;
      }

      // Generic handler for array-based options (brand, color, size, etc.)
      setFilterValues((prev) => {
        const currentVal = prev[key];
        const val = v as string; // Assuming options are strings

        if (Array.isArray(currentVal)) {
          const temp = [...currentVal];
          const selectedIndex = temp.findIndex((item) => item === val);
          if (selectedIndex > -1) {
            const updated = temp.filter((_, i) => i !== selectedIndex);
            if (updated.length === 0) {
              return { ...prev, [key]: "none" };
            }
            return { ...prev, [key]: updated };
          }
          return { ...prev, [key]: [...currentVal, val] };
        }

        // If it was "none" or undefined, start a new array
        return { ...prev, [key]: [val] };
      });
    },
    [selectedFilter, filterValues],
  );

  const onCloseFilter = () => {
    setSelectedFilter("none");
  };

  const onSelectFilter = (v: Filters) => {
    setSelectedFilter((prev) => {
      if (v === prev) {
        return "none";
      }
      return v;
    });
  };
  return (
    <>
      <productListFilterContext.Provider
        value={{
          selectedFilter,
          onSelectFilter,
          filterValues,
          onUpdateFilter,
          clearFilter,
          onCloseFilter,
        }}
      >
        {children}
      </productListFilterContext.Provider>
    </>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useProductListFilter = () => {
  const ctx = useContext(productListFilterContext);
  return ctx;
};

export default ProductListFilterProvider;
