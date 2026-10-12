import { useLayout, useLayoutDispatch } from "@/contexts/layoutContext";
import { HideSm } from "./hider";

type ExpandeSunnyProps = {
  styles?: string;
  imageURL?: string;
};

const ExpandeSunny = ({ styles, imageURL }: ExpandeSunnyProps) => {
  const dispatch = useLayoutDispatch();
  const { sideBarExpanded } = useLayout();

  const onClick = () => {
    dispatch({ type: "expand" });
  };

  if (sideBarExpanded) {
    return null;
  }
  return (
    <HideSm>
      <img
        src={imageURL}
        alt="toogle-button"
        className={styles || "h-[2.6rem] w-24 cursor-pointer"}
        onClick={onClick}
      />
    </HideSm>
  );
};

export default ExpandeSunny;
