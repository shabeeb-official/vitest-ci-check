import { ReactNode } from "react";

type TextProps = {
  as: "p" | "span" | "h1" | "h2" | "h3" | "h4" | "h5" | "h5" | "ul" | "li";
  className: string;
  children: ReactNode;
  contentType?: "text" | "list";
  listItems?: string[];
};

export const Text = (props: TextProps) => {
  const { as, className, children, contentType, listItems } = props;
  const Comp = as;
  return contentType === "list" ? (
    <Comp className={className}>
      {listItems?.map((item, index) => (
        <Comp className={className} key={index}>
          {item}
        </Comp>
      ))}
    </Comp>
  ) : (
    <Comp className={className}>{children}</Comp>
  );
};
