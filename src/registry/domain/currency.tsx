import clsx from "clsx";

interface currencyProps {
  value?: number | string | null;
  className?: string;
}

export const Currency = ({ value, className }: currencyProps) => {
  if (value === null || value === undefined) return null;

  const parsedNumber = Number(value);

  if (!Number.isFinite(parsedNumber)) return null;
  return (
    <div className={clsx(className)}>
      {new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "AUD",
      }).format(parsedNumber)}
    </div> ////teh au need to be corrected
  );
};

export default Currency;
