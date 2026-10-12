import RenderLoop from "@/components/render-loop";
import useGetSkuFromQuery from "@/hooks/use-get-sku-from-query";
import clsx from "clsx";
import { useMemo } from "react";

type ColorSelectorProps = {
  colorPillStyle: string;
  colorPillSelectedStyle: string;
  colorPillImageStyle: string;
  sizeObject: any;
  swatchName: string;
};

export const ColorSelector = (props: ColorSelectorProps) => {
  const {
    colorPillStyle,
    colorPillSelectedStyle,
    colorPillImageStyle,
    sizeObject,
    swatchName,
  } = props;

  const [_, updateSku] = useGetSkuFromQuery();

  const colors = useMemo(() => {
    return Object.keys(sizeObject);
  }, [sizeObject]);

  return (
    <RenderLoop
      list={colors}
      render={(colorName) => {
        const size = sizeObject?.[colorName];
        if (!size?.src) return null;
        const style = clsx(
          colorPillStyle,
          colorName === swatchName ? colorPillSelectedStyle : "",
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
  );
};
