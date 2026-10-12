import { Popover, PopoverTrigger } from "../ui/popover";
import { PopoverContent } from "@radix-ui/react-popover";
import FilterItem from "./filter-item";

type PricePopupProps = {
  onChange: () => void;
};

const PricePopup = ({ onChange }: PricePopupProps) => {
  return (
    <Popover>
      <PopoverTrigger>
        <FilterItem label="price" onOpen={onChange} />
      </PopoverTrigger>
      <PopoverContent className="z-[9999] relative">
        <div className="p-4 bg-white shadow-sm w-max">
          <div className="flex flex-col gap-3">
            <p className="filter-item">best sellers</p>
            <p className="filter-item">new</p>
            <p className="filter-item">recommended for you</p>
            <p className="filter-item">Price(low to high)</p>
            <p className="filter-item">Price(high to low)</p>
            <p className="filter-item">biggest saving</p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default PricePopup;
