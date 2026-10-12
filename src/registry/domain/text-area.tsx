import { useEffect, useMemo, useRef, useState } from "react";
import { useIsMobileWidth } from "@/hooks/use-mobile-width";
import { botReengaged } from "@/utils/gtm_events";
import { customEvent } from "@/utils/events";

const MIN_ROW_COUNT = 1;
const MAX_ROW_COUNT = 3;

type Props = {
  chatWindow?: boolean;
  placeholder?: string;
};

const ChatInputTextArea = (props: Props) => {
  const isMobileWidth = useIsMobileWidth();
  const { chatWindow, placeholder } = props;
  const initialFocus = useRef(true);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const rowCount = useMemo(() => {
    if (isMobileWidth) {
      return MIN_ROW_COUNT;
    }
    if (chatWindow) {
      return MIN_ROW_COUNT;
    }

    return MAX_ROW_COUNT;
  }, [chatWindow, isMobileWidth]);

  useEffect(() => {
    customEvent.publish("search-query-update", { data: searchTerm });
  }, [searchTerm]);

  useEffect(() => {
    const onSearchQueryUpdate = () => setSearchTerm("");
    const unsubscribe = customEvent.subscribe(
      "send-query",
      onSearchQueryUpdate,
    );
    return () => unsubscribe();
  }, []);

  return (
    <textarea
      onFocus={() => {
        if (initialFocus.current) {
          initialFocus.current = false;
          return;
        }
        botReengaged();
      }}
      value={searchTerm}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          if (searchTerm.length > 1) {
            customEvent.publish("send-query", { data: searchTerm });
          }
        }
      }}
      onChange={(e) => {
        const { value } = e.target;
        const isEnter = value === "\n";
        if (isEnter) {
          setSearchTerm("");
        } else {
          setSearchTerm(value);
        }
      }}
      placeholder={placeholder || "Ask Sunny..."}
      className="w-full rounded-lg p-2 pb-[0.8rem] resize-none outline-none"
      autoComplete="off"
      rows={rowCount}
    />
  );
};

export default ChatInputTextArea;
