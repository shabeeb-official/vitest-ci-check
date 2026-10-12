import { useCallback, useMemo, useState } from "react";

type UseExapndableTextResult = {
  isOpen: boolean;
  text: string;
  toggle: () => void;
};

const useExpandableText = (
  textToExpand: string,
  wordLimit = 30,
): UseExapndableTextResult => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  const text = useMemo(() => {
    if (!textToExpand) {
      return "";
    }
    if (isOpen) {
      return textToExpand;
    }
    return textToExpand.split(" ").slice(0, wordLimit).join(" ");
  }, [textToExpand, wordLimit, isOpen]);

  return { isOpen, text, toggle };
};

export default useExpandableText;
