import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import debug from "debug";

const log = debug("app:ProductPage");

const useGetSkuFromQuery = (): [string, (s: string) => void] => {
  const [search, setSearchParam] = useSearchParams();
  // Read SKU synchronously so product (and image URLs) are available on the
  // same render as the API response — avoid a useEffect frame of delay.
  const sku = search.get("sku") ?? "";

  const updateSku = useCallback(
    (nextSku: string) => {
      log(`Setting sku:${nextSku}`);
      setSearchParam({ sku: nextSku });
      log("sku updated");
    },
    [setSearchParam],
  );

  return [sku, updateSku];
};

export default useGetSkuFromQuery;
