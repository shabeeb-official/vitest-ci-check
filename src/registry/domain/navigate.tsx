import { startTransition } from "react";
import { useNavigate } from "react-router-dom";

interface IViewAll {
  children: React.ReactNode;
  to: string;
  className?: string;
}

//TODO: This needs to have a way to protect from malformed path, currently no safety is implemented
const Navigate = ({ children, className, to }: IViewAll) => {
  const navigation = useNavigate();
  const onClick = () => {
    startTransition(() => {
      navigation(to);
    });
  };

  return (
    <div className={className} onClick={onClick}>
      {children}
    </div>
  );
};

export default Navigate;
