import useEmblaCarousel from "embla-carousel-react";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";
import { PATHS } from "@/paths";
import { ReactNode, startTransition } from "react";
import AutoScroll from "embla-carousel-auto-scroll";
type TrendsScrollerProps = {
  className: string;
  children: ReactNode;
  name?: string;
};
const TrendsScroller = (props: TrendsScrollerProps) => {
  const { className, children } = props;

  const [emblaRef] = useEmblaCarousel({ loop: true }, [
    AutoScroll({
      direction: "forward",
      speed: 1.5,
      stopOnFocusIn: false,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    }),
  ]);

  return (
    <div ref={emblaRef} className={clsx(className, "overflow-hidden")}>
      {children}
    </div>
  );
};

export const TrendClick = (props: TrendsScrollerProps) => {
  const { name, children, className } = props;

  const navigate = useNavigate();
  return (
    <div
      className={clsx(className, "cursor-pointer")}
      onClick={() => {
        startTransition(() => {
          navigate(`${PATHS.products.root}?trend=${name}`);
        });
      }}
    >
      {children}
    </div>
  );
};
export default TrendsScroller;
