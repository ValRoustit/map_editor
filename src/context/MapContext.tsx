import { createContext, ReactElement, ReactNode, useContext } from "react";
import { initState, useMap, UseMapType } from "./useMap";

const initContextState: UseMapType = {
  state: initState,
  updateMap: () => void {},
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
