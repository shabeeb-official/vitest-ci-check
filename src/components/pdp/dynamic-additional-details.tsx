import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useProdctDetail } from "@/store/product-detail";
import { useProducts } from "@/store/products";
import useGetSkuFromQuery from "@/hooks/use-get-sku-from-query";
import { useMemo } from "react";

export const DynamicAdditionalDetailsComponent = ({
  accordionWrapperStyle = "w-full border-b border-gray-200",
  accordionTriggerStyle = "capitalize font-semibold w-full text-left p-3 flex justify-between",
  accordionContentStyle = "p-3 font-light",
  iconType = "plus",
}: {
  accordionWrapperStyle?: string;
  accordionTriggerStyle?: string;
  accordionContentStyle?: string;
  iconType?: "chevron" | "plus";
} = {}) => {
  const [sku] = useGetSkuFromQuery();
  const { products } = useProducts();
  const currentProduct = useProdctDetail();

  // Get extra_details based on current SKU
  const extraDetails = useMemo(() => {
    if (!sku || !products || products.length === 0) {
      return currentProduct?.extra_details;
    }

    // Find product that matches current SKU
    const matchedProduct = products.find((p) => p.sku === sku);
    return matchedProduct?.extra_details || currentProduct?.extra_details;
  }, [sku, products, currentProduct?.extra_details]);

  if (!extraDetails || extraDetails.length === 0) return null;

  return (
    <div>
      {extraDetails.map((item, index) => {
        const title = Object.keys(item)[0];
        const content = item[title];
        return (
          <Accordion
            key={index}
            type="single"
            collapsible
            className={accordionWrapperStyle}
          >
            <AccordionItem
              value={`item-${index}`}
              className="border-b-0 w-full"
            >
              <AccordionTrigger
                className={accordionTriggerStyle}
                iconType={iconType}
              >
                {title}
              </AccordionTrigger>
              <AccordionContent className={accordionContentStyle}>
                {content
                  .split(/\r?\n|\r|\s{2,}/) // handles real line breaks and large whitespace gaps
                  .map((line) => line.trim())
                  .filter(Boolean)
                  .map((line, idx) => (
                    <p key={idx} className="mb-2">
                      {line}
                    </p>
                  ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        );
      })}
    </div>
  );
};
