import { renderNodeList } from "@/utils/render-ui";
import { composeRegistry, domainRegistry, genericRegistry } from "@/registry";
import { useChat } from "@/store/chat";
import { useProducts } from "@/store/products";
import { useIsMobileWidth } from "@/hooks/use-mobile-width";
import useShowPanel from "@/hooks/use-show-panel";
import { Render } from "@/components/conditional";
import { getActiveClientConfig } from "@/utils/clients";
import clsx from "clsx";

function ChatSection() {
  const { chat } = useShowPanel();
  const isMobile = useIsMobileWidth();
  const layouts = getActiveClientConfig();

  const [messages] = useChat();
  const { products, status } = useProducts();

  const chatView = renderNodeList(layouts.layouts.chat.layout, {
    registry: composeRegistry(genericRegistry, domainRegistry),
    runtimeScope: {
      messages,
      isMobile,
      products,
      status,
    },
  });

  return (
    <Render
      when={chat}
      show={
        <div
          className={clsx(
            "flex h-full min-h-0 flex-col overflow-hidden",
            !isMobile && "min-w-0 flex-[2.5]",
          )}
        >
          {chatView}
        </div>
      }
    />
  );
}

export default ChatSection;
