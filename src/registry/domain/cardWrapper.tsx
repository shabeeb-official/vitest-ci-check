type CardWrapperProps = {
  skuId: string;
  children: React.ReactNode;
  className?: string;
};

const CardWrapper = (props: CardWrapperProps) => {
  const { children, className, skuId } = props;
  const handleProductClick = () => {
    alert("product selected " + skuId);
  };
  return (
    <div className={className} onClick={handleProductClick}>
      {children}
    </div>
  );
};

export default CardWrapper;
