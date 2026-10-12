import { useProductListFilter } from "@/store/filter";
import { Filters } from "@/types/product";
import { ChevronDown } from "lucide-react";

type FilterItemProps = {
  label: string;
  styles?: any;
  type: Filters;
};

const FilterItem = (props: FilterItemProps) => {
  const { label, styles, type } = props;
  const { onSelectFilter } = useProductListFilter();

  return (
    <div
      className={styles?.filterItem ?? "cursor-pointer flex gap-2"}
      onClick={() => {
        onSelectFilter(type);
      }}
    >
      <p className={styles?.filterLabel ?? "capitalize font-bold"}>{label}</p>
      <ChevronDown />
    </div>
  );
};

export default FilterItem;
