import { createContext, ReactElement, ReactNode, useContext } from "react";
import { initState, useMap, UseMapType } from "./useMap";

export const MapContext = createContext<UseMapType>(null);

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
