import { Product } from "@/types/product";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Loader,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { debug } from "debug";
import { Render } from "../conditional";
import { useProdctDetail } from "@/store/product-detail";
import FavoriteButton from "../favorites-button";
import { useIsMobileWidth } from "@/hooks/use-mobile-width";
import ProductImages from "../product-image";
import usePreloadImages from "@/hooks/use-preload-images";

const log = debug("app:ImageThumbnailCarousel");

const getUniqueImageUrls = (product: Product): string[] => {
  const urls = [
    product?.mainImageUrl,
    ...(product?.imageUrl?.split(",") || []),
  ]
    .map((url) => url?.trim())
    .filter((url): url is string => Boolean(url));

  return Array.from(new Set(urls));
};

type ThumbnailPosition = "left" | "right" | "top" | "bottom";

type ImageThumbnailCarouselProps = {
  loadingText?: string;
  loadingTextStyle?: string;

  wrapperStyle?: string;
  containerStyle?: string;

  mainImageWrapperStyle?: string;
  mainImageStyle?: string;

  thumbnailWrapperStyle?: string;
  thumbnailListStyle?: string;
  thumbnailItemStyle?: string;
  thumbnailActiveStyle?: string;
  thumbnailImageStyle?: string;

  arrowWrapperStyle?: string;
  arrowStyle?: string;

  thumbnailPosition?: ThumbnailPosition;

  showFavorite?: boolean;
  mobileCarouselStyle?: string;
  mobileCarouselWrapperStyle?: string;
  mobileImageContainerStyle?: string;
  mobileImageStyle?: string;
  desktopGridStyle?: string;
  desktopImageContainerStyle?: string;
  desktopImageStyle?: string;
  imageGridStyle?: string;
};

const ImageThumbnailCarousel = ({
  loadingText = "",
  loadingTextStyle = "",

  wrapperStyle = "",
  containerStyle = "",

  mainImageWrapperStyle = "",
  mainImageStyle = "",

  thumbnailWrapperStyle = "",
  thumbnailListStyle = "",
  thumbnailItemStyle = "",
  thumbnailActiveStyle = "",
  thumbnailImageStyle = "",

  arrowWrapperStyle = "",
  arrowStyle = "",

  thumbnailPosition = "left",

  showFavorite,
  mobileCarouselStyle = "",
  mobileCarouselWrapperStyle = "flex",
  mobileImageContainerStyle = "flex-shrink-0 flex-grow-0 basis-[80%] min-w-0 relative h-full w-full px-2",
  mobileImageStyle = "object-contain w-full",
  desktopGridStyle = "grid grid-cols-2 gap-2",
  desktopImageContainerStyle = "",
  desktopImageStyle = "object-contain",
  imageGridStyle = "",
}: ImageThumbnailCarouselProps) => {
  const [failedImages, setFailedImages] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const product = useProdctDetail();
  const isMobile = useIsMobileWidth();
  const shouldShowFavorite = showFavorite !== false;

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFailedImages([]);
    setSelectedIndex(0);
  }, [product?.id]);

  const validImages = product?.id
    ? getUniqueImageUrls(product).filter((url) => !failedImages.includes(url))
    : [];

  usePreloadImages(validImages);

  const handleImageError = useCallback((failedUrl: string) => {
    log("Failed to load image: %s", failedUrl);
    setFailedImages((images) =>
      images.includes(failedUrl) ? images : [...images, failedUrl],
    );
  }, []);

  useEffect(() => {
    if (selectedIndex >= validImages.length) {
      setSelectedIndex(Math.max(0, validImages.length - 1));
    }
  }, [selectedIndex, validImages.length]);

  const isVertical =
    thumbnailPosition === "left" || thumbnailPosition === "right";

  const scrollThumbnails = (direction: "prev" | "next") => {
    if (!scrollRef.current) return;

    const scrollAmount = 100;

    if (isVertical) {
      scrollRef.current.scrollBy({
        top: direction === "next" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      });
    } else {
      scrollRef.current.scrollBy({
        left: direction === "next" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const renderArrows = () => {
    if (!validImages.length) return null;

    if (isVertical) {
      return (
        <>
          <div
            className={arrowWrapperStyle}
            onClick={() => scrollThumbnails("prev")}
          >
            <ChevronUp className={arrowStyle} />
          </div>
          <div
            className={arrowWrapperStyle}
            onClick={() => scrollThumbnails("next")}
          >
            <ChevronDown className={arrowStyle} />
          </div>
        </>
      );
    }

    return (
      <>
        <div
          className={arrowWrapperStyle}
          onClick={() => scrollThumbnails("prev")}
        >
          <ChevronLeft className={arrowStyle} />
        </div>
        <div
          className={arrowWrapperStyle}
          onClick={() => scrollThumbnails("next")}
        >
          <ChevronRight className={arrowStyle} />
        </div>
      </>
    );
  };

  const layoutDirectionMap = {
    left: "flex-row",
    right: "flex-row-reverse",
    top: "flex-col",
    bottom: "flex-col-reverse",
  };

  if (isMobile) {
    return (
      <div className={imageGridStyle}>
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
      </div>
    );
  }

  return (
    <div className={wrapperStyle}>
      {/* <Render
        when={!isMobile && shouldShowFavorite}
        show={<FavoriteButton sku={product.sku} />}
      /> */}

      <Render
        when={!validImages.length}
        show={
          <div className="flex items-center justify-center w-full h-full bg-white">
            <Loader className="h-4 w-4 mr-2 animate-spin" />
            <span className={loadingTextStyle}>{loadingText}</span>
          </div>
        }
        otherwise={
          <div
            className={`flex ${layoutDirectionMap[thumbnailPosition]} ${containerStyle}`}
          >
            {/* Thumbnail Section */}
            <div
              className={`
                ${thumbnailWrapperStyle}
                ${isVertical ? "flex flex-col items-center" : "flex flex-row items-center w-full"}
              `}
            >
              {/* Vertical Layout */}
              {isVertical ? (
                <>
                  {/* Top Arrow */}
                  <div
                    className={arrowWrapperStyle}
                    onClick={() => scrollThumbnails("prev")}
                  >
                    <ChevronUp className={arrowStyle} />
                  </div>

                  {/* Thumbnail List */}
                  <div
                    ref={scrollRef}
                    className={`
                      ${thumbnailListStyle}
                      ${isVertical ? "flex flex-col overflow-y-auto h-[600px]" : "flex flex-row overflow-x-auto w-full"}
                    `}
                    style={{
                      msOverflowStyle: "none",
                      scrollbarWidth: "none",
                    }}
                  >
                    <style>
                      {`
                        div::-webkit-scrollbar {
                          display: none;
                        }
                      `}
                    </style>
                    {validImages.map((img, index) => (
                      <div
                        key={index}
                        onClick={() => setSelectedIndex(index)}
                        className={`${thumbnailItemStyle} ${
                          selectedIndex === index ? thumbnailActiveStyle : ""
                        }`}
                      >
                        <img
                          src={img}
                          // alt={`thumbnail-${index}`}
                          alt=""
                          className={thumbnailImageStyle}
                          loading="eager"
                          decoding="async"
                          fetchPriority="high"
                          onError={() => handleImageError(img)}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Bottom Arrow */}
                  <div
                    className={arrowWrapperStyle}
                    onClick={() => scrollThumbnails("next")}
                  >
                    <ChevronDown className={arrowStyle} />
                  </div>
                </>
              ) : (
                <>
                  {/* Left Arrow */}
                  <div
                    className={arrowWrapperStyle}
                    onClick={() => scrollThumbnails("prev")}
                  >
                    <ChevronLeft className={arrowStyle} />
                  </div>

                  {/* Thumbnail List */}
                  <div
                    ref={scrollRef}
                    className={`
                      ${thumbnailListStyle}
                      ${isVertical ? "flex flex-col overflow-y-auto h-[600px]" : "flex flex-row overflow-x-auto w-full"}
                    `}
                    style={{
                      msOverflowStyle: "none",
                      scrollbarWidth: "none",
                    }}
                  >
                    <style>
                      {`
                        div::-webkit-scrollbar {
                          display: none;
                        }
                      `}
                    </style>
                    {validImages.map((img, index) => (
                      <div
                        key={index}
                        onClick={() => setSelectedIndex(index)}
                        className={`${thumbnailItemStyle} ${
                          selectedIndex === index ? thumbnailActiveStyle : ""
                        }`}
                      >
                        <img
                          src={img}
                          // alt={`thumbnail-${index}`}
                          alt=""
                          className={thumbnailImageStyle}
                          loading="eager"
                          decoding="async"
                          fetchPriority="high"
                          onError={() => handleImageError(img)}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Right Arrow */}
                  <div
                    className={arrowWrapperStyle}
                    onClick={() => scrollThumbnails("next")}
                  >
                    <ChevronRight className={arrowStyle} />
                  </div>
                </>
              )}
            </div>

            {/* Main Image */}
            <div className={mainImageWrapperStyle}>
              {validImages[selectedIndex] && (
                <img
                  src={validImages[selectedIndex]}
                  alt="Product Image"
                  className={mainImageStyle}
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  onError={() => handleImageError(validImages[selectedIndex])}
                />
              )}
            </div>
          </div>
        }
      />
    </div>
  );
};

export default ImageThumbnailCarousel;
