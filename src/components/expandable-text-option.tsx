const ExpandableTextOption = ({ label }: { label: string }) => {
  return (
    <>
      &nbsp;
      <span className="underline">{label}</span>
    </>
  );
};

export default ExpandableTextOption;
