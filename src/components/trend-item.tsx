import RenderLoop from "@/components/render-loop";
import useEmblaCarousel from "embla-carousel-react";
import { useIsMobileWidth } from "@/hooks/use-mobile-width";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";
import { PATHS } from "@/paths";
import { startTransition } from "react";
import AutoScroll from "embla-carousel-auto-scroll";

type TrendItem = {
  id: number;
  trendimageicon: string;
  trendname: string;
};
type TrendStyles = {
  trendHeader?: string;
  trendCarausal?: string;
  trendItem?: string;
  trendImage?: string;
  trendNameContainer?: string;
  trendName?: string;
};

const TrendCarausal = ({
  trends,
  styles = {},
}: {
  trends: TrendItem[];
  styles: TrendStyles;
}) => {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [
    AutoScroll({
      direction: "forward",
      speed: 1.5,
      stopOnFocusIn: false,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    }),
  ]);
  const isMobileWidth = useIsMobileWidth();

  const navigate = useNavigate();
  const onTrendClick = (trendName: string) => {
    startTransition(() => navigate(PATHS.products.trend(trendName)));
  };

  return (
    <div className={clsx("mt-5 mb-5", isMobileWidth ? "w-[90%]" : "w-[45%]")}>
      <p className={clsx(styles.trendHeader, "text-md mb-3")}>Trending</p>
      <div
        ref={emblaRef}
        className={clsx(styles.trendCarausal, "overflow-hidden")}
      >
        <div className="flex cursor-pointer">
          <RenderLoop
            list={trends}
            render={(item: TrendItem, idx) => {
              return (
                <div
                  onClick={() => onTrendClick(item.trendname)}
                  key={item.id + idx}
                  className={clsx(
                    styles.trendItem,
                    "min-w-0 relative px-2 flex-grow-0 flex-shrink-0",
                  )}
                >
                  <img
                    src={item.trendimageicon}
                    className={clsx(
                      styles.trendImage,
                      "rounded-lg h-[230px] w-[190px]",
                    )}
                  />
                  <div
                    className={clsx(
                      styles.trendNameContainer,
                      "absolute bottom-[10%] text-white text-xl w-full text-center",
                    )}
                  >
                    <p className={clsx(styles.trendName, "text-center")}>
                      {item.trendname}
                    </p>
                  </div>
                </div>
              );
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default TrendCarausal;
