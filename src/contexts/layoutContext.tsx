import {
  useContext,
  createContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import { useLayoutConfigs } from "@/layouts/LayoutConfigContext";
import { DEFAULT_REGION } from "@/config";

type Direction = "rtl" | "ltr";

type LayoutType = {
  sideBarExpanded: boolean;
  direction: Direction;
  leftWidth: number;
  rightWidth: number;
  region: string;
  layoutClass?: string;
};

const defaultData: LayoutType = {
  sideBarExpanded: true,
  direction: "ltr",
  leftWidth: 2.5,
  rightWidth: 9.5,
  region: "",
};

const LayoutDataContext = createContext<LayoutType>(defaultData);

const LayoutUpdateContext = createContext(null);

export const useLayout = () => useContext(LayoutDataContext);
export const useLayoutDispatch = () => useContext(LayoutUpdateContext);

export const useRegion = () => {
  const { region } = useLayout();
  return region || DEFAULT_REGION;
};

export type CustomLayoutType = "expand" | "collapse" | "load";

const layoutReducer = (
  state: LayoutType,
  action: { type: CustomLayoutType; payload?: LayoutType },
): LayoutType => {
  const { type, payload } = action;

  switch (type) {
    case "load": {
      return payload;
    }
    case "expand": {
      return { ...state, sideBarExpanded: true };
    }
    case "collapse": {
      return { ...state, sideBarExpanded: false };
    }
    default: {
      return { ...state, sideBarExpanded: true };
    }
  }
};

type LayoutProviderProps = {
  children: ReactNode;
  region: string;
};

const LayoutProvider = ({ children, region }: LayoutProviderProps) => {
  const layoutConfigs = useLayoutConfigs();
  const [state, dispatch] = useReducer(layoutReducer, defaultData, () => {
    return layoutConfigs.plp.pageLayout || defaultData;
  });

  useEffect(() => {
    dispatch({
      type: "load",
      payload: { region, ...layoutConfigs.plp.pageLayout },
    });
  }, [layoutConfigs.plp.pageLayout, region]);

  return (
    <LayoutDataContext.Provider value={state}>
      <LayoutUpdateContext.Provider value={dispatch}>
        {children}
      </LayoutUpdateContext.Provider>
    </LayoutDataContext.Provider>
  );
};

export default LayoutProvider;
