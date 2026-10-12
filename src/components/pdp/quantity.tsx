import {
  useProdctDetailDispatch,
  useProductQuantity,
} from "@/store/product-detail";
import clsx from "clsx";

type QuantitySelectorProps = {
  styles: {
    wrapperStyle?: string;
    buttonStyle?: string;
    inputStyle?: string;
    labelStyle?: string;
  };
  label?: string;
  min?: number;
  max?: number;
};

export const QuantitySelector = ({
  styles = {},
  label = "Quantity",
  min = 1,
  max = 500,
}: QuantitySelectorProps) => {
  const quantity = useProductQuantity();
  const dispatch = useProdctDetailDispatch();

  const setQty = (val: number) => {
    const clamped = Math.max(min, Math.min(max, val));
    dispatch({ type: "SET_QUANTITY", payload: clamped });
  };

  const handleIncrement = () => {
    if (quantity < max) setQty(quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > min) setQty(quantity - 1);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val)) setQty(val);
  };

  const {
    wrapperStyle = "flex items-center gap-2 mb-4",
    buttonStyle = "w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100",
    inputStyle = "w-12 h-8 text-center border border-gray-300 rounded",
    labelStyle = "block text-sm font-medium text-gray-700 mb-1",
  } = styles;

  return (
    <div className="mb-4">
      {label && <label className={labelStyle}>{label}</label>}
      <div className={wrapperStyle}>
        <button
          onClick={handleDecrement}
          className={clsx(buttonStyle)}
          aria-label="Decrease quantity"
        >
          -
        </button>
        <input
          type="number"
          min={min}
          max={max}
          value={quantity}
          onChange={handleChange}
          className={inputStyle}
        />
        <button
          onClick={handleIncrement}
          className={clsx(buttonStyle)}
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
    </div>
  );
};
