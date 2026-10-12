import { useEffect, useMemo } from "react";
import { useProductListFilter } from "@/store/filter";
import GenericOptionFilter from "./generic-option-filter";
import FilterItem from "./filter-item";
import { FilterItemWrapper } from "../top-bar";
import PriceFilterItem from "./price-filter-item";
import {
  generateFilterConfig,
  prioritizeFilterConfig,
} from "@/utils/generate-filter-config";
import { useProducts } from "@/store/products";

type DynamicFilterListProps = {
  styles?: any;
};

const DynamicFilterList = ({ styles }: DynamicFilterListProps) => {
  const { products } = useProducts();

  // Generate filter config dynamically from products
  const config = useMemo(() => {
    if (!products || products.length === 0) {
      return [];
    }
    const generated = generateFilterConfig(products);
    return prioritizeFilterConfig(generated);
  }, [products]);

  // Extract available options for each attribute from the products
  const availableOptions = useMemo(() => {
    const options: Record<string, Set<string>> = {};

    products.forEach((p) => {
      if (p.attributes) {
        Object.keys(p.attributes).forEach((attr) => {
          if (!options[attr]) options[attr] = new Set();
          const val = p.attributes[attr];
          if (Array.isArray(val)) {
            val.forEach((v) => options[attr].add(v));
          } else {
            options[attr].add(val);
          }
        });
      }
      // Also handle top-level fields if they are in config (like brand)
      if (p.brand) {
        if (!options["brand"]) options["brand"] = new Set();
        options["brand"].add(p.brand);
      }
    });

    // Convert sets to arrays
    const result: Record<string, string[]> = {};
    Object.keys(options).forEach((k) => {
      result[k] = Array.from(options[k]);
    });
    return result;
  }, [products]);

  return (
    <>
      {config.map((filter) => {
        if (filter.type === "range" && filter.code === "price") {
          // We can reuse the existing PriceFilter logic or generic range
          // For now reusing PriceFilterItem but wrapped
          return (
            <FilterItemWrapper key={filter.code} value={filter.code}>
              {/* We need to pass min/max to PriceFilterItem if it supports it, 
                    currently PriceFilterItem might be hardcoded. 
                    Let's assume we use the existing one for now which is specific to price. */}
              <PriceFilterItem />
            </FilterItemWrapper>
          );
        }

        if (filter.type === "option") {
          // For options, we render the header (FilterItem) which toggles the panel
          // And the panel content (GenericOptionFilter)
          return (
            <div key={filter.code}>
              {/* This renders the button in the top bar */}
              {/* Use FilterItemWrapper logic? 
                     The TopBar expects direct children to be valid elements. 
                     
                     Actually, TopBar logic in plp.json separates "filters" (buttons) and "panels".
                     
                     If we are replacing the entire filter section, we need to adapt.
                     
                     The current TopBar renders children. 
                     Usage in plp.json:
                     "children": [ ... "Filter Item Brand", "Filter Item Color" ... ]
                     
                     And separate "Brand Filter Panel", "Color Filter Panel" components.
                     
                     Implementation strategy:
                     1. DynamicFilterList renders the BUTTONS (Filter Items).
                     2. DynamicFilterPanels renders the PANELS.
                     
                     Or we combine them if the UI allows.
                     The current UI seems to have buttons in a row, and a panel appearing below when a button is clicked.
                     
                     Let's split this component into `DynamicFilterButtons` and `DynamicFilterPanels`.
                  */}
            </div>
          );
        }
        return null;
      })}
    </>
  );
};
export default DynamicFilterList;

export const DynamicFilterButtons = ({ styles }: DynamicFilterListProps) => {
  const { products } = useProducts();

  const config = useMemo(() => {
    if (!products || products.length === 0) {
      return [];
    }
    const generated = generateFilterConfig(products);
    return prioritizeFilterConfig(generated);
  }, [products]);

  return (
    <>
      {config.map((filter) => (
        <FilterItem
          key={filter.code}
          label={filter.label}
          type={filter.code}
          styles={styles}
        />
      ))}
    </>
  );
};

export const DynamicFilterPanels = ({ styles }: DynamicFilterListProps) => {
  const { products } = useProducts();

  const config = useMemo(() => {
    if (!products || products.length === 0) {
      return [];
    }
    const generated = generateFilterConfig(products);
    return prioritizeFilterConfig(generated);
  }, [products]);

  const availableOptions = useMemo(() => {
    const options: Record<string, Set<string>> = {};
    products.forEach((p) => {
      if (p.attributes) {
        Object.keys(p.attributes).forEach((attr) => {
          if (!options[attr]) options[attr] = new Set();
          const val = p.attributes[attr];
          if (Array.isArray(val)) {
            val.forEach((v) => options[attr].add(v));
          } else {
            options[attr].add(val);
          }
        });
      }
      if (p.brand) {
        if (!options["brand"]) options["brand"] = new Set();
        options["brand"].add(p.brand);
      }
      if (p.facet_color) {
        if (!options["color"]) options["color"] = new Set();
        options["color"].add(p.facet_color);
      }
    });
    const result: Record<string, string[]> = {};
    Object.keys(options).forEach((k) => {
      result[k] = Array.from(options[k]);
    });
    return result;
  }, [products]);

  return (
    <>
      {config.map((filter) => (
        <FilterItemWrapper key={filter.code} value={filter.code}>
          {filter.type === "range" && filter.code === "price" ? (
            <PriceFilterItem styles={styles}/>
          ) : (
            <GenericOptionFilter
              config={filter}
              options={availableOptions[filter.code] || []}
              styles={styles}
            />
          )}
        </FilterItemWrapper>
      ))}
    </>
  );
};
