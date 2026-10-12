import ChatInputTextArea from "@/components/chat/text-area";
import SendIcon from "@/components/chat/send-icon";
import clsx from "clsx";

interface SearchSectionProps {
  value?: string;
  onSearch?: (term: string) => void;
  onChange?: (value: string) => void;
  isMobileWidth?: boolean;
  placeholder?: string;
  styles?: any;
  searchButtonActionIcon;
}

const SearchSection = ({
  value = "",
  onSearch,
  onChange,
  isMobileWidth = false,
  placeholder,
  styles,
  searchButtonActionIcon,
}: SearchSectionProps) => {
  const handleSearch = () => {
    if (value && value.length > 0) {
      if (onSearch) {
        onSearch(value);
      }
      if (onChange) {
        onChange("");
      }
    }
  };

  return (
    <div
      className={clsx(
        styles?.textbox,
        isMobileWidth ? styles?.mobileWidth : styles?.desktopWidth,
      )}
    >
      <ChatInputTextArea
        onSearch={(term: string) => {
          if (onSearch) {
            onSearch(term);
          }
          if (onChange) {
            onChange("");
          }
        }}
        onChange={onChange}
        value={value}
        placeholder={placeholder}
        placeholderStyle={styles?.placeholderStyle}
      />

      <div
        className={clsx(
          value && value.length > 0
            ? styles?.cursorEnabled
            : styles?.cursorDisabled,
        )}
        onClick={handleSearch}
      >
        {searchButtonActionIcon ? (
          <img
            src={searchButtonActionIcon}
            alt="send-icon"
            width={styles?.sendIcon?.width}
            height={styles?.sendIcon?.height}
          />
        ) : (
          <SendIcon
            disabled={!value || value.length === 0}
            styles={styles?.sendIcon}
          />
        )}
      </div>
    </div>
  );
};

export default SearchSection;
