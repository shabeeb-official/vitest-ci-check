import { customEvent } from "@/utils/events";
import clsx from "clsx";
import { ReactNode, useEffect, useMemo, useState } from "react";

type PageWrapperProps = {
  slots: {
    chat: ReactNode;
    content: ReactNode;
  };
};
export const PageWrapper = (props: PageWrapperProps) => {
  const [isOpen, setIsOpen] = useState(true);
  useEffect(() => {
    const unsubscribe = customEvent.subscribe("toggle-window", (e) => {
      if (e.detail.status === "toggle") {
        setIsOpen(!isOpen);
      }
    });
    return () => unsubscribe();
  }, []);

  const chatSectionStyle = useMemo(() => {
    return clsx(
      "flex h-full min-h-0 flex-col overflow-hidden transition-all duration-300 ease-in-out",
      isOpen ? "flex-[2]" : "hidden",
    );
  }, [isOpen]);

  const contentSectionStyle = useMemo(() => {
    return clsx(
      "flex h-full min-h-0 w-full flex-col overflow-hidden",
      isOpen ? "flex-[10]" : "",
    );
  }, [isOpen]);

  return (
    <main className="flex h-full max-h-full min-h-0 overflow-hidden transition-all duration-300 ease-in-out gap-5">
      <aside className={chatSectionStyle}>{props.slots.chat}</aside>
      <section className={contentSectionStyle}>{props.slots.content}</section>
    </main>
  );
};
