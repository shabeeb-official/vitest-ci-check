import { ReactNode } from "react";

type Props = ReactNode;

const ChatWrapper = ({ children }: { children: Props }) => {
  return (
    <div className="flex min-h-0 flex-col h-full overflow-hidden p-0 md:pb-2">
      {children}
    </div>
  );
};

export default ChatWrapper;
