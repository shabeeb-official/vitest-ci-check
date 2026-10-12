import clsx from "clsx";
import { ReactNode } from "react";

type BoxProps = {
    as: "div" | "section" | "main" | "label" | "table" | "tbody" | "thead" | "th" | "tr" | "td";
    className: string;
    sidebarExpanded: boolean;
    expandedClassName?: string;
    children: ReactNode;
    onClick?: () => void;
    isLenght: [] | {}
};

export const PlpListDiv = (props: BoxProps) => {
    const { as, children, className, isLenght, onClick, sidebarExpanded, expandedClassName } = props;
    const Comp = as;

    const mergedClassName = clsx(
        className,
        !sidebarExpanded && expandedClassName
    );


    return <Comp className={mergedClassName} onClick={onClick}>{children}</Comp>;
};
