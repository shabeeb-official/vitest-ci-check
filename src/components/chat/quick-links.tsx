import GearIcon from "./gear-icon";
import CollectionIcon from "./collection-icon";
import Button from "./button";
import { useIsMobileWidth } from "@/hooks/use-mobile-width";
import { Render } from "../conditional";

const QuickLinks = ({
  chatWindow,
  onSearch,
}: {
  chatWindow: boolean;
  onSearch: (term: string) => void;
}) => {
  const isMobileWidth = useIsMobileWidth();
  return (
    <div id="buttons-section" className="flex gap-2 items-center">
      <Button
        icon={<GearIcon />}
        label="offers"
        onClick={() => {
          onSearch("show me offers");
        }}
      />

      {/* <Render */}
      {/*   when={!chatWindow} */}
      {/*   show={ */}
      {/*     <Render */}
      {/*       when={!isMobileWidth} */}
      {/*       show={ */}
      {/*         <Button */}
      {/*           icon={<GearIcon />} */}
      {/*           label="offers" */}
      {/*           onClick={() => { */}
      {/*             onSearch("show me offers"); */}
      {/*           }} */}
      {/*         /> */}
      {/*       } */}
      {/*     /> */}
      {/*   } */}
      {/* /> */}
      <Render
        when={!chatWindow}
        show={
          <Render
            when={!isMobileWidth}
            show={
              <Button
                icon={<CollectionIcon />}
                label="new collection"
                onClick={() => {
                  onSearch("show me new collection");
                }}
              />
            }
          />
        }
      />
      <Render
        when={!chatWindow}
        show={
          <Render
            when={!isMobileWidth}
            show={
              <Button
                icon={<CollectionIcon />}
                label="summer wear"
                onClick={() => {
                  onSearch("show me summer wear");
                }}
              />
            }
          />
        }
      />
    </div>
  );
};

export default QuickLinks;
