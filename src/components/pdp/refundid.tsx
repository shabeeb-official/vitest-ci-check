import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@radix-ui/react-accordion";

export const RefundidAccordionComponent = ({
  accordionWrapperStyle = "w-full border-b border-gray-200",
  accordionTriggerStyle = "grid grid-cols-12 justify-between w-full text-left p-3",
  mainLabel,
  subLabel,
  imageLabel,
  refundImageLabelStyle,
  accordionContentImage,
  iconType = "chevron",
}: {
  accordionWrapperStyle?: string;
  accordionTriggerStyle?: string;
  mainLabel: string;
  subLabel: string;
  imageLabel: string;
  refundImageLabelStyle: string;
  accordionContentImage: string;
  iconType?: "chevron" | "plus";
}) => {
  return (
    <div>
      <Accordion type="single" collapsible className={accordionWrapperStyle}>
        <AccordionItem value="refundid" className="border-b-0 w-full">
          <AccordionTrigger
            className={accordionTriggerStyle}
            iconType={iconType}
          >
            <div className="col-span-11">
              <p className="text-[14px] flex flex-wrap">
                <span className="font-semibold capitalize">{mainLabel}</span>
                &nbsp;{subLabel}
                <img className={refundImageLabelStyle} src={imageLabel} />
              </p>
            </div>
          </AccordionTrigger>
          <AccordionContent className="p-3 font-light">
            <img src={accordionContentImage} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
