import useEmblaCarousel from "embla-carousel-react";
import { useIsMobileWidth } from "@/hooks/use-mobile-width";

type Props = {
  images: string[];
  productName?: string;
  mobileCarouselStyle?: string;
  mobileCarouselWrapperStyle?: string;
  mobileImageContainerStyle?: string;
  mobileImageStyle?: string;
  desktopGridStyle?: string;
  desktopImageContainerStyle?: string;
  desktopImageStyle?: string;
};

const ProductImages = (props: Props) => {
  const {
    images,
    productName,
    mobileCarouselStyle = "",
    mobileCarouselWrapperStyle = "flex",
    mobileImageContainerStyle = "flex-shrink-0 flex-grow-0 basis-[80%] min-w-0 relative h-full w-full px-2",
    mobileImageStyle = "object-contain w-full",
    desktopGridStyle = "grid grid-cols-2 gap-2",
    desktopImageContainerStyle = "",
    desktopImageStyle = "object-contain",
  } = props;
  const [emblaRef] = useEmblaCarousel({ loop: true });
  const isMobileWidth = useIsMobileWidth();

  if (isMobileWidth) {
    return (
      <div ref={emblaRef} className={mobileCarouselStyle}>
        <div className={mobileCarouselWrapperStyle}>
          {images.map((image) => {
            return (
              <div key={image} className={mobileImageContainerStyle}>
                <img
                  src={image}
                  className={mobileImageStyle}
                  alt={productName}
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
      {images.map((image) => {
        return (
          <div key={image} className={desktopImageContainerStyle}>
            <img src={image} className={desktopImageStyle} alt={productName} />
          </div>
        );
      })}
    </div>
  );
};

export default ProductImages;
