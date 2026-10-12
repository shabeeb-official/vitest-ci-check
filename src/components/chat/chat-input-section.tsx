import useHandleSearch from "@/hooks/use-handle-search";
import RenderComponents from "@/utils/render-components";
import RenderLoop from "../render-loop";
import { chatRegistry } from ".";

type Props = {
  onSearch: (term: string) => void;
  chatWindow?: boolean;
  isSubmitting?: boolean;
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

  if (nested) {
    return (
      <RenderLoop
        list={nested}
        render={(item: any) => (
          <RenderComponents
            item={item}
            registry={chatRegistry}
            runtimeScope={renderProps}
          />
        )}
      />
    );
  }
  return null;
};

export default ChatInputSection;
