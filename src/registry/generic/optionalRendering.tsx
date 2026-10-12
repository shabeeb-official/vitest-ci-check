import { ReactNode } from "react";

interface OptionalRenderingProps {
    children: ReactNode;
    dataToCheck: [];
    status: string;
}

const OptionalRendering = ({ children, dataToCheck, status }: OptionalRenderingProps) => {
    if (status === "loading" || dataToCheck?.length === 0) return null;
    return children
}


export default OptionalRendering