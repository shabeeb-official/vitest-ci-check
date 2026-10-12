import FilterItem from "./filter-item";
import { FilterTypes } from "@/types/product";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

type SortPopupProps = {
  onChange: () => void;
  brands: string[];
  value: FilterTypes;
  onSelect: (v: FilterTypes) => void;
};

const BrandPopup = ({ onChange, onSelect, brands, value }: SortPopupProps) => {
  return <FilterItem label="brand" onOpen={onChange} />;
};

export default BrandPopup;
