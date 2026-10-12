import useExpandableText from "@/hooks/use-expandable-text";

interface ExpandableTextProps {
  className?: string;
  value: string;
}

const ExpandableText = ({
  className = "text-[#585858] text-[0.875rem]",
  value,
}: ExpandableTextProps) => {
  const { text, toggle, isOpen } = useExpandableText(value);
  return (
    <div className="inline">
      <p className={className}>
        {text}
        <span className="capitalize cursor-pointer " onClick={toggle}>
          {isOpen ? (
            <>
              &nbsp;
              <span className="underline">less</span>
            </>
          ) : (
            <>
              &nbsp;
              <span className="underline">read more</span>
            </>
          )}
        </span>
      </p>
    </div>
  );
};

export default ExpandableText;
