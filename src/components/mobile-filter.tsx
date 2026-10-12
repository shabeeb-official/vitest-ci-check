import { useState } from "react";
import { Render } from "./conditional";
import { Filter } from "lucide-react";
import { Button } from "./ui/button";
import FilterTypeButton from "./filter-type-button";

const MobileFilter = ({
  levelOneFilter,
  levelTwoFilter,
  toggleLevelOneFilter,
  toggleLevelTwoFilter,
  subFiltersList,
  clearFilter,
}: {
  levelOneFilter: string[];
  levelTwoFilter: string[];
  toggleLevelOneFilter: (v: string) => void;
  toggleLevelTwoFilter: (v: string) => void;
  subFiltersList: string[];
  clearFilter: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <>
      <div className="sm:hidden mb-5">
        <button
          className="rounded-full border-2 border-black p-2 flex justify-center items-center"
          onClick={handleOpen}
        >
          <Filter size={20} />
        </button>
      </div>
      <Render
        when={isOpen}
        show={
          <div
            className="absolute bg-[#171717de] top-0 left-0 right-0 bottom-0 z-[10000000]"
            onClick={handleClose}
          >
            <div className="h-[40%]" />
            <div
              className=" bg-white h-[60%] p-4 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between">
                <h5 className="font-bold">Filter</h5>
                <Button
                  className="rounded-full capitalize bg-[#D9D9D95C] text-[#989898] flex items-center"
                  onClick={clearFilter}
                >
                  clear
                </Button>
              </div>
              <div className="grid grid-rows-6">
                <div className="row-span-1">
                  <p className="capitalize mb-1 font-light">select filter</p>
                  <div className="flex gap-2 flex-wrap mt-2">
                    <FilterTypeButton
                      label="brand"
                      onClick={(filter: string) => {
                        toggleLevelOneFilter(filter);
                      }}
                      selected={levelOneFilter}
                    />
                    <FilterTypeButton
                      label="trends"
                      onClick={(filter: string) => {
                        toggleLevelOneFilter(filter);
                      }}
                      selected={levelOneFilter}
                    />
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap mt-2 row-span-4">
                  {subFiltersList.map((filter) => {
                    return (
                      <FilterTypeButton
                        label={filter}
                        onClick={(filter: string) => {
                          toggleLevelTwoFilter(filter);
                        }}
                        selected={levelTwoFilter}
                      />
                    );
                  })}
                </div>
                <div>
                  <Button
                    className="capitalize bg-[#466EEB] font-bold w-full mt-5 rounded-lg"
                    onClick={handleClose}
                  >
                    apply filter
                  </Button>
                </div>
              </div>
            </div>
          </div>
        }
      />

      {/* <Render */}
      {/*   when={isOpen} */}
      {/*   show={ */}
      {/*     <div */}
      {/*       className="absolute bg-[#171717de] top-0 left-0 right-0 bottom-0 z-[10000000]" */}
      {/*       onClick={handleClose} */}
      {/*     > */}
      {/*       <div className="h-full w-full flex items-end"> */}
      {/*         <div */}
      {/*           className="bg-white shadow-xl shadow-black h-[500px] w-full rounded-t-[20px] p-3" */}
      {/*           onClick={(e) => e.stopPropagation()} */}
      {/*         > */}
      {/*           <div className="flex justify-between"> */}
      {/*             <h5 className="font-bold">Filter</h5> */}
      {/*             <Button */}
      {/*               className="rounded-full capitalize bg-[#D9D9D95C] text-[#989898] flex items-center" */}
      {/*               onClick={clearFilter} */}
      {/*             > */}
      {/*               clear */}
      {/*             </Button> */}
      {/*           </div> */}
      {/**/}
      {/*           <div id="filter-content" className="h-full flex flex-col"> */}
      {/*             <div id="level-one--filter" className="flex gap-2 mb-5"> */}
      {/*               <FilterTypeButton */}
      {/*                 label="brand" */}
      {/*                 onClick={(filter: string) => { */}
      {/*                   toggleLevelOneFilter(filter); */}
      {/*                 }} */}
      {/*                 selected={levelOneFilter} */}
      {/*               /> */}
      {/*               <FilterTypeButton */}
      {/*                 label="trends" */}
      {/*                 onClick={(filter: string) => { */}
      {/*                   toggleLevelOneFilter(filter); */}
      {/*                 }} */}
      {/*                 selected={levelOneFilter} */}
      {/*               /> */}
      {/*             </div> */}
      {/*             <div */}
      {/*               id="level-two--filter" */}
      {/*               className="flex gap-2 flex-wrap min-h-12" */}
      {/*             > */}
      {/*               {subFiltersList.map((filter) => { */}
      {/*                 return ( */}
      {/*                   <FilterTypeButton */}
      {/*                     label={filter} */}
      {/*                     onClick={(filter: string) => { */}
      {/*                       toggleLevelTwoFilter(filter); */}
      {/*                     }} */}
      {/*                     selected={levelTwoFilter} */}
      {/*                   /> */}
      {/*                 ); */}
      {/*               })} */}
      {/*             </div> */}
      {/*             <Button */}
      {/*               className="capitalize bg-[#466EEB] font-bold w-full mt-5 rounded-lg" */}
      {/*               onClick={handleClose} */}
      {/*             > */}
      {/*               apply filter */}
      {/*             </Button> */}
      {/*           </div> */}
      {/*         </div> */}
      {/*       </div> */}
      {/*     </div> */}
      {/*   } */}
      {/* /> */}
    </>
  );
};

export default MobileFilter;
