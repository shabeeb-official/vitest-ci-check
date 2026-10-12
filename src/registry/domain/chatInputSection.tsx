import useHandleSearch from "@/hooks/use-handle-search";

import ChatInputTextArea from "./text-area";
import ChatInputActions from "./chatInputActions";

type Props = {
  onSearch: (term: string) => void;
  chatWindow?: boolean;
  isSubmitting?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  nested?: any;
};

const ChatInputSection = (props: Props) => {
  const { onSearch, chatWindow, isSubmitting, nested } = props;
  const [searchTerm, onTextChange] = useHandleSearch();

  const renderProps = {
    onSearch,
    onTextChange,
    chatWindow,
    searchTerm,
    isSubmitting,
    onClick: () => {
      onSearch(searchTerm);
      onTextChange("");
    },
  };

  return (
    <>
      <ChatInputTextArea placeholder="test" />
      <ChatInputActions
        searchTerm={searchTerm}
        chatWindow={chatWindow}
        isSubmitting={isSubmitting}
      />
    </>
  );
};

export default ChatInputSection;
