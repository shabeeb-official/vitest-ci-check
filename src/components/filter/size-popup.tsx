import { Popover, PopoverTrigger } from "../ui/popover";
import { PopoverContent } from "@radix-ui/react-popover";
import FilterItem from "./filter-item";

type SizePopupProps = {
  onOpen: () => void;
};

const SizePopup = ({ onOpen }: SizePopupProps) => {
  return (
    <Popover>
      <PopoverTrigger>
        <FilterItem label="size" onOpen={onOpen} />
      </PopoverTrigger>
      <PopoverContent className="z-[9999] relative">
        <div className="p-4 bg-white shadow-sm w-max">
          <div className="flex flex-col gap-3">
            <p className="filter-item">coming soon</p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SizePopup;
