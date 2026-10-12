import { ArrowUp, AudioLines, Image } from "lucide-react";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import useQueryText from "@/hooks/use-query-text";
import { ReactElement, useState } from "react";

const CHARACTER_PER_LINE = 19;

const TypingSection = ({
  isSubmitting,
  onSend,
}: {
  isSubmitting: boolean;
  onSend: (queryText: string) => void;
}) => {
  const { queryText, handleQueryTextChange, resetQueryText } = useQueryText();
  const [rows, setRows] = useState<number>(1);

  return (
    <div className="flex justify-center">
      <div className="p-4 bg-black rounded-full w-full flex items-center justify-center space-x-2 overflow-hidden">
        <textarea
          autoComplete="off"
          placeholder="Ask grace & stella..."
          autoFocus
          rows={rows}
          value={queryText}
          onChange={(e) => {
            const { value } = e.target;
            const len = value.length;
            if (len === CHARACTER_PER_LINE && rows === 1) {
              setRows((prev) => prev + 1);
            } else if (len < CHARACTER_PER_LINE && rows > 1) {
              setRows(1);
            }
            handleQueryTextChange(value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSend(queryText);
              setRows(1);
              resetQueryText();
            }
          }}
          disabled={isSubmitting}
          className="text-white resize-none flex-1 z-10 focus:outline-none bg-transparent border-none w-full"
        />
        <Button className="border-2 z-10 rounded-[50%] h-[40px] w-[40px] bg-transparent hover:bg-transparent border-white">
          <Image />
        </Button>
        <Button className="border-2 z-10 rounded-[50%] h-[40px] w-[40px] bg-transparent hover:bg-transparent border-white">
          <AudioLines />
        </Button>
        <Button
          onClick={() => {
            onSend(queryText);
            resetQueryText();
          }}
          className="bg-[#E6FC06] z-10 hover:bg-[#CBDF02] rounded-[50%] h-[40px] w-[40px]"
          size="icon"
          disabled={!queryText.trim() || isSubmitting}
        >
          <IsLoading
            loading={isSubmitting}
            onIdle={<ArrowUp className="stroke-black" />}
            onLoading={<Loader className="animate-spin stroke-black" />}
          />
        </Button>
        {/* <Button */}
        {/*   onClick={() => { */}
        {/*     onSend(queryText); */}
        {/*     resetQueryText(); */}
        {/*   }} */}
        {/*   size="icon" */}
        {/*   disabled={!queryText.trim() || isSubmitting} */}
        {/* > */}
        {/*   {isSubmitting ? ( */}
        {/*     <Loader className="h-4 w-4 animate-spin" /> */}
        {/*   ) : ( */}
        {/*     <Send className="h-4 w-4" /> */}
        {/*   )} */}
        {/* </Button> */}
      </div>
    </div>
  );
};

const IsLoading = ({
  loading,
  onIdle,
  onLoading,
}: {
  loading: boolean;
  onIdle: ReactElement;
  onLoading: ReactElement;
}) => {
  if (loading) {
    return onLoading;
  }

  return onIdle;
};

export default TypingSection;
