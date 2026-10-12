import { ReactNode, useEffect, useRef } from "react";

interface IHandleChatboxRefProps {
  messages: any[];
  children?: ReactNode;
}
const HandleChatboxRef = ({ messages, children }: IHandleChatboxRefProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    requestAnimationFrame(() => {
      const container = messagesEndRef.current
        ?.previousElementSibling as HTMLElement | null;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    });
  }, [messages]);

  return (
    <>
      {children}
      <div ref={messagesEndRef} />
    </>
  );
};

export default HandleChatboxRef;

