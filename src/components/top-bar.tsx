import { useProductListFilter } from "@/store/filter";
import BrandFilterItems from "./filter/brand-filter-item";
import { Filters } from "@/types/product";
import PriceFilterItem from "./filter/price-filter-item";
import ColorFilterItem from "./filter/color-filter-item";
import SizeFilterItem from "./filter/size-filter-item";
import { ReactNode } from "react";

export const BrandFilter = () => {
  return (
    <FilterItemWrapper value="brand">
      <BrandFilterItems />
    </FilterItemWrapper>
  );
};

export const ColorFilter = ({ styles }: { styles?: any }) => {
  return (
    <FilterItemWrapper value="color">
      <ColorFilterItem styles={styles} />
    </FilterItemWrapper>
  );
};

export const PriceFilter = () => {
  return (
    <FilterItemWrapper value="price">
      <PriceFilterItem />
    </FilterItemWrapper>
  );
};

export const SizeFilter = () => {
  return (
    <FilterItemWrapper value="size">
      <SizeFilterItem />
    </FilterItemWrapper>
  );
};

type TopBarProps = {
  children: ReactNode;
  styles: {
    topbarWrapper: string;
  };
};

const TopBar = (props: TopBarProps) => {
  const { children, styles } = props;
  return (
    <>
      <div className={styles.topbarWrapper}>{children}</div>
    </>
  );
};

type FilterItemWrapperType = {
  children: ReactNode;
  value: Filters;
};

export const FilterItemWrapper = ({
  children,
  value,
}: FilterItemWrapperType) => {
  const { selectedFilter } = useProductListFilter();
  if (value === selectedFilter) {
    return <>{children}</>;
  }
  return null;
};

type SortFilterProps = {
  children: any[];
  styles?: any;
};

export const SortFilter = (props: SortFilterProps) => {
  const { children, styles } = props;

  return <div className={styles?.sortFilter}>{children}</div>;
};

export const TopBarRight = ({
  children,
  styles,
}: {
  children: any[];
  styles?: string;
}) => {
  return (
    <>
      <div
        className={
          styles || "md:flex items-center gap-4 hidden w-full justify-end py-5"
        }
      >
        {children}
      </div>
    </>
  );
};

export default TopBar;
