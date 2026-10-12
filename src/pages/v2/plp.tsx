import { useLayout } from "../../contexts/layoutContext";
import { renderNodeList } from "@/utils/render-ui";
import { composeRegistry, domainRegistry, genericRegistry } from "@/registry";
import { useProducts } from "@/store/products";
import { useFilterProducts } from "../v2/plp/hooks/use-filter-products";
import { useSelectFilter } from "../v2/plp/hooks/use-select-filter";
import { useFilterValues } from "../v2/plp/hooks/use-filter-values";
import { getActiveClientConfig } from "@/utils/clients";
import {
  extractColors,
  extractBrands,
  extractSizes,
  extractPriceRanges,
} from "./plp/utils";

function V2PLP() {
  const { status, products } = useProducts();

  const layout = useLayout();
  const layouts = getActiveClientConfig();

  const selectedFilter = useSelectFilter();
  const filterValues = useFilterValues();
  const filteredProducts = useFilterProducts(filterValues);

  const colorFilterList = extractColors(products);
  const brandFilerList = extractBrands(products);
  const sizeFilterList = extractSizes(products);
  const priceRange = extractPriceRanges(products);

  const view = renderNodeList(layouts.layouts.plp.layout, {
    registry: composeRegistry(genericRegistry, domainRegistry),
    runtimeScope: {
      products: filteredProducts,
      colorFilterList,
      brandFilerList,
      sizeFilterList,
      priceRange,
      selectedFilter,
      filterValues,
      sidebarExpanded: layout.sideBarExpanded,
      loading_status: status,
    },
  });
  return view;
}

export default V2PLP;
