import { Product } from "@/types/product";
import checkImageValidity from "@/utils/check-image-validity";

const defaultDetailData: Product = {
  id: "",
  sku: "",
  title: "",
  price: "",
  brand: "",
  imageUrl: "",
  description: "",
  sale_price: "",
  pattern: "",
  trend: "",
  colors: [],
  sizes: [],
  images: [],
  mainImageUrl: "",
  swatch: "",
  swatchName: "",
  designerNotes: "",
};

export function getActiveProductVariant(variants: Product[], sku: string) {
  if (!variants) {
    return defaultDetailData;
  }
  if (variants?.length === 0) {
    return defaultDetailData;
  }
  const activeVariant = variants?.find((v) => v.sku === sku);
  const test = activeVariant ? activeVariant : variants[0];
  return test;
}

export function extractAndParseImagesFromProduct(product: Product) {
  return [product.mainImageUrl, ...(product.imageUrl.split(",") || [])];
}

export async function preloadImages(imageURI: string[]) {
  const imageUrlsToCheck = [...imageURI];
  const results = await Promise.allSettled(
    imageUrlsToCheck.map(checkImageValidity),
  );

  const loadedImages = results
    .filter((result) => result.status === "fulfilled")
    .map((result) => (result as PromiseFulfilledResult<string>).value);

  return loadedImages;
}
