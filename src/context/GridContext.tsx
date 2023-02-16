import { createContext, ReactElement, useContext } from "react";
import { initState, useGrid, UseGridType } from "./useGrid";

const initContextState: UseGridType = {
  state: initState,
  updateWidth: (w: number) => {},
  updateHeight: (h: number) => {},
};

export const GridContext = createContext<UseGridType>(initContextState);

type ChildrenType = {
  children?: ReactElement | ReactElement[] | undefined;
};

export const GridProvider = ({ children }: ChildrenType): ReactElement => {
  return (
    <GridContext.Provider value={useGrid(initState)}>
      {children}
    </GridContext.Provider>
  );
};

export const useGridContext = (): UseGridType => {
  const { state, updateWidth, updateHeight } = useContext(GridContext);
  return { state, updateWidth, updateHeight };
};
