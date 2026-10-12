import { Button } from "@/components/ui/button";

const FilterTypeButton = ({
  label,
  onClick,
  selected,
}: {
  label: string;
  selected: string[];
  onClick: (v: string) => void;
}) => {
  const active = selected.findIndex((item) => item === label) === -1;
  const className = `capitalize ${active ? "bg-white" : "bg-black"} ${active ? "hover:bg-gray-100" : "hover:bg-gray-900"}  w-fit ${active ? "text-gray-500" : "text-gray-100"} pr-5 pl-5 pt-2 pb-2 h-fit`;

  return (
    <Button
      onClick={() => {
        onClick(label);
      }}
      className={className}
    >
      {label}
    </Button>
  );
};

export default FilterTypeButton;
