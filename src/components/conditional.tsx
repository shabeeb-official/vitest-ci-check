import { ReactNode } from "react";

export const Render = ({
  when,
  show,
  otherwise,
}: {
  when: boolean;
  show: ReactNode;
  otherwise?: ReactNode;
}) => {
  if (when) {
    return show;
  }

  return otherwise;
};
