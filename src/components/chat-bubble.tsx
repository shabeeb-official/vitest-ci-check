import { cn } from "@/lib/utils";
import { useProducts } from "@/store/products";
import { ChatMessage } from "@/types/chat";
import {
  ReactNode,
  startTransition,
  useEffect,
  useMemo,
  useState,
} from "react";
import clsx from "clsx";
import { View } from "@/pages/View";
import useGoToDetails from "@/hooks/use-goto-details";
import useCountDown from "@/hooks/use-countdown";
import { useIsMobileWidth } from "@/hooks/use-mobile-width";
import { Render } from "./conditional";
import { useLocation, useNavigate } from "react-router-dom";
import { PATHS } from "@/paths";
import { setSelectedView } from "@/utils/view";
import Currency from "./currency";
import { ProductListImage } from "./ProductListImage";
import { ProductBrand } from "./ProductBrand";
import { ProductTitle } from "./ProductTitle";
import { ProductPrice } from "./product-price";
import { selectItem } from "@/utils/gtm_events";

const messages = {
  4: "thinking",
  3: "searching",
  2: "gathering trends",
  1: "assembling",
};

const BotThinking = ({ styles }: { styles?: any }) => {
  const timeRemaining = useCountDown();
  const [message, setMessage] = useState(messages[4]);

  useEffect(() => {
    if (timeRemaining % 5 === 0) {
      const temp = messages[timeRemaining / 5];
      if (temp) {
        setMessage(temp);
      }
    }
  }, [timeRemaining]);

  return (
    <span className={styles?.wrapper ?? "flex items-end"}>
      <p
        className={
          styles?.textStyle ??
          "capitalize animate-text bg-gradient-to-r from-gray-700 via-gray-500 to-gray-400 bg-clip-text text-transparent text-gray-500"
        }
      >
        {message}
      </p>
      <div className="loader"></div>
    </span>
  );
};

export const ProductList = ({
  message,
  handleChangeView,
  isLast,
  styles,
  showBrand = true,
}: {
  message: ChatMessage;
  handleChangeView: (view: View) => void;
  isLast?: boolean;
  styles?: any;
  showBrand?: boolean;
}) => {
  const goToProduct = useGoToDetails();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isUser = message.type === "user";
  const isLastMessage = !isUser && isLast;
  const { products } = useProducts();

  const isMobile = useIsMobileWidth();

  if (!isMobile) {
    return null;
  }

  if (message.content === "loading") {
    return null;
  }

  if (products.length === 0) {
    return null;
  }

  if (message.productCount === 0) {
    return null;
  }

  if (!isLastMessage) {
    return null;
  }

  const viewAllMobileWrapper =
    styles.viewAllMobileWrapper ||
    "w-full mt-5 justify-end  flex gap-1  items-center overflow-hidden capitalize";
  const viewAllMobileBtn =
    styles.viewAllMobileBtn ||
    "whitespace-nowrap text-xs bg-black rounded-lg text-white px-2 py-1";

  const cardWidth = styles?.cardWidth ?? "w-[180px]";
  const cardImageWrap =
    styles?.imageWrap ??
    "w-[180px] h-[220px] flex items-center justify-center overflow-hidden gap-4";

  const imageStyles = {
    image:
      styles?.image ??
      "object-cover w-full h-full transform transition-transform duration-300",
  };
  const brandStyles = { brand: styles?.brand ?? "font-bold" };
  const titleStyles = {
    title:
      styles?.title ??
      "text-xs mt-1 overflow-hidden text-ellipsis line-clamp-4",
  };
  const priceStyles = {
    price: styles?.price ?? "font-semibold text-gray-900 text-nowrap",
    strike: styles?.strike ?? "text-sm font-light text-gray-400 line-through",
    sale: styles?.sale ?? "text-sm font-medium sale-item-color",
    priceWrapper:
      styles?.priceWrapper ?? " mx-4 py-4 bg-white flex justify-center",
  };
  return (
    <>
      <div className={viewAllMobileWrapper}>
        <span
          className={viewAllMobileBtn}
          onClick={() => {
            if (pathname === PATHS.products.root) {
              handleChangeView("products");
            } else {
              startTransition(() => {
                navigate(PATHS.products.root);
              });

              setSelectedView("products");
            }
          }}
        >
          view all
        </span>
      </div>

      <div className="flex gap-4 overflow-x-scroll py-2 relative">
        {products.slice(0, 4).map((product, i) => {
          return (
            <div
              key={i}
              className={`flex flex-col flex-shrink-0 cursor-pointer ${cardWidth}`}
              onClick={() => {
                handleChangeView("products");
                selectItem(product.title, product.sku);
                goToProduct(product.id, {
                  sku: product.sku,
                  brand: product.brand,
                });
              }}
            >
              <div className={styles?.base ?? ""}>
                <div className={cardImageWrap}>
                  <ProductListImage product={product} styles={imageStyles} />
                </div>
                <div className={styles?.content ?? ""}>
                  <Render
                    when={showBrand}
                    show={
                      <ProductBrand product={product} styles={brandStyles} />
                    }
                  />
                  <ProductTitle product={product} styles={titleStyles} />
                  <div className={styles?.priceWrapper ?? ""}>
                    <ProductPrice product={product} styles={priceStyles} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export const Chips = ({
  message,
  handleSend,
  styles,
}: {
  message: ChatMessage;
  handleSend: (chip: string) => void;
  styles?: any;
}) => {
  const chips = message.chips || [];

  const wrapperClass = styles?.chipsFullWrap ?? "flex flex-wrap gap-2";

  const sectionClass =
    styles?.chipsSection ??
    "whitespace-nowrap flex justify-between mt-2 p-2 bg-white rounded-lg border cursor-pointer";

  const textClass = styles?.chipText ?? "text-xs font-medium text-gray-700";

  return (
    <div className={wrapperClass}>
      {chips.map((chip: string, idx: number) => (
        <div
          key={idx}
          className={sectionClass}
          onClick={() => handleSend(chip)}
        >
          <span className={textClass}>{chip}</span>
        </div>
      ))}
    </div>
  );
};

const MessageContent = ({
  content,
  textStyle,
}: {
  content: string;
  textStyle?: string;
}) => {
  return (
    <div className="flex items-center gap-2">
      <p className={textStyle ?? "text-sm tracking-wide"}>{content}</p>
    </div>
  );
};

export const ChatBubbleWrapper = ({
  children,
  message,
}: {
  children: ReactNode;
  message: ChatMessage;
}) => {
  const isUser = message.type === "user";
  return (
    <div
      key={message.id}
      className={cn("flex ", isUser ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "rounded-2xl max-w-[100%] relative text-gray-800 rounded-bl-none",
        )}
      >
        {children}
      </div>
    </div>
  );
};

type BubbleStyleProps = {
  loading: {
    wrapper: string;
    textStyle: string;
  };
  textStyle?: string;
  base: string;
  lastMessageWidth: string;
  user: { background: string; text: string };
  bot: { background: string; text: string };
};

type BubbleProps = {
  message: ChatMessage;
  isLast?: boolean;
  styles: BubbleStyleProps;
};

export const Bubble = (props: BubbleProps) => {
  const { message, isLast, styles } = props;

  const isUser = message.type === "user";
  const isLastMessage = !isUser && isLast;
  const { products } = useProducts();
  const isLoading = message.content === "loading";

  const cardStyle = useMemo(() => {
    const { base, user, bot, lastMessageWidth } = styles;
    const baseStyle = clsx(
      base,
      isUser ? user.background : bot.background,
      isUser ? user.text : bot.text,
    );

    if (isLastMessage && products.length > 0) {
      return clsx(baseStyle, lastMessageWidth);
    }

    return baseStyle;
  }, [isLastMessage, products, isUser, styles]);

  return (
    <div className={cardStyle}>
      {isLoading ? (
        <BotThinking styles={styles.loading} />
      ) : (
        <MessageContent
          content={message.content}
          textStyle={styles.textStyle}
        />
      )}
    </div>
  );
};
