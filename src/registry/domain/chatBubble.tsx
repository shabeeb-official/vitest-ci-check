import { Render } from "@/components/conditional";
import { BotThinking } from "..";
import clsx from "clsx";

type ChatBubbleStyle = { foreground: string; background: string };

type ChatBubbleProps = {
  message: string;
  message_type: string;
  style: {
    user: ChatBubbleStyle;
    agent: ChatBubbleStyle;
  };
};

export const ChatBubble = (props: ChatBubbleProps) => {
  const { message_type, message, style } = props;
  const isUser = message_type === "user";

  return (
    <div className={clsx("flex", isUser ? "justify-end" : "justify-start ")}>
      <div
        className={clsx(
          "rounded-2xl w-fit px-4 py-2 shadow-sm",
          isUser ? "bg-[#002b7e] text-white mt-4" : "bg-[#EDEDED] text-black ",
        )}
        style={{
          backgroundColor: isUser
            ? style.user.background
            : style.agent.background,

          color: isUser ? style.user.foreground : style.agent.foreground,
        }}
      >
        <div className="flex items-center gap-2">
          <Render
            when={message === "loading"}
            show={<BotThinking />}
            otherwise={<p className="text-sm tracking-wide">{message}</p>}
          />
        </div>
      </div>
    </div>
  );
};
