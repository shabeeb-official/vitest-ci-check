import { useRef, useEffect, ReactNode } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "@/types/chat";
import { View } from "@/pages/View";
import RenderComponents from "@/utils/render-components";
import { ChatBubbleWrapper } from "../chat-bubble";
import RenderLoop from "../render-loop";
import { chatRegistry } from ".";

type ChatListProps = {
  messages: any[];
  handleSend: (v: string) => void;
  handleChangeView: (view: View) => void;
  children?: ReactNode;
  nested?: any;
};

const ChatList = (props: ChatListProps) => {
  const { messages, handleSend, handleChangeView, nested } = props;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "nearest",
    });
  }, [messages]);

  return (
    <ScrollArea className="flex-1 min-h-0">
      <div className="space-y-4 p-3">
        {messages?.map((message: ChatMessage, i: number) => {
          const runtimeScope = {
            handleChangeView,
            handleSend,
            isLast: i === messages.length - 1,
            message: message,
          };
          return (
            <ChatBubbleWrapper message={message}>
              <RenderLoop
                list={nested}
                render={(item) => (
                  <RenderComponents
                    item={item}
                    registry={chatRegistry}
                    runtimeScope={runtimeScope}
                  />
                )}
              />
            </ChatBubbleWrapper>
          );
        })}
      </div>
      <div ref={messagesEndRef} />
    </ScrollArea>
  );
};

export default ChatList;
