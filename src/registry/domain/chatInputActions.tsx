import clsx from "clsx";
import { startTransition, useCallback, useEffect, useRef, useState } from "react";
import { customEvent } from "@/utils/events";
import SendIcon from "@/components/chat/send-icon";
import { PATHS } from "@/paths";
import { useNavigate } from "react-router-dom";
import useSendQuery from "@/hooks/use-send-query";

type Props = {
  searchTerm: string;
  chatWindow: boolean;
  isSubmitting: boolean;
  type?: "chat" | "search";
};

const ChatInputActions = (props: Props) => {
  const navigate = useNavigate();
  const { chatWindow, isSubmitting, type = "chat" } = props;
  const [searchTerm, setSearchTerm] = useState<string>("");
  const ref = useRef(null);
  const query = useSendQuery();
  const onSuccess = () => {
    ref.current.scroll({
      top: 0,
      behavior: "smooth",
    });
  };
  useEffect(() => {
    const unsubscribe = customEvent.subscribe("search-query-update", (e) => {
      setSearchTerm(e.detail.data);
    });
    return () => unsubscribe();
  }, []);

  const handleClick = useCallback(() => {
    if (searchTerm.length > 0) {
      setSearchTerm("");
      if (type === "chat") {
        customEvent.publish("send-query", { data: searchTerm });
      } else if (type === "search") {
        startTransition(() => {
          navigate(`${PATHS.products.root}?query=${searchTerm}`);
        });
      }
    }
  }, [searchTerm]);

  return (
    <div
      className={clsx(
        searchTerm.length > 0 ? "cursor-pointer" : "cursor-not-allowed",
      )}
      onClick={handleClick}
    >
      <SendIcon disabled={isSubmitting} chatWindow={chatWindow} />
    </div>
  );
};

export default ChatInputActions;
