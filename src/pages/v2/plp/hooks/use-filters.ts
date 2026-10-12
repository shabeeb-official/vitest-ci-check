import { customEvent } from "@/utils/events";
import { useState, useEffect } from "react";
import { FilterTypes } from "../types";

const useFilters = () => {
  const [filters, setFilters] = useState<FilterTypes>({
    sort: [],
    color: [],
    brand: [],
    size: [],
    price: [],
  });

  useEffect(() => {
    const unsubscribe = customEvent.subscribe("filter:price", (data) => {
      setFilters((prev) => {
        const temp = { ...prev };
        temp.price = data.detail.value as number[];
        return temp;
      });
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = customEvent.subscribe("filter:selected", (event) => {
      const { type, selected } = event.detail;
      setFilters((prev) => {
        const temp = { ...prev };
        const currentFilterData = [...temp[type]];
        const currentSelectedIndex = currentFilterData.findIndex(
          (filterValue) => filterValue === selected,
        );

        if (currentSelectedIndex === -1) {
          currentFilterData.push(selected);
        } else {
          currentFilterData.splice(currentSelectedIndex, 1);
        }

        temp[type] = currentFilterData;
        return temp;
      });
    });
    return () => unsubscribe();
  }, []);

  return filters;
};

export default useFilters;
