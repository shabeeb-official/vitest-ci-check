import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
// import { AccordionTrigger } from "@radix-ui/react-accordion";
import { useProdctDetail } from "@/store/product-detail";
import { useState } from "react";
import useAccordionToggle from "@/hooks/use-accordion-toggle";
import { DEFAULT_REGION, SIZE_GUIDE_URI } from "@/config";
import useGetCountry from "@/hooks/use-country";
import { useRegion } from "@/contexts/layoutContext";

const DETAILS_VALUE = "detail";

const SizeGuide = ({
  linkLabel = "",
  linkURL = SIZE_GUIDE_URI,
  textStyle,
}: {
  linkLabel?: string;
  linkURL?: string;
  textStyle: string;
}) => {
  const onOpenSizeGuide = () => {
    window.open(linkURL, "_self");
  };

  return (
    <span
      className={`${textStyle} capitalize underline underline-offset-1 cursor-pointer`}
      onClick={onOpenSizeGuide}
    >
      {linkLabel}
    </span>
  );
};

export const Details = ({
  moreDetailsLabel = "details",
  moreDetailsStyle,
}: {
  moreDetailsLabel?: string;
  moreDetailsStyle?: any;
}) => {
  const product = useProdctDetail();
  const [open, handleToggle] = useAccordionToggle();
  const iconType = moreDetailsStyle?.iconType || "chevron";

  return (
    <div>
      <Accordion
        type="single"
        collapsible
        onValueChange={handleToggle(DETAILS_VALUE)}
        className={
          moreDetailsStyle
            ? moreDetailsStyle.moreDetailsAccordionWrapper
            : "w-full border-b border-gray-200"
        }
      >
        <AccordionItem value={DETAILS_VALUE} className="border-b-0 w-full">
          <AccordionTrigger
            className={
              moreDetailsStyle
                ? moreDetailsStyle.moreDetailsText
                : "capitalize font-semibold w-full text-left p-3 flex justify-between"
            }
            iconType={iconType}
          >
            {moreDetailsLabel}
          </AccordionTrigger>
          <AccordionContent className="p-3">
            <div className="grid grid-cols-12 gap-y-3">
              <DetailItem
                moreDetailsStyle={moreDetailsStyle}
                label="brand"
                value={product.brand}
              />
              <DetailItem
                moreDetailsStyle={moreDetailsStyle}
                label="product"
                value={product.title}
              />
              <DetailItem
                moreDetailsStyle={moreDetailsStyle}
                label="pattern"
                value={product.pattern}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

const DetailItem = ({
  label,
  value,
  moreDetailsStyle,
}: {
  label: string;
  value: string;
  moreDetailsStyle?: any;
}) => {
  return (
    <>
      <p
        className={
          moreDetailsStyle
            ? moreDetailsStyle.moreDetailsItem
            : "capitalize col-span-6 text-[0.875rem]"
        }
      >
        {label}:
      </p>
      <p
        className={
          moreDetailsStyle
            ? moreDetailsStyle.moreDetailsValue
            : "col-span-6 text-[0.875rem]"
        }
      >
        {value}
      </p>
    </>
  );
};

const parseDesignerNotes = (notes: string): string[] => {
  if (!notes) return [];

  return notes
    .split(/\.\s+|\.(?=[A-Z])/g) // split on ". " or ".<Capital>"
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
    .map((item) => (item.endsWith(".") ? item : `${item}.`));
};

const AdditionalDetails = ({
  items = _defaultData,
  textStyle = "text-gray-600 marker:text-gray-400",
  accordionWrapperStyle = "w-full border-b border-gray-200",
  accordionTriggerStyle = "capitalize font-semibold w-full text-left p-3 flex justify-between",
  accordionContentStyle = "p-3 font-light",
  iconType = "plus",
  deliveryTableStyle = "w-full max-w-4xl overflow-hidden bg-white border",
  deliveryTableRowStyle = "w-full text-left text-gray-700 overflow-scroll",
  deliveryTableHeadStyle = "text-xs text-gray-600 capitalize bg-gray-100",
  deliveryTableHeaderCellStyle = "font-medium border-r p-2",
  deliveryTableDataCellStyle = "p-2",
}: {
  items?: any[];
  textStyle?: string;
  accordionWrapperStyle?: string;
  accordionTriggerStyle?: string;
  accordionContentStyle?: string;
  iconType?: "chevron" | "plus";
  deliveryTableStyle?: string;
  deliveryTableRowStyle?: string;
  deliveryTableHeadStyle?: string;
  deliveryTableHeaderCellStyle?: string;
  deliveryTableDataCellStyle?: string;
} = {}) => {
  const product = useProdctDetail();

  const country = useGetCountry();
  const region = useRegion();

  const renderContent = (item: any) => {
    if (item.contentType === "text") {
      const sizeGuide = item.linkURI?.[country || "default"];
      return (
        <>
          <p className={textStyle}>{item.content}</p>
          <SizeGuide
            linkLabel={item.linkLabel}
            linkURL={sizeGuide}
            textStyle={textStyle}
          />
        </>
      );
    }
    let listItems = [];
    if (item.contentType === "list") {
      if (item.apidata) {
        listItems = parseDesignerNotes(product.designerNotes);
      } else {
        listItems = item.listItems
          .map((line: string) => line.trim())
          .filter((line: string) => line.length > 0);
      }

      return (
        <ul className="list-disc list-outside pl-3 space-y-2 ">
          {listItems.map((listItem: string, idx: number) => (
            <li key={idx} className={textStyle}>
              {listItem}
            </li>
          ))}
        </ul>
      );
    }

    if (item.contentType === "list-objects") {
      console.log(region);
      return (
        <div className="space-y-6">
          {item.listItems.map((section, idx: number) => {
            const { title, items } = section;
            const itemList = items[region]
              ? items[region]
              : items[DEFAULT_REGION];
            return (
              <div key={idx} className="pl-0">
                <div className="font-light mb-2 text-[15px] text-[#391E13]">
                  {title}
                </div>
                <ul className="list-disc list-outside pl-3 space-y-2">
                  {itemList.map((text, i: number) => (
                    <li key={i} className={textStyle}>
                      {text}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      );
    }
    if (item.contentType === "listWithTitle") {
      const cleanedItems = item.listItems
        .map((line: string) => line.trim())
        .filter(Boolean);

      const sections: { title: string; items: string[] }[] = [];

      cleanedItems.forEach((line) => {
        const isTitle = line === line.toUpperCase();

        if (isTitle) {
          sections.push({ title: line, items: [] });
        } else {
          sections[sections.length - 1]?.items.push(line);
        }
      });

      return (
        <div className="space-y-6">
          {sections.map((section, idx) => (
            <div key={idx} className="pl-0">
              <div className="font-light mb-2 text-[17px] text-[#391E13]">
                {section.title}
              </div>

              <ul className="list-disc list-outside pl-3 space-y-2">
                {section.items.map((text, i) => (
                  <li key={i} className={textStyle}>
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      );
    }

    if (item.contentType === "table") {
      return (
        <>
          <div className="flex justify-start">
            <div className={deliveryTableStyle}>
              <table className={deliveryTableRowStyle}>
                <thead className={deliveryTableHeadStyle}>
                  <tr>
                    {item.tableData.headers.map(
                      (header: string, idx: number) => (
                        <th
                          key={idx}
                          scope="col"
                          className={`${deliveryTableHeaderCellStyle} ${idx < item.tableData.headers.length - 1 ? "border-r" : ""}`}
                        >
                          {header}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {item.tableData.rows.map((row: any, rowIdx: number) => (
                    <tr
                      key={rowIdx}
                      className={
                        rowIdx < item.tableData.rows.length - 1
                          ? "border-b"
                          : ""
                      }
                    >
                      <td
                        className={`${deliveryTableDataCellStyle} delivery-table-col-one`}
                      >
                        {row.method}
                      </td>
                      <td
                        className={`${deliveryTableDataCellStyle} delivery-table-col-two`}
                      >
                        {row.times.map((time: any, timeIdx: number) => (
                          <div key={timeIdx}>
                            <div className="delivery-table-medium-text">
                              {time.region}
                            </div>
                            <div className="delivery-table-normal-text">
                              {time.days}
                            </div>
                          </div>
                        ))}
                      </td>
                      <td
                        className={`${deliveryTableDataCellStyle} delivery-table-col-three`}
                      >
                        <div className="delivery-table-normal-text whitespace-pre-line">
                          {row.cost}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {item.additionalInfo && (
            <>
              {item.additionalInfo.map((info: any, idx: number) => (
                <p key={idx}>
                  {info.text}
                  <a
                    href={info.link}
                    target="_blank"
                    className="underline underline-offset-1"
                  >
                    {info.linkText}
                  </a>
                  {info.suffix}
                </p>
              ))}
            </>
          )}
        </>
      );
    }

    return null;
  };

  return (
    <>
      {items.map((item: any) => {
        return (
          <Accordion
            key={item.id}
            type="single"
            collapsible
            onValueChange={(v) => {
              console.log(v);
            }}
            className={accordionWrapperStyle}
          >
            <AccordionItem value={item.id} className="border-b-0 w-full">
              <AccordionTrigger
                className={accordionTriggerStyle}
                iconType={iconType}
              >
                {item.title}
              </AccordionTrigger>
              <AccordionContent className={accordionContentStyle}>
                {renderContent(item)}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        );
      })}
    </>
  );
};

const _defaultData = [
  {
    id: "size-fit",
    title: "size & fit",
    contentType: "text",
    content:
      "Please refer to our size guide to see what size is right for you! Keep in mind, sizes between brands are likely to vary, so please use the measurements as a guide only.",
  },
  {
    id: "delivery-return",
    title: "delivery & return",
    contentType: "table",
    tableData: {
      headers: ["Shipping Methods", "Shipping Times", "Cost"],
      rows: [
        {
          method: "Express",
          times: [
            { region: "Metro", days: "1-4 business days" },
            { region: "Regional/Rural", days: "1-7 business days" },
          ],
          cost: "$13.99",
        },
        {
          method: "Standard",
          times: [
            { region: "Metro", days: "2-10 business days" },
            { region: "Regional/Rural", days: "2-13 business days" },
          ],
          cost: "$10.99 or $2\nFree for orders over $100",
        },
      ],
    },
    additionalInfo: [
      {
        text: "For other delivery methods, ",
        link: "https://www.citybeach.com/au/shipping-and-handling.html",
        linkText: "click here",
        suffix: " for shipping and delivery times.",
      },
      {
        text: "Not 100% happy with your purchase? We offer online and in-store returns within 30 days of delivery*. For more information, please ",
        link: "https://www.citybeach.com/au/returns-and-exchanges.html",
        linkText: "click here",
      },
    ],
  },
];

export default AdditionalDetails;
