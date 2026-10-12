import { useState, useEffect } from "react";

export function useFilterValues() {
  const [filterValues, setFilterValues] = useState({});
  useEffect(() => {
    document.addEventListener("filter:selected", (event) => {
      const { detail } = event;
      const { type, name } = detail;
      if (type === "clear") {
        setFilterValues({});
        return;
      }

      if (!name) {
        return;
      }

      setFilterValues((prev) => {
        const temp = { ...prev };

        if (type === "sort") {
          temp.sort = [name];
          return temp;
        }

        if (type === "price") {
          temp.price = [name];
          return temp;
        }

        const items = temp[type] || [];

        if (items.includes(name)) {
          temp[type] = items.filter((item) => item !== name);
        } else {
          temp[type] = [...items, name];
        }

        return temp;
      });
    });
  }, []);

  return filterValues;
}
