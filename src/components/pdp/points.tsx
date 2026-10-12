import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@radix-ui/react-accordion";

export const PointsAccordionComponent = ({
  accordionWrapperStyle,
  accordionTriggerStyle,
  pointItemStyle,
  imageUrl,
  mainLabel,
  content1 = "",
  content2 = "",
  content3 = "",
  accordionTriggerContentStyle,
  iconType = "chevron",
}: {
  accordionWrapperStyle: string;
  accordionTriggerStyle: string;
  pointItemStyle: string;
  imageUrl: string;
  mainLabel: string;
  content1?: string;
  content2?: string;
  content3?: string;
  accordionTriggerContentStyle: string;
  iconType?: "chevron" | "plus";
}) => {
  return (
    <div>
      <Accordion type="single" collapsible className={accordionWrapperStyle}>
        <AccordionItem value="points" className="border-b-0 w-full">
          <AccordionTrigger
            className={accordionTriggerStyle}
            iconType={iconType}
          >
            <div className="col-span-11 flex items-center whitespace-nowrap">
              <span className="whitespace-nowrap font-semibold capitalize mr-[8px]">
                <img className="w-[35px]" src={imageUrl} />
              </span>
              &nbsp;{mainLabel}
            </div>
          </AccordionTrigger>
          <AccordionContent className={accordionTriggerContentStyle}>
            {content1?.trim() && (
              <PointItem style={pointItemStyle}>{content1}</PointItem>
            )}

            {content2?.trim() && (
              <PointItem style={pointItemStyle}>{content2}</PointItem>
            )}

            {content3?.trim() && (
              <PointItem style={pointItemStyle}>{content3}</PointItem>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

const PointItem = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: string;
}) => {
  return <p className={style}>{children}</p>;
};
