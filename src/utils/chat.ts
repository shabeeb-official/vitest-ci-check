import { ChatMessage, MessageType } from "@/types/chat";
import { genUUID } from "@/utils/gen-id";
import { genISODate } from "@/utils/date";
import { getSession } from "./session";
import { CHAT_PREFIX } from "@/config";

const genChatMessage = (
  content: string,
  type: MessageType,
  chips?: string[],
) => {
  return {
    id: genUUID(),
    type: type,
    content: content,
    timestamp: genISODate(),
    chips: chips,
  };
};

export const genUserChatMessage = (content: string): ChatMessage =>
  genChatMessage(content, "user");

export const genAssistantChatMessage = (
  content: string,
  chips: string[] = [],
): ChatMessage => genChatMessage(content, "assistant", chips);

const genChatId = () => {
  const sessionID = getSession();
  if (!sessionID) {
    return null;
  }
  return `${CHAT_PREFIX}-${sessionID}`;
};

export const getChatFromSessionStorage = () => {
  const chatID = genChatId();
  const existingChats = sessionStorage.getItem(chatID);
  return existingChats;
};

export const saveChatToSessionStorage = (chat: ChatMessage) => {
  const chatID = genChatId();
  if (!chatID) {
    return;
  }

  const existingChats = getChatFromSessionStorage();
  if (existingChats) {
    const parsedChats = JSON.parse(existingChats);
    sessionStorage.setItem(chatID, JSON.stringify([...parsedChats, chat]));
    return;
  }
  sessionStorage.setItem(chatID, JSON.stringify([chat]));
};
