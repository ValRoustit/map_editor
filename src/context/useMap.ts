import { useCallback, useReducer } from "react";

export type MapType = Map<{ x: number; y: number }, string>;

export type StateType = {
  map: MapType;
};

export const initState: StateType = {
  map: new Map(),
};

export const enum REDUCER_ACTION_TYPE {
  UPDATE_MAP,
}

export type ReducerAction = {
  type: REDUCER_ACTION_TYPE;
  payload?: MapType;
};

function reducer(state: StateType, action: ReducerAction): StateType {
  switch (action.type) {
    case REDUCER_ACTION_TYPE.UPDATE_MAP:
      return { ...state, map: action.payload! };
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
