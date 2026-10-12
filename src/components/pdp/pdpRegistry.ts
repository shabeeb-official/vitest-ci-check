import HeaderBar from "./header-bar";
import PDPWrapper from "./main-grid";
import ProductDetail from "./product-detail-wrapper";
import { ProductBrandComponent } from "./brand";
import RecommendedProductsComponent from "./recommended";
import { ProductTitleWithFav } from "./title";
import { ProductPriceComponent } from "./price";
import { ColorSelector } from "./color";
import { SizeSelector } from "./size";
import { BuyNowButtonComponent, BuyNowPayLaterComponent } from "./buy-now";
import { ProductNumberComponent } from "./product-number";
import {
  ProductDescriptionComponent,
  ProductMoreDetailsComponent,
} from "./product-detail";
import { AdditionalDetailsComponent } from "./additional-details";
import { PointsAccordionComponent } from "./points";
import { RefundidAccordionComponent } from "./refundid";
import ExpandeSunny from "@/components/expand-sunny";
import BackToProducts from "@/components/product-page/back-to-products";
import ImageDisplay from "@/components/product-page/image-display";
import { DynamicVariantSelector } from "./dynamic-selectors";

import { QuantitySelector } from "./quantity";
import { DynamicAdditionalDetailsComponent } from "./dynamic-additional-details";
import ImageThumbnailCarousel from "../product-page/image-thumbnail-carousel";

export const pdpRegistry = {
  HeaderBar,
  ExpandeSunny,
  BackToProducts,
  PDPWrapper,
  ImageDisplay,
  ProductDetail,
  ProductBrandComponent,
  ProductTitleWithFav,
  ProductPriceComponent,
  ColorSelector,
  SizeSelector,
  DynamicVariantSelector,
  QuantitySelector, // Registered new component
  BuyNowButtonComponent,
  PointsAccordionComponent,
  RefundidAccordionComponent,
  BuyNowPayLaterComponent,
  ProductDescriptionComponent,
  ProductMoreDetailsComponent,
  AdditionalDetailsComponent,
  DynamicAdditionalDetailsComponent,
  ProductNumberComponent,
  RecommendedProductsComponent,
  ImageThumbnailCarousel,
};

export default pdpRegistry;
