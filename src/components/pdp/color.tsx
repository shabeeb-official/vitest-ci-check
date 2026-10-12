import useSizeObject from "@/hooks/product-page/use-size-object";
import useGetSkuFromQuery from "@/hooks/use-get-sku-from-query";
import { useProdctDetail } from "@/store/product-detail";
import { Label } from "@radix-ui/react-label";
import clsx from "clsx";
import { useMemo } from "react";
import RenderLoop from "../render-loop";

type ColorSelectorProps = {
  colorSectionStyle: string;
  colorLabelStyle: string;
  colorLabelBoldStyle: string;
  colorWrapperStyle: string;
  colorPillStyle: string;
  colorPillSelectedStyle: string;
  label: string;
  colorPillImageStyle: string;
  colorValueStyle?: string;
};

export const ColorSelector = (props: ColorSelectorProps) => {
  const {
    colorSectionStyle,
    colorLabelStyle,
    colorLabelBoldStyle,
    colorWrapperStyle,
    colorPillStyle,
    colorPillSelectedStyle,
    label,
    colorPillImageStyle,
    colorValueStyle,
  } = props;

  const [_, updateSku] = useGetSkuFromQuery();

  const product = useProdctDetail();
  const sizeObject = useSizeObject();

  const colors = useMemo(() => {
    return Object.keys(sizeObject);
  }, [sizeObject]);

  return (
    <div className={colorSectionStyle}>
      <Label className={colorLabelStyle}>
        <span className={colorLabelBoldStyle}>{label} </span>
        <span className={colorValueStyle ?? ''}>{product.swatchName}</span>
      </Label>
      <div className={colorWrapperStyle}>
        <RenderLoop
          list={colors}
          render={(colorName) => {
            const size = sizeObject?.[colorName];
            if (!size?.src) return null;
            const style = clsx(
              colorPillStyle,
              colorName === product.swatchName ? colorPillSelectedStyle : "",
            );
            return (
              <div
                className={style}
                onClick={() => {
                  const nextId = sizeObject?.[colorName]?.sizes?.[0]?.id;
                  if (nextId && updateSku) updateSku(nextId);
                }}
              >
                <img
                  src={size.src}
                  aria-label={colorName}
                  className={colorPillImageStyle}
                />
              </div>
            );
          }}
        />
      </div>
    </div>
  );
};
