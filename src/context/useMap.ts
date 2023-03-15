import { useCallback, useReducer } from "react";
import { HexCube } from "../utils/hex_utils";

export type MapType = Map<string, string>;

export type StateType = {
  map: MapType;
};

export const initState: StateType = {
  map: new Map() as MapType,
};

export const enum REDUCER_ACTION_TYPE {
  UPDATE_MAP,
}

export type ReducerAction = {
  type: REDUCER_ACTION_TYPE;
  payload?: MapType;
};

function handleUpdateMap(state: StateType, action: ReducerAction) {
  const newMap = new Map([...state.map, ...(action.payload as MapType)]);

  newMap.forEach((value, key) => {
    if (value !== "transparent") return;
    newMap.delete(key);
  });
  return newMap;
}

function reducer(state: StateType, action: ReducerAction): StateType {
  switch (action.type) {
    case REDUCER_ACTION_TYPE.UPDATE_MAP:
      return {
        ...state,
        map: handleUpdateMap(state, action),
      };
    default:
      throw new Error();
  }
}

export function useMap(initState: StateType) {
  const [state, dispatch] = useReducer(reducer, initState);

  const updateMap = useCallback(
    (map: MapType) =>
      dispatch({ type: REDUCER_ACTION_TYPE.UPDATE_MAP, payload: map }),
    []
  );

  return { state, updateMap };
}

export type UseMapType = ReturnType<typeof useMap>;
