import { useIsMobileWidth } from "@/hooks/use-mobile-width";
import useEmblaCarousel from "embla-carousel-react";
import { ReactNode, useEffect } from "react";

type ImageCarouselProps = {
  as: "div";
  className: string;
  children: ReactNode;
};

export const ImageCarousel = (props: ImageCarouselProps) => {
  const { children, className } = props;
  const isMobile = useIsMobileWidth();

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  useEffect(() => {
    if (!emblaApi) return;

    requestAnimationFrame(() => {
      emblaApi.reInit();
    });
  }, [emblaApi]);

  return (
    <div className={className} ref={isMobile ? emblaRef : null}>
      {children}
    </div>
  );
};
