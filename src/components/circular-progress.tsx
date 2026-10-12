import { useMemo } from "react";

const CircularProgress = ({
  counter,
  total,
}: {
  counter: number;
  total: number;
}) => {
  const percentage = useMemo(() => (counter / total) * 100, [counter, total]);

  return (
    <div className="relative size-20">
      <svg
        className="size-full -rotate-90"
        viewBox="0 0 36 36"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="18"
          cy="18"
          r="16"
          fill="none"
          className="stroke-current text-gray-200 dark:text-neutral-700"
          stroke-width="2"
        ></circle>
        <circle
          cx="18"
          cy="18"
          r="16"
          fill="none"
          className="stroke-current text-blue-600 dark:text-blue-500 transition delay-150 duration-300 ease-in-out"
          stroke-width="2"
          stroke-dasharray="100"
          stroke-dashoffset={percentage}
          stroke-linecap="round"
        ></circle>
      </svg>

      <div className="absolute top-1/2 start-1/2 transform -translate-y-1/2 -translate-x-1/2">
        <span className="text-center text-2xl font-bold text-blue-600 dark:text-blue-500">
          {counter / 1000}
        </span>
      </div>
    </div>
  );
};

export default CircularProgress;
