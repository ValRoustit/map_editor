import { createContext, ReactElement, ReactNode, useContext } from "react";
import { initState, useMap, UseMapType } from "./useMap";

const initContextState: UseMapType = {
  // TODO might be a mess
  newMap: () => void {},
  state: initState,
  updateMap: () => void {},
  undo: () => void {},
  redo: () => void {},
  rename: () => void {},
};

export const MapContext = createContext<UseMapType>(initContextState);

type ChildrenType = {
  children: ReactNode;
};

export const MapContextProvider = ({
  children,
}: ChildrenType): ReactElement => {
  return (
    <MapContext.Provider value={useMap(initState)}>
      {children}
    </MapContext.Provider>
  );
};

export const useMapContext = (): UseMapType => {
  return useContext(MapContext);
};
