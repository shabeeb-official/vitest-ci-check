const ColorPill = ({ color }: { color: string }) => {
  return (
    <span
      className="inline-block rounded-[50%] w-[25.278px] h-[25.278px] mr-1"
      style={{
        backgroundColor: color,
      }}
    />
  );
};

export default ColorPill;
