import useToggleView from "@/hooks/use-toggle.view";
import { ReactNode } from "react";

type ToggleChatWindowProps = {
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
};

export const ToggleChatWindow = (props: ToggleChatWindowProps) => {
  const { className, children, ariaLabel } = props;
  const onToggleView = useToggleView();

  return (
    <div onClick={onToggleView} className={className} title={ariaLabel}>
      {children}
    </div>
  );
};
