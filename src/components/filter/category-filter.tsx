import { useMemo } from "react";
import { useProducts } from "@/store/products";
import { useProductListFilter } from "@/store/filter";
import { Button } from "@/components/ui/button";
import { FilterItemWrapper } from "@/components/top-bar";

type CategoryFilterProps = {
  styles: {
    base: string;
    item: string;
    label: string;
    checkbox: string;
  };
};

const CategoryFilterPanel = ({ styles }: CategoryFilterProps) => {
  const { products } = useProducts();
  const { filterValues, onUpdateFilter } = useProductListFilter();

  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach(p => {
      if (p.categories) set.add(p.categories.toLowerCase());
    });
    return Array.from(set).sort();
  }, [products]);

  const selectedCategories = (filterValues.category as string[]) || [];

  const handleToggle = (cat: string) => {
    onUpdateFilter(cat, 'category');
  };

  return (
    <div className={styles.base}>
      {categories.map(cat => (
        <div key={cat} className={styles.item}>
          <span className={styles.label}>{cat}</span>
          <input
            type="checkbox"
            className={styles.checkbox}
            checked={selectedCategories.includes(cat)}
            onChange={() => handleToggle(cat)}
          />
        </div>
      ))}
    </div>
  );
};

const CategoryFilter = ({ styles }: CategoryFilterProps) => {
  return (
    <FilterItemWrapper value="category">
      <CategoryFilterPanel styles={styles} />
    </FilterItemWrapper>
  );
};

export default CategoryFilter;