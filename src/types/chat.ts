import { RequestStatus } from "./req-resonse";

export type MessageType = "user" | "assistant";

type Opts = {
  query?: string;
  trend?: string;
  onSuccess?: () => void;
  beforeSend?: () => void;
};

export type OnSendQuery = (opts: Opts) => Promise<void>;

export type QueryResponse = {
  onSendQuery: OnSendQuery;
  status: RequestStatus;
  countDownInMilliSeconds: number;
  resetCountdown: () => void;
};

export interface ChatMessage {
  id: string;
  type: MessageType;
  content: string;
  timestamp: string;
  productId?: string;
  chips?: string[];
  colors?: string[];
  productCount?: number;
}
