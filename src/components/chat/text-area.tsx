import { useMemo, useRef } from "react";
import { useIsMobileWidth } from "@/hooks/use-mobile-width";
import { botReengaged } from "@/utils/gtm_events";

const MIN_ROW_COUNT = 1;
const MAX_ROW_COUNT = 3;

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSearch: (term: string) => void;
  chatWindow?: boolean;
  placeholder?: string;
  placeholderStyle?: string;
};

const ChatInputTextArea = (props: Props) => {
  const isMobileWidth = useIsMobileWidth();
  const { chatWindow, onSearch, value, onChange, placeholder, placeholderStyle } = props;
  const rowCount = useMemo(() => {
    if (isMobileWidth) {
      return MIN_ROW_COUNT;
    }
    if (chatWindow) {
      return MIN_ROW_COUNT;
    }

    return MAX_ROW_COUNT;
  }, [chatWindow, isMobileWidth]);

  const initialFocus = useRef(true);

  return (
    <textarea
      onFocus={() => {
        if (initialFocus.current) {
          initialFocus.current = false;
          return;
        }
        botReengaged();
      }}
      value={value}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          onSearch(value);
          onChange("");
        }
      }}
      onChange={(e) => {
        const { value } = e.target;
        const isEnter = value === "\n";
        if (isEnter) {
          onChange("");
        } else {
          onChange(value);
        }
      }}
      placeholder={placeholder || "Ask grace & stella..."}
      className={placeholderStyle || "w-full rounded-lg p-2 pb-[0.8rem] resize-none outline-none text-[16px]"}
      autoComplete="off"
      rows={rowCount}
    />
  );
};

export default ChatInputTextArea;
