import { ReactNode } from "react";
import { Loader } from "lucide-react";

type ImageItem = {
  url: string;
};

type PdpImageListProps = {
  imageList: ImageItem[];
  children?: ReactNode;
};

const PdpImageList = ({ imageList, children }: PdpImageListProps) => {
  // Show loader only when API hasn't returned image URLs yet
  const hasValidImages =
    imageList &&
    imageList.length > 0 &&
    imageList.some((img) => img.url && img.url.trim() !== "");

  if (!hasValidImages) {
    return (
      <div className="w-full min-h-[120px] flex justify-center items-center gap-2 md:absolute md:inset-0 md:min-h-0 md:z-[100000]">
        <Loader className="h-5 w-5 md:h-10 md:w-10 animate-spin text-gray-500" />
        <span className=" text-2xl text-black  font-medium capitalize">
          Assembling Images
        </span>
      </div>
    );
  }

  return <>{children}</>;
};

export default PdpImageList;
