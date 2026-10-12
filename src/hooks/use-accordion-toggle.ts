import { useState } from "react";

const useAccordionToggle = (): [
  boolean,
  (arg: string) => (v: string) => void,
] => {
  const [open, setOpen] = useState(false);

  const toggle = (arg: string) => (v: string) => {
    setOpen(v === arg);
  };

  return [open, toggle];
};

export default useAccordionToggle;
