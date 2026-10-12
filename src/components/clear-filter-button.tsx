import { useProductListFilter } from "@/store/filter";
import { Button } from "./ui/button";

// type ClearFilterButtonProps = {
//   label?: string;
//   onClick?: () => void;
//   styles?: any;
// };
type props = {
  styles: {
    clearButton: string;
  };
};

const ClearFilterButton = ({ styles }: props) => {
  const { clearFilter } = useProductListFilter();
  return (
    <div className="w-full flex justify-end">
      <Button className={styles.clearButton} onClick={clearFilter}>
        clear filter
      </Button>
    </div>
  );
};

export default ClearFilterButton;
