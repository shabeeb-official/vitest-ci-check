import { ReactNode } from "react";

type LinkProps = {
  href: string;
  className: string;
  children: ReactNode;
  target: "_self" | "_blank" | "_parent" | "_top";
};

export const Link = (props: LinkProps) => {
  const { href, className, target, children } = props;
  return (
    <a href={href} className={className} target={target}
      rel={target === "_blank" ? "noopener noreferrer" : undefined}>
      {children}
    </a>
  );
};
