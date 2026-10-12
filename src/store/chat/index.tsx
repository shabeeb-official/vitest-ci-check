import { createContext, useReducer, useContext } from "react";
import {
  genAssistantChatMessage,
  getChatFromSessionStorage,
  saveChatToSessionStorage,
} from "@/utils/chat";
import { useLayoutConfigs } from "@/layouts/LayoutConfigContext";
import { chatReducer } from "./reducer";

const chatContext = createContext([]);

export { chatReducer } from "./reducer";
export type { CHAT_ACTION, ChatAction } from "./reducer";

export const useChat = () => useContext(chatContext);

const ChatProvider = ({ children }) => {
  const layoutConfigs = useLayoutConfigs();
  const initialMessage = [
    genAssistantChatMessage(
      layoutConfigs.chat.content.chatList.initialMessage,
      layoutConfigs.chat.content.chatList.inititalChips,
    ),
  ];
  const [state, dispatch] = useReducer(chatReducer, initialMessage, (_) => {
    const prevChats = getChatFromSessionStorage();
    if (prevChats) {
      return JSON.parse(prevChats);
    }

    saveChatToSessionStorage(initialMessage[0]);
    return initialMessage;
  });

  return (
    <chatContext.Provider value={[state, dispatch]}>
      {children}
    </chatContext.Provider>
  );
};

export default ChatProvider;
