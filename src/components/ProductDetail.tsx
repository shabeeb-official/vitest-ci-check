import { useMemo } from "react";
import { SizeObject } from "@/types/product";
import { Label } from "@/components/ui/label";
import { Render } from "./conditional";
import RenderLoop from "./render-loop";
import clsx from "clsx";
import Currency from "./currency";
import AdditionalDetails, { Details } from "./product-page/details";
import BuyNowButton from "./product-page/buy-now-button";
import BuyNowPayLater from "./product-page/buy-now-pay-later";
import { useProdctDetail } from "@/store/product-detail";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";
import { AccordionTrigger } from "@radix-ui/react-accordion";
import useAccordionToggle from "@/hooks/use-accordion-toggle";
import AccordionToggle from "./accordion-toggle";
import ProductDetailDescription from "./product-page/description";
import FavoriteButton from "./favorites-button";
import useGetSkuFromQuery from "@/hooks/use-get-sku-from-query";
import { useIsMobileWidth } from "@/hooks/use-mobile-width";
import { compareSizes } from "@/utils/sort-sizes";

interface ProductDetailProps {
  sizeObject: SizeObject;
  swatches: string[];
}

const findSelectedProduct = (values = [], sku: string) => {
  for (let i = 0; i < values.length; i++) {
    const sizes = values[i].sizes || [];
    const found = sizes.find(({ id }) => id === sku);
    if (found) {
      return sizes;
    }
  }
  return [];
};

const ProductDetail = ({ sizeObject }: ProductDetailProps) => {
  const [sku, updateSku] = useGetSkuFromQuery();

  const colors = useMemo(() => {
    return Object.keys(sizeObject);
  }, [sizeObject]);

  const sizes = useMemo(() => {
    if (!sku) return [];
    const values = Object.values(sizeObject);
    return findSelectedProduct(values, sku).sort(compareSizes);
  }, [sku, sizeObject]);

  const product = useProdctDetail();
  const isMobileWidth = useIsMobileWidth();

  return (
    <div className="w-full col-span-12 lg:col-span-6 xl:col-span-4 2xl:col-span-4">
      <div>
        <ProductBrand />
        <div className="flex justify-between w-full items-center gap-4">
          <h2 className="font-light">{product.title}</h2>
          <Render
            when={isMobileWidth}
            show={
              <div>
                <FavoriteButton sku={product.sku} position="static" />
              </div>
            }
          />
        </div>
        <ProductPrice />
        <div className="mb-6 mt-3">
          <Label className="capitalize font-normal block text-md text-[#1A1A1A] mb-2">
            <span className="font-bold">Colour </span>
            {product.swatchName}
          </Label>
          <div className="flex flex-wrap gap-2 justify-start">
            <RenderLoop
              list={colors}
              render={(colorName) => {
                const size = sizeObject[colorName];
                if (!size.src) return null;
                const style = clsx(
                  "flex justify-center items-center cursor-pointer",
                  colorName === product.swatchName
                    ? "p-[3px] border-black border-2"
                    : "",
                );
                return (
                  <div
                    className={style}
                    onClick={() => {
                      const nextId = sizeObject[colorName].sizes[0].id;
                      updateSku(nextId);
                    }}
                  >
                    <img
                      src={size.src}
                      aria-label={colorName}
                      className="h-5 w-5"
                    />
                  </div>
                );
              }}
            />
          </div>
        </div>
        <div className="mb-6">
          <Label className="capitalize font-bold  block text-md text-[#1A1A1A] mb-2 ">
            available size
          </Label>
          <div className="grid grid-cols-4 gap-2 justify-start text-nowrap">
            {sizes.map(({ id, size: label }) => {
              const isSelected = id === sku;
              const style = clsx(
                "rounded-none hover:bg-none col-span-1 text-center cursor-pointer",
                isSelected ? " border-black border-b-2" : "",
              );

              return (
                <div
                  onClick={() => updateSku(id)}
                  key={id}
                  aria-label={`Select ${label} size`}
                  className={style}
                  style={{
                    background: "none",
                    color: "black",
                  }}
                >
                  {label}
                </div>
              );
            })}
          </div>
        </div>
        {/* <Render */}
        {/*   when={!isMobileWidth} */}
        {/*   show={ */}
        {/*     <div */}
        {/*       className="mb-2 font-light flex cursor-pointer" */}
        {/*       onClick={onOpenSizeGuide} */}
        {/*     > */}
        {/*       size guide &gt; */}
        {/*     </div> */}
        {/*   } */}
        {/* /> */}
        <div className="mb-5">
          <BuyNowButton name={product.title} />
        </div>
        <Points points="234" />
        <Refundid />
        <BuyNowPayLater />
        <ProductDetailDescription />
        <Details />
        <AdditionalDetails />
        <div className="mt-5">
          <p className="capitalize font-light text-sm">
            product number: {product.sku}
          </p>
        </div>
      </div>
    </div>
  );
};

const ProductBrand = () => {
  const product = useProdctDetail();
  return (
    <Render
      when={Boolean(product.brand)}
      show={
        <h2 className="text-xl font-medium text-gray-900 mb-2">
          {product.brand}
        </h2>
      }
    />
  );
};

const ProductPrice = () => {
  const product = useProdctDetail();
  return (
    <Render
      when={product.sale_price != ""}
      show={
        <>
          <p className="text-lg font-light sale-item-color mb-2">
            <Currency>{product.sale_price}</Currency>
          </p>
          <p className="text-sm font-light text-gray-500 mb-2 line-through">
            <Currency>{product.price}</Currency>
          </p>
        </>
      }
      otherwise={
        <p className="text-lg font-light text-gray-900 mb-4">
          <Currency>{product.price}</Currency>
        </p>
      }
    />
  );
};

const REFUNDIND_VALUE = "refundid";

const Refundid = () => {
  const [open, handleToggle] = useAccordionToggle();
  return (
    <div>
      <Accordion
        type="single"
        collapsible
        onValueChange={handleToggle(REFUNDIND_VALUE)}
        className="w-full border-b border-gray-200"
      >
        <AccordionItem value="refundid" className="border-b-0 w-full">
          <AccordionTrigger className="grid grid-cols-12 justify-between w-full text-left p-3">
            <div className="col-span-11">
              <p className="text-xs md:text-sm lg:text-md flex flex-wrap">
                <span className="font-semibold capitalize">
                  instant refunds
                </span>
                &nbsp;when you return using
                <img
                  className="h-[23px] pl-[5px]"
                  src="https://www.citybeach.com/on/demandware.static/-/Library-Sites-CityBeachSharedLibrary/default/dw0e536788/images/homepage/_04-Content_Asset-Assets/Refundid/refundid_logo.png"
                />
              </p>
            </div>
            <div className="col-span-1">
              <AccordionToggle open={open} />
            </div>
          </AccordionTrigger>
          <AccordionContent className="p-3 font-light">
            <img src="https://www.citybeach.com/on/demandware.static/-/Library-Sites-CityBeachSharedLibrary/default/dwc601aec8/images/homepage/_04-Content_Asset-Assets/Refundid/refundid_Instant-refunds.png" />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

const POINTS_VALUE = "points";

const Points = ({ points }: { points: string }) => {
  const [open, handleToggle] = useAccordionToggle();

  return (
    <div>
      <Accordion
        type="single"
        collapsible
        className="w-full"
        onValueChange={handleToggle(POINTS_VALUE)}
      >
        <AccordionItem value="points" className="border-b-0 w-full">
          <AccordionTrigger className="grid grid-cols-12 justify-between w-full text-left p-3 items-center">
            <div className="col-span-11 flex items-center whitespace-nowrap">
              <span className="whitespace-nowrap font-semibold capitalize mr-[8px]">
                <img
                  className="w-[35px]"
                  src="https://www.citybeach.com/on/demandware.static/Sites-CityBeachAustralia-Site/-/en_AU/v1755029288227/images/citybeach-rewards_icon.png"
                />
              </span>
              &nbsp;Earn points on the shop
            </div>
            <div className="col-span-1">
              <AccordionToggle open={open} />
            </div>
          </AccordionTrigger>
          <AccordionContent className="p-3 font-light flex flex-col gap-3">
            <PointItem>20% off* on first order</PointItem>
            <PointItem>Earn points while you shop</PointItem>
            <PointItem>$1 = 10 points, 1000 points = $10 voucher</PointItem>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

const PointItem = ({ children }) => {
  return <p className="font-light text-[16px] text-[#242321]">{children}</p>;
};

export default ProductDetail;
