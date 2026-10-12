import { genUUID } from "@/utils/gen-id";
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
import { useIsMobileWidth } from "@/hooks/use-mobile-width";
import { SIZE_GUIDE_URI } from "@/config";

const DETAILS_VALUE = "detail";

const SizeGuide = ({
  linkLabel = "",
  linkURL = SIZE_GUIDE_URI,
}: {
  linkLabel?: string;
  linkURL?: string;
}) => {
  const isMobileWidth = useIsMobileWidth();
  if (isMobileWidth) return null;

  const onOpenSizeGuide = () => {
    window.open(linkURL, "_blank");
  };

  return (
    <span
      className="capitalize underline underline-offset-1 cursor-pointer"
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

const AdditionalDetails = ({
  items = _defaultData,
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
  const [selected, setSelected] = useState("");

  const renderContent = (item: any) => {
    if (item.contentType === "text") {
      return (
        <>
          <p>{item.content}</p>
          <SizeGuide linkLabel={item.linkLabel} linkURL={item.linkURL} />
        </>
      );
    }

    if (item.contentType === "list") {
      const listItems = item.listItems
        .map((line: string) => line.trim())
        .filter((line: string) => line.length > 0);

      return (
        <ul className="list-disc list-inside space-y-2 text-sm">
          {listItems.map((listItem: string, idx: number) => (
            <li key={idx} className="text-gray-700">
              {listItem}
            </li>
          ))}
        </ul>
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
        <div className="space-y-6 text-sm">
          {sections.map((section, idx) => (
            <div key={idx}>
              <div className="font-semibold text-gray-900 mb-2">
                {section.title}
              </div>

              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {section.items.map((text, i) => (
                  <li key={i}>{text}</li>
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
              setSelected(v);
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

type DeliveryAndReturnProps = {
  item: any;
};
export const DeliveryAndReturn = (props: DeliveryAndReturnProps) => {
  const { item } = props;
  return (
    <>
      <div className="flex justify-start">
        <div className="w-full max-w-4xl overflow-hidden bg-white border">
          <table className="w-full text-left text-gray-700 overflow-scroll">
            <thead className="text-xs text-gray-600 capitalize bg-gray-100">
              <tr>
                {item.tableData.headers.map((header: string, idx: number) => (
                  <th
                    key={idx}
                    scope="col"
                    className={`${"font-medium border-r p-2"} ${idx < item.tableData.headers.length - 1 ? "border-r" : ""}`}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {item.tableData.rows.map((row: any, rowIdx: number) => (
                <tr
                  key={rowIdx}
                  className={
                    rowIdx < item.tableData.rows.length - 1 ? "border-b" : ""
                  }
                >
                  <td className="p-2 delivery-table-col-one">{row.method}</td>
                  <td className="p-2 delivery-table-col-two">
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
                  <td className="p-2 delivery-table-col-three">
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
