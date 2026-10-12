import { ChevronDown, ChevronUp, Minus, Plus, X } from "lucide-react";
import { Render } from "./conditional";

const AccordionToggle = ({
  open,
  iconType = "chevron",
}: {
  open: boolean;
  iconType?: "chevron" | "plus";
}) => {
  if (iconType === "plus") {
    return (
      <Render
        when={open}
        show={<Minus className="w-[16px] h-[16px] stroke-[1.5] stroke-black" />}
        otherwise={<Plus className="w-[16px] h-[16px] stroke-[1.5] stroke-black" />}
      />
    );
  }

  return (
    <Render
      when={open}
      show={<ChevronUp className="text-gray-400" />}
      otherwise={<ChevronDown className="text-gray-400" />}
    />
  );
};

export default AccordionToggle;
