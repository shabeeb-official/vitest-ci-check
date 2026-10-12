import { Product } from "@/types/product";
import { useCallback, useEffect, useState } from "react";
import ProductImages from "../product-image";
import { Loader } from "lucide-react";
import { debug } from "debug";
import { Render } from "../conditional";
import { useProdctDetail } from "@/store/product-detail";
import FavoriteButton from "../favorites-button";
import { useIsMobileWidth } from "@/hooks/use-mobile-width";
import usePreloadImages from "@/hooks/use-preload-images";

const log = debug("app:ProductPageImages");

const TOTAL_GRID_IMAGE_COUNT = 4;

const getUniqueImageUrls = (product: Product): string[] => {
  const urls = [
    product?.mainImageUrl,
    ...(product?.imageUrl?.split(",") || []),
  ]
    .map((url) => url?.trim())
    .filter((url): url is string => Boolean(url));

  return Array.from(new Set(urls));
};

type ImageDisplayProps = {
  loadingText?: string;
  loadingTextStyle?: string;
  imageGridStyle?: string;
  mobileCarouselStyle?: string;
  mobileCarouselWrapperStyle?: string;
  mobileImageContainerStyle?: string;
  mobileImageStyle?: string;
  desktopGridStyle?: string;
  desktopImageContainerStyle?: string;
  desktopImageStyle?: string;
  showFavorite?: boolean;
};

const ImageDisplay = ({
  loadingText = "",
  loadingTextStyle = "",
  imageGridStyle = "",
  mobileCarouselStyle,
  mobileCarouselWrapperStyle,
  mobileImageContainerStyle,
  mobileImageStyle,
  desktopGridStyle,
  desktopImageContainerStyle,
  desktopImageStyle,
  showFavorite,
}: ImageDisplayProps) => {
  const [failedImages, setFailedImages] = useState<string[]>([]);
  const product = useProdctDetail();
  const shouldShowFavorite = showFavorite !== false;
  const isMobile = useIsMobileWidth();

  useEffect(() => {
    setFailedImages([]);
  }, [product?.id]);

  const validImages = product?.id
    ? getUniqueImageUrls(product)
        .slice(0, TOTAL_GRID_IMAGE_COUNT)
        .filter((url) => !failedImages.includes(url))
    : [];

  usePreloadImages(validImages);

  const handleImageError = useCallback((failedUrl: string) => {
    log("Failed to load image: %s", failedUrl);
    setFailedImages((images) =>
      images.includes(failedUrl) ? images : [...images, failedUrl],
    );
  }, []);

  return (
    <div className={imageGridStyle}>
      <Render
        when={!isMobile && shouldShowFavorite}
        show={<FavoriteButton sku={product.sku} />}
      />
      <Render
        when={!validImages.length}
        show={
          <div className="w-full h-full relative">
            <div className="flex flex-1 items-center justify-center w-full bg-white h-full">
              <Loader className="h-4 w-4 mr-2 animate-spin" />
              <h2 className={loadingTextStyle}>{loadingText}</h2>
            </div>
          </div>
        }
        otherwise={
          <ProductImages
            productImages={validImages}
            onImageError={handleImageError}
            mobileCarouselStyle={mobileCarouselStyle}
            mobileCarouselWrapperStyle={mobileCarouselWrapperStyle}
            mobileImageContainerStyle={mobileImageContainerStyle}
            mobileImageStyle={mobileImageStyle}
            desktopGridStyle={desktopGridStyle}
            desktopImageContainerStyle={desktopImageContainerStyle}
            desktopImageStyle={desktopImageStyle}
          />
        }
      />
    </div>
  );
};

export default ImageDisplay;
