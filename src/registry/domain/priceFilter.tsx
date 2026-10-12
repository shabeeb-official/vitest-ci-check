import { Slider } from "@/components/ui/slider";
import { customEvent } from "@/utils/events";
import { Currency } from "./currency";



interface PriceFilterItemProps {
    styles?: any;
    pirceClass?: string;
    sliderClass?: string;
    value: any,
    filterKey: string
    priceRange?: {
        start: number;
        default: number;
        end: number;
    };
}

const ProductPriceFilter = ({ styles, priceRange, value, filterKey }: PriceFilterItemProps) => {


    const priceFilterCurrencyTextWrapper =
        "flex gap-2 font-light";



    const onSliderChange = (v: number) => {
        customEvent.publish("filter:selected", {
            type: filterKey,
            name: v,
        });
    }
    return (

        <><div className={priceFilterCurrencyTextWrapper}>
            <p>
                <Currency value={priceRange?.start} className="text-[16px]" />
            </p>
            -
            <p>
                <Currency value={value[filterKey] as number || priceRange?.default} className="text-[16px]" />
            </p>
        </div><Slider
                min={priceRange?.start}
                max={priceRange?.end}
                step={1}
                defaultValue={[priceRange?.default]}
                value={[value[filterKey] as number || priceRange?.default]}
                onValueChange={(v) => onSliderChange(v[0])}
                className="w-full cursor-grab active:cursor-grabbing" /></>

    );
};

export default ProductPriceFilter;
