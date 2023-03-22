import { useCallback, useReducer } from "react";
import { Cell, hex_to_string } from "../utils/hex_utils";

export type StateType = {
  map: Cell[];
};

export const initState: StateType = {
  map: [],
};

export const enum REDUCER_ACTION_TYPE {
  UPDATE_MAP,
  NEW_MAP,
}

export interface UpdateMapAction {
  type: REDUCER_ACTION_TYPE;
  payload: Cell[];
}

export interface ResetMapAction {
  type: REDUCER_ACTION_TYPE;
}

export type MapReducerActions = UpdateMapAction | ResetMapAction;

export function uniqCellArr(array: Cell[]) {
  const map = new Map<string, Cell>();

  array.forEach((el) => {
    map.set(hex_to_string(el), el);
  });

  return Array.from(map.values());
}

function handleUpdateMap(state: StateType, action: UpdateMapAction) {
  const a = uniqCellArr([...state.map, ...action.payload]);
  return a.filter((el) => el.value !== "transparent");
}

function reducer(state: StateType, action: MapReducerActions): StateType {
  switch (action.type) {
    case REDUCER_ACTION_TYPE.UPDATE_MAP:
      return {
        ...state,
        map: handleUpdateMap(state, action as UpdateMapAction),
      };
    case REDUCER_ACTION_TYPE.NEW_MAP:
      return {
        ...state,
        map: [],
      };
    default:
      throw new Error();
  }
}

export function useMap(initState: StateType) {
  const [state, dispatch] = useReducer(reducer, initState);

  const newMap = useCallback(() => {
    dispatch({ type: REDUCER_ACTION_TYPE.NEW_MAP });
  }, []);

  const updateMap = useCallback(
    (map: Cell[]) =>
      dispatch({ type: REDUCER_ACTION_TYPE.UPDATE_MAP, payload: map }),
    []
  );

  return { state, newMap, updateMap };
}

export type UseMapType = ReturnType<typeof useMap>;
