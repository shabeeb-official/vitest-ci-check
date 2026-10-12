import React from "react";
import { customEvent } from "@/utils/events";

interface ChipsSelectorProps {
  className?: string;
  children?: React.ReactNode;
  value?: string;
}

export const ChipAction = ({
  className,
  children,
  value,
}: ChipsSelectorProps) => {
  const onClick = () => {
    customEvent.publish("send-query", { data: value });
    setTimeout(() => {
      const chatList = document.querySelector(".chat-list");
      if (chatList) {
        chatList.scrollTo({
          top: chatList.scrollHeight,
          behavior: "smooth",
        });
      }
    }, 100);
  };
  return (
    <div onClick={onClick} className={className}>
      {children}
    </div>
  );
};
