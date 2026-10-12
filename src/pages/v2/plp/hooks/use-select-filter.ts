import { useState, useEffect } from "react";

export function useSelectFilter() {
  const [selectedFilter, setSelectedFilter] = useState("");

  useEffect(() => {
    document.addEventListener("toggle-filter", (event) => {
      const { detail } = event;
      setSelectedFilter((prev) => (detail.name === prev ? "" : detail.name));
    });

    document.addEventListener("filter:selected", (event) => {
      const { detail } = event;
      const { type } = detail;
      if (type === "clear") {
        setSelectedFilter("");
      }
    });
  }, []);

  return selectedFilter;
}
