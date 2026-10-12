import { useLayout } from "@/contexts/layoutContext";
import sunnylogo from "@/components/assets/sunny-button.svg";
import { ChevronDown, ChevronUp } from "lucide-react";
import { PopoverContent } from "@radix-ui/react-popover";
import { Filters, Sort } from "@/types/product";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { customEvent } from "@/utils/events";
import { Button } from "@/components/ui/button";
import { HideSm } from "@/components/hider";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { Render } from "@/components/conditional";
import clsx from "clsx";

interface ClearFilterButtonProps {
  className?: string;
}
export const ClearFilterButton = (props: ClearFilterButtonProps) => {
  const { className } = props;
  const onSliderChange = () => {
    customEvent.publish("filter:selected", {
      type: "clear",
    });
  };
  return (
    <div className="w-full flex justify-end">
      <Button
        className={clsx("bg-gray-500 capitalize cursor-pointer", className)}
        onClick={onSliderChange}
      >
        clear filter
      </Button>
    </div>
  );
};

type SortFilterProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  styles?: any;
};

export const SortFilter = (props: SortFilterProps) => {
  const { children, styles } = props;

  return <div className={styles?.sortFilter}>{children}</div>;
};

export const ExpandSunny = () => {
  const { sideBarExpanded } = useLayout();

  const onClick = () => {};

  if (sideBarExpanded) {
    return null;
  }

  return (
    <HideSm>
      <img
        src={sunnylogo}
        alt="sunny-mascot"
        className="h-16 w-24 cursor-pointer"
        onClick={onClick}
      />
    </HideSm>
  );
};

type SortPopupFilter = {
  label: string;
  selectedFilter: any;
};

export const SortPopup = (props: SortPopupFilter) => {
  const { label, selectedFilter: selectedFilterProps } = props;
  const [open, setOpen] = useState<boolean>(false);
  const onSelect = (v: Sort) => {
    customEvent.publish("filter:selected", {
      type: "sort",
      name: v,
    });
    setOpen(false);
  };

  return (
    <>
      <Popover
        open={open}
        onOpenChange={() => {
          setOpen(!open);
        }}
      >
        <PopoverTrigger
          onClick={(e) => {
            customEvent.publish("toggle-filter", { name: "sort" });
          }}
        >
          <div className={"cursor-pointer flex gap-2"}>
            <p className={"capitalize font-bold"}>{label}</p>
            <ChevronDown />
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="z-[9999] relative"
          align="start"
          sideOffset={8}
        >
          <div className="p-4 bg-white shadow-sm w-max">
            <div className="flex flex-col gap-3">
              <p
                className={
                  selectedFilterProps?.sort?.[0] === "low-high"
                    ? "filter-item-selected"
                    : "filter-item"
                }
                onClick={() => {
                  onSelect("low-high");
                }}
              >
                price(low to high)
              </p>
              <p
                className={
                  selectedFilterProps?.sort?.[0] === "high-low"
                    ? "filter-item-selected"
                    : "filter-item"
                }
                onClick={() => {
                  onSelect("high-low");
                }}
              >
                price(high to low)
              </p>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};

type FilterItemRootProps = {
  name: Filters;
  selectedFilter: Filters;
  children: ReactNode;
  className: string;
};

export const FilterItemRoot = (props: FilterItemRootProps) => {
  const { name, selectedFilter, children, className } = props;

  return (
    <div
      className={className}
      onClick={() => {
        customEvent.publish("toggle-filter", { name });
      }}
    >
      {children}
      <Render
        when={selectedFilter === name}
        show={<ChevronUp />}
        otherwise={<ChevronDown />}
      />
    </div>
  );
};

type FilterItemProps = {
  children: ReactNode;
  type: string;
  className: string;
  name: string;
  filterValues: unknown;
  selectedFilter: string;
};

export const FilterItem = (props: FilterItemProps) => {
  const { children, type, className, name, filterValues, selectedFilter } =
    props;

  const onSelect = () => {
    customEvent.publish("filter:selected", {
      type,
      name,
    });
  };

  const isActive = useMemo(() => {
    if (filterValues) {
      const values = filterValues[type];
      if (values) {
        return values.findIndex((value: string) => value === name) > -1;
      }
    }
    return false;
  }, [filterValues, type]);

  if (type !== selectedFilter) {
    return null;
  }
  return (
    <div
      onClick={onSelect}
      className={clsx(className, isActive ? "group active " : "")}
      data-state={isActive ? "active" : "inactive"}
    >
      {children}
    </div>
  );
};
