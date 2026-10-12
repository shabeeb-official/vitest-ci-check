import LineIcon from "./line-icon";

const Button = ({
  icon,
  label,
  onClick,
}: {
  icon: JSX.Element;
  label: string;
  onClick: () => void;
}) => {
  return (
    <div>
      <div
        onClick={onClick}
        className="cursor-pointer text-[#1C1C1C] text-[12px] not-italic  font-medium capitalize border-[#676767] border p-1 px-2 rounded-lg w-fit flex items-center gap-1"
      >
        {icon}
        <span className="pe-3 text-[12px]">{label}</span>
        <LineIcon />
      </div>
    </div>
  );
};

export default Button;
