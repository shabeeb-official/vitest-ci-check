import { customEvent } from "@/utils/events";
import { Slider } from "@radix-ui/react-slider";
import { useEffect, useState } from "react";

type GenericSliderProps = {
  start: number;
  end: number;
  mid: number;
  eventName: string;
};

export const GenericSlider = (props: GenericSliderProps) => {
  const { end, mid, start, eventName } = props;

  const [value, setValue] = useState<number[]>([0]);

  useEffect(() => {
    if (mid > 0) {
      setValue([mid]);
    }
  }, [mid]);

  const handleValueChange = (value: number[]) => {
    setValue(value);
  };

  useEffect(() => {
    customEvent.publish(eventName, {
      value,
    });
  }, [value]);

  return (
    <Slider
      min={start}
      max={end}
      step={1}
      value={value}
      onValueChange={handleValueChange}
      className="w-full cursor-grab active:cursor-grabbing"
    />
  );
};
