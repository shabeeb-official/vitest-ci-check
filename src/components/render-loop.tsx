import { ReactNode } from "react";

const RenderLoop = ({
  list,
  render,
}: {
  list?: unknown[];
  render: (item: unknown, i?: number) => ReactNode;
}) => {
  return <>{list?.map(render)}</>;
};

export default RenderLoop;
