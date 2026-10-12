import { useChat } from "../../store/chat";
import useAutomaticSend from "../.././hooks/use-automatic-send";
import RenderLoop from "../render-loop";
import RenderComponents from "@/utils/render-components";
import { chatRegistry } from ".";
import { useLayoutConfigs } from "@/layouts/LayoutConfigContext";
import { View } from "@/pages/View";

type Props = {
  handleSend?: (v: string) => void;
  handleSendTrend?: (v: string) => void;
  handleChangeView?: (view: View) => void;
};

const ChatLayout = ({
  handleSend,
  handleSendTrend,
  handleChangeView,
}: Props) => {
  const [messages] = useChat();
  const layoutConfigs = useLayoutConfigs();

  const runtimeScope = {
    messages,
    handleSend,
    handleSendTrend,
    handleChangeView,
  };

  useAutomaticSend(handleSend, handleSendTrend);

  return (
    <RenderLoop
      list={layoutConfigs.chat.layout}
      render={(item: any) => (
        <RenderComponents
          item={item}
          registry={chatRegistry}
          runtimeScope={runtimeScope}
        />
      )}
    />
  );
};

export default ChatLayout;
