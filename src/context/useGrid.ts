import { useCallback, useReducer } from "react";

export type StateType = {
  width: number;
  height: number;
  map: any[];
};

export const initState: StateType = {
  width: 10,
  height: 10,
  map: [],
};

export const enum REDUCER_ACTION_TYPE {
  UPDATE_WIDTH,
  UPDATE_HEIGHT,
}

export type ReducerAction = {
  type: REDUCER_ACTION_TYPE;
  payload?: number;
};

function reducer(state: StateType, action: ReducerAction): StateType {
  switch (action.type) {
    case REDUCER_ACTION_TYPE.UPDATE_WIDTH:
      return { ...state, width: action.payload ?? state.width };
    case REDUCER_ACTION_TYPE.UPDATE_HEIGHT:
      return { ...state, height: action.payload ?? state.height };
    default:
      throw new Error();
  }
}

export function useGrid(initState: StateType) {
  const [state, dispatch] = useReducer(reducer, initState);

  const updateWidth = useCallback(
    (w: number) =>
      dispatch({ type: REDUCER_ACTION_TYPE.UPDATE_WIDTH, payload: w }),
    []
  );

  const updateHeight = useCallback(
    (h: number) =>
      dispatch({ type: REDUCER_ACTION_TYPE.UPDATE_HEIGHT, payload: h }),
    []
  );

  return { state, updateWidth, updateHeight };
}

export type UseGridType = ReturnType<typeof useGrid>;
