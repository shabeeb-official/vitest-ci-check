import currency from "@/components/currency";
import { HideSm } from "@/components/hider";
import { HideWhenChatPanelOpen, ShowSm } from "./generic/visibility";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useState, useEffect } from "react";
import useCountDown from "@/hooks/use-countdown";
import { MyAccordion, MyAccordionItem } from "./generic/accordion";
import { Box } from "./generic/box";
import { Text } from "./generic/text";
import { GenericSlider } from "./domain/genericSlider";
import { Image } from "./generic/image";
import { Link } from "./generic/link";
import { GenericProductCard } from "./domain/genericProduct";
import { ChatBubble } from "./domain/chatBubble";
import { ToggleChatWindow } from "./domain/toggleChatWindow";
import { PageWrapper } from "./domain/pageWrapper";
import ChatInputSection from "./domain/chatInputSection";
import {
  ClearFilterButton,
  FilterItem,
  FilterItemRoot,
  ExpandSunny,
  SortPopup,
} from "./domain/filterButton";
import ChatInputTextArea from "./domain/chatInputTextArea";
import ChatInputActions from "./domain/chatInputActions";
import HeaderBar from "./domain/header";
import BackToProducts from "./domain/backToProduct";
import { ProductTitleWithFav } from "./domain/productTitleWithFav";
import { ProductPriceComponent } from "./domain/productPrice";
import { ColorSelector } from "./domain/colorSelector";
import { SizeSelector } from "./domain/sizeSelector";
import {
  BuyNowButtonComponent,
  BuyNowPayLaterComponent,
} from "./domain/buyNowButtonComponent";
import { DeliveryAndReturn } from "./domain/detail";
import FavoriteButton from "./domain/favoriteButton";
import ProductImages from "./domain/productImage";
import RecommendedProductsComponent from "./domain/recommendedProductComponent";
import IconRegistry from "../utils/iconRegistry";
import { ChipAction } from "./domain/chipsSelector";
import ProductWrapper from "./domain/productWrapper";
import AddToWishlist from "./domain/addToWhishlist";
import CardWrapper from "./domain/cardWrapper";
import PdpProductSelector from "./domain/pdpProductSelector";
import QuantitySelector from "./domain/quantitySelector";
import Input from "./generic/input";
import ExpandableText from "./generic/expandabelText";
import ProductPriceFilter from "./domain/priceFilter";
import Checkbox from "./generic/checkbox";
import TrendsScroller, { TrendClick } from "./domain/trendsScroller";
import { Currency } from "./domain/currency";
import { HasDiscount } from "./domain/discountAvailable";
import HandleChatboxRef from "./domain/chatboxRef";
import OptionalRendering from "./generic/optionalRendering";
import PdpImageList from "./domain/pdpImageList";
import { PlpListDiv } from "./domain/plpList";
import { ImageCarousel } from "./domain/imagePdpRender";
import Navigate from "./domain/navigate";
import ProductsLoader from "@/components/products-loader";
import { ShimmerGrid } from "./generic/shimmer-grid";
import IdleSection from "@/components/idle-page";
import { Button } from "@/components/ui/button";

type NodeType =
  | "layout"
  | "fn"
  | "conditional"
  | "leaf"
  | "domain"
  | "transform"
  | "icon"
  | "loop"
  | "image";

export type RegistryEntry = {
  type: NodeType;
  component?: React.ComponentType<any>;
  fn?: (...args: any[]) => any;
  arity?: number;
  lenghtArity?: string;
};

const messages = {
  4: "thinking",
  3: "searching",
  2: "gathering trends",
  1: "assembling",
};

export const BotThinking = () => {
  const timeRemaining = useCountDown();

  const step = Math.ceil(timeRemaining / 5);
  const message = messages[step] ?? messages[1];

  return (
    <span className="flex items-end">
      <p className="capitalize animate-text bg-gradient-to-r from-gray-700 via-gray-500 to-gray-400 bg-clip-text text-transparent text-gray-500">
        {message}
      </p>
      <div className="loader"></div>
    </span>
  );
};

export const genericRegistry: Record<string, RegistryEntry> = {
  Accordion: {
    type: "layout",
    component: MyAccordion,
  },
  AccordionItem: {
    type: "layout",
    component: MyAccordionItem,
  },
  ScrollArea: { type: "layout", component: ScrollArea },
  ShimmerGrid: { type: "layout", component: ShimmerGrid },
  Text: {
    type: "layout",
    component: Text,
  },
  Box: {
    type: "layout",
    component: Box,
  },
  Checkbox: {
    type: "layout",
    component: Checkbox,
  },
  Image: {
    type: "layout",
    component: Image,
  },
  Currency: {
    type: "fn",
    fn: currency,
    arity: 1,
  },
  // ExpandableText: {
  //   type: "transform",
  //   component: ExpandableText,
  //   arity: 1,
  // },
  Link: {
    type: "layout",
    component: Link,
  },
  HideSm: {
    type: "layout",
    component: HideSm,
  },
  HideWhenChatPanelOpen: {
    type: "layout",
    component: HideWhenChatPanelOpen,
  },
  ShowSm: {
    type: "layout",
    component: ShowSm,
  },
  Input: {
    type: "layout",
    component: Input,
  },
  ExpandableText: {
    type: "layout",
    component: ExpandableText,
  },
  Button: { type: "layout", component: Button },
  RenderList: {
    type: "loop",
  },
  If: {
    type: "conditional",
  },
  Value: {
    type: "leaf",
    arity: 0,
  },
  OptionalRendering: {
    type: "layout",
    component: OptionalRendering,
  },
};

export const domainRegistry: Record<string, RegistryEntry> = {
  GenericSlider: {
    type: "domain",
    component: GenericSlider,
  },
  GenericProductCard: {
    type: "domain",
    component: GenericProductCard,
  },
  ChatBubble: {
    type: "domain",
    component: ChatBubble,
  },
  ToggleChatWindow: {
    type: "domain",
    component: ToggleChatWindow,
  },
  PageWrapper: {
    type: "domain",
    component: PageWrapper,
  },
  ChatInput: { type: "domain", component: ChatInputSection },
  ClearFilterButton: { type: "domain", component: ClearFilterButton },
  ChatInputTextArea: { type: "domain", component: ChatInputTextArea },
  ChatInputActions: { type: "domain", component: ChatInputActions },
  FilterItemRoot: { type: "domain", component: FilterItemRoot },
  FilterItem: { type: "domain", component: FilterItem },
  ProductPriceFilter: { type: "domain", component: ProductPriceFilter },
  HeaderBar: { type: "domain", component: HeaderBar },
  ExpandSunny: { type: "domain", component: ExpandSunny },
  SortPopup: { type: "domain", component: SortPopup },
  BackToProducts: { type: "domain", component: BackToProducts },
  ProductsLoader: { type: "domain", component: ProductsLoader },
  IdleSection: { type: "domain", component: IdleSection },
  ProductTitleWithFav: { type: "domain", component: ProductTitleWithFav },
  ProductPriceComponent: { type: "domain", component: ProductPriceComponent },
  ColorSelector: { type: "domain", component: ColorSelector },
  SizeSelector: { type: "domain", component: SizeSelector },
  BuyNowButtonComponent: { type: "domain", component: BuyNowButtonComponent },
  DeliveryAndReturn: { type: "domain", component: DeliveryAndReturn },
  FavoriteButton: { type: "domain", component: FavoriteButton },
  ProductImages: { type: "domain", component: ProductImages },
  Icon: { type: "domain", component: IconRegistry },
  RecommendedProductsComponent: {
    type: "domain",
    component: RecommendedProductsComponent,
  },
  BuyNowPayLaterComponent: {
    type: "domain",
    component: BuyNowPayLaterComponent,
  },
  ChipAction: {
    type: "domain",
    component: ChipAction,
  },
  AddToWishlist: {
    type: "domain",
    component: AddToWishlist,
  },
  CardWrapper: {
    type: "domain",
    component: CardWrapper,
  },
  ProductWrapper: {
    type: "domain",
    component: ProductWrapper,
  },
  PdpProductSelector: {
    type: "domain",
    component: PdpProductSelector,
  },
  QuantitySelector: {
    type: "domain",
    component: QuantitySelector,
  },
  TrendsScroller: {
    type: "domain",
    component: TrendsScroller,
  },
  TrendClick: {
    type: "domain",
    component: TrendClick,
  },
  Currency: {
    type: "domain",
    component: Currency,
  },
  HasDiscount: {
    type: "domain",
    component: HasDiscount,
  },
  HandleChatboxRef: {
    type: "domain",
    component: HandleChatboxRef,
  },
  Navigate: {
    type: "domain",
    component: Navigate,
  },
  PdpImageList: {
    type: "domain",
    component: PdpImageList,
  },
  PlpListDiv: {
    type: "domain",
    component: PlpListDiv,
  },
  ImageCarousel: {
    type: "domain",
    component: ImageCarousel,
  },
};

export const composeRegistry = (...registeries: any[]) => {
  return Object.assign({}, ...registeries);
};

export const iconRegistry = {};
