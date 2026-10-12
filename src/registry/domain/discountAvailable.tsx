import { ReactNode } from "react";

interface Props {
    discount?: string | number | null;
    children: ReactNode;
    type: "withDiscount" | "withoutDiscount";
}

export const HasDiscount = ({
    discount,
    children,
    type,
}: Props) => {
    const hasDiscount =
        discount !== null &&
        discount !== undefined &&
        discount !== "" &&
        discount !== 0;

    if (type === "withDiscount") {
        return hasDiscount ? <>{children}</> : null;
    }

    return !hasDiscount ? <>{children}</> : null;
};