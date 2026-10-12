import { View } from "@/pages/View";
import { ChevronsDown } from "lucide-react";

const TabSwitcher = ({
  handleChangeView,
  activeView,
  url,
  toggleButtonStyle,
}: {
  handleChangeView: (a: View) => void;
  activeView: View;
  url?: string;
  toggleButtonStyle?: string;
}) => {
  console.log("the url", toggleButtonStyle);
  return (
    <span
      onClick={() => {
        handleChangeView(activeView === "chat" ? "products" : "chat");
      }}
      className={
        toggleButtonStyle ||
        "fixed flex justify-center text-center rounded-b-lg bg-[#E6FC06]  top-[50%] right-[-18px] rotate-90 switch-toggle h-[24px] w-[59px] cursor-pointer tab-switcher z-[100000]"
      }
    >
      {url ? <img src={url} alt="" width={24} /> : <ChevronsDown />}
    </span>
  );
};

export default TabSwitcher;
