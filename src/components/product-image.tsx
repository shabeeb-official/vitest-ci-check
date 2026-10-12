import useEmblaCarousel from "embla-carousel-react";
import { useIsMobileWidth } from "@/hooks/use-mobile-width";

const ProductImages = ({
  productImages,
  productName,
  onImageError,
  mobileCarouselStyle = "",
  mobileCarouselWrapperStyle = "flex",
  mobileImageContainerStyle = "flex-shrink-0 flex-grow-0 basis-[80%] min-w-0 relative h-full w-full px-2",
  mobileImageStyle = "object-contain w-full",
  desktopGridStyle = "grid grid-cols-2 gap-2",
  desktopImageContainerStyle = "",
  desktopImageStyle = "object-contain",
}: {
  productImages: string[];
  productName?: string;
  onImageError?: (url: string) => void;
  mobileCarouselStyle?: string;
  mobileCarouselWrapperStyle?: string;
  mobileImageContainerStyle?: string;
  mobileImageStyle?: string;
  desktopGridStyle?: string;
  desktopImageContainerStyle?: string;
  desktopImageStyle?: string;
}) => {
  const [emblaRef] = useEmblaCarousel({ loop: true });
  const isMobileWidth = useIsMobileWidth();

  if (isMobileWidth) {
    return (
      <div ref={emblaRef} className={mobileCarouselStyle}>
        <div className={mobileCarouselWrapperStyle}>
          {productImages.map((image, index) => {
            return (
              <div key={image} className={mobileImageContainerStyle}>
                <img
                  src={image}
                  className={mobileImageStyle}
                  alt={productName}
                  loading="eager"
                  decoding="async"
                  fetchPriority={index === 0 ? "high" : "auto"}
                  onError={() => onImageError?.(image)}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className={desktopGridStyle}>
      {productImages.map((image, index) => {
        return (
          // Reserve height so overflow-hidden parents don't treat later
          // images as zero-size / off-screen (which defers their fetch until
          // the first image finishes and expands layout).
          <div
            key={image}
            className={`${desktopImageContainerStyle} min-h-[280px] w-full`}
          >
            <img
              src={image}
              className={`${desktopImageStyle} w-full h-full`}
              alt={productName}
              loading="eager"
              decoding="async"
              fetchPriority={index === 0 ? "high" : "auto"}
              onError={() => onImageError?.(image)}
            />
          </div>
        );
      })}
    </div>
  );
};

export default ProductImages;
