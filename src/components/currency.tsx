const Currency = ({ children }: { children?: number | string | null }) => {
  if (children === null || children === undefined) return null;

  const parsedNumber = Number(children);

  if (!Number.isFinite(parsedNumber)) return null;

  return (
    <>
      {new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(parsedNumber)}
    </>
  );
};

export default Currency;
