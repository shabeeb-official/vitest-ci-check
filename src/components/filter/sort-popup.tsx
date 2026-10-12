import { Popover, PopoverTrigger } from "../ui/popover";
import { PopoverContent } from "@radix-ui/react-popover";
import { Sort } from "@/types/product";
import { useProductListFilter } from "@/store/filter";
import { ChevronDown } from "lucide-react";

type SortPopupProps = {
  onChange: () => void;
  onSelect: (v: Sort) => void;
  value: Sort;
  sortlabel?: string;
  filterslh?: string;
  filtershl?: string;
  align?: "center" | "start" | "end";
  styles?: Record<string, string>;
};

const SortPopup = (props: SortPopupProps) => {
  const { onUpdateFilter, filterValues, onSelectFilter, selectedFilter } =
    useProductListFilter();

  const { sortlabel, align, styles } = props;
  const value = filterValues.sort as Sort;
  const onSelect = (v: Sort) => {
    onUpdateFilter(v);
  };

  return (
    <>
      <Popover
        open={selectedFilter === "sort"}
        onOpenChange={() => {
          onSelectFilter("sort");
        }}
      >
        <PopoverTrigger>
          <div className={styles.sortTrigger ?? "cursor-pointer flex gap-2"}>
            <p className={styles.sortLabel ?? "capitalize font-bold"}>{sortlabel}</p>
            <ChevronDown className={styles.sortChevron}/>
          </div>
        </PopoverTrigger>
        <PopoverContent
          align={align}
          className={styles.sortPopover ?? "z-[9999] relative"}
        >
          <div className={styles.sortContent ?? "p-4 bg-white shadow-sm w-max"}>
            <div className={styles.sortList ?? "flex flex-col gap-3"}>
              <p
                className={
                  value === "low-high" ? styles.sortItemSelected ?? "filter-item-selected" : styles.sortItem ?? "filter-item"
                }
                onClick={() => {
                  onSelect("low-high");
                }}
              >
                Price (low to high)
              </p>
              <p
                className={
                  value === "high-low" ? styles.sortItemSelected ?? "filter-item-selected" : styles.sortItem ?? "filter-item"
                }
                onClick={() => {
                  onSelect("high-low");
                }}
              >
                Price (high to low)
              </p>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default SortPopup;
