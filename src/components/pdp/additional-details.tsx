import AdditionalDetails from "../product-page/details";

export const AdditionalDetailsComponent = ({
  items,
  textStyle,
  accordionWrapperStyle,
  accordionTriggerStyle,
  accordionContentStyle,
  iconType,
  deliveryTableStyle,
  deliveryTableRowStyle,
  deliveryTableHeadStyle,
  deliveryTableHeaderCellStyle,
  deliveryTableDataCellStyle,
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
  return (
    <AdditionalDetails
      items={items}
      textStyle={textStyle}
      accordionWrapperStyle={accordionWrapperStyle}
      accordionTriggerStyle={accordionTriggerStyle}
      accordionContentStyle={accordionContentStyle}
      iconType={iconType}
      deliveryTableStyle={deliveryTableStyle}
      deliveryTableRowStyle={deliveryTableRowStyle}
      deliveryTableHeadStyle={deliveryTableHeadStyle}
      deliveryTableHeaderCellStyle={deliveryTableHeaderCellStyle}
      deliveryTableDataCellStyle={deliveryTableDataCellStyle}
    />
  );
};
