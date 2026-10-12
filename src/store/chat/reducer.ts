import { ChatMessage } from "@/types/chat";

export type CHAT_ACTION = "ADD_CHAT" | "UPDATE_CHAT";

export type ChatAction = { type: CHAT_ACTION; payload: ChatMessage };

export const chatReducer = (
  state: ChatMessage[] = [],
  { type, payload }: ChatAction,
): ChatMessage[] => {
  switch (type) {
    case "ADD_CHAT": {
      return [...state, payload];
    }
    case "UPDATE_CHAT": {
      return state.map((message) =>
        message.id === payload.id
          ? {
              ...message,
              content: payload.content,
              chips: payload.chips,
              productCount: payload.productCount,
            }
          : message,
      );
    }
    default: {
      return state;
    }
  }
};
