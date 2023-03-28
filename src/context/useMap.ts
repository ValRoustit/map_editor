import { useCallback, useReducer } from "react";
import { CellType } from "../components/tools/SelectCellType";
import { Cell } from "../utils/hex_utils";
import { uniqCellArr } from "../utils/utils";

const UNDO_LIMIT = 10;

export type StateType = {
  map: Cell[];
  undos: Cell[][];
  redos: Cell[][];
  name: string;
};

export const initState: StateType = {
  map: [],
  undos: [],
  redos: [],
  name: "new_map",
};

export const enum REDUCER_ACTION_TYPE {
  UPDATE_MAP,
  NEW_MAP,
  UNDO,
  REDO,
  RENAME,
}

export interface MapAction {
  type: REDUCER_ACTION_TYPE;
  payload?: Cell[];
}

export interface NewMapAction {
  type: REDUCER_ACTION_TYPE;
  payload: {
    data: Cell[];
    name: string;
  };
}

export interface RenameMapAction {
  type: REDUCER_ACTION_TYPE;
  payload: string;
}

export type MapActions = MapAction | NewMapAction | RenameMapAction;

function handleUpdateMap(state: StateType, action: MapAction): StateType {
  const undos = [...state.undos, state.map].slice(-UNDO_LIMIT) as Cell[][];
  const a = uniqCellArr([...state.map, ...(action.payload as Cell[])]);
  const map = a.filter((el) => CellType[el.value] !== CellType.Empty);

  return { ...state, map: map, undos: undos, redos: [] };
}

function handleUndo(state: StateType): StateType {
  const undos = [...state.undos];
  const redos = [...state.redos];
  if (!undos.length) return state;

  const newCurrentMap = undos.pop() as Cell[];
  redos.push(state.map);
  const map = newCurrentMap;

  return { ...state, map: map, undos: undos, redos: redos };
}

function handleRedo(state: StateType): StateType {
  const undos = [...state.undos];
  const redos = [...state.redos];
  if (!redos.length) return state;
  const newCurrentMap = redos.pop() as Cell[];

  undos.push(state.map);
  const map = newCurrentMap;

  return { ...state, map: map, undos: undos, redos: redos };
}

function handleNewMap(state: StateType, action: NewMapAction) {
  return {
    ...state,
    undos: [],
    redos: [],
    map: action.payload.data as Cell[],
    name: action.payload.name,
  };
}

function handleRenameMap(state: StateType, action: RenameMapAction) {
  return {
    ...state,
    name: action.payload,
  };
}

function reducer(state: StateType, action: MapActions): StateType {
  switch (action.type) {
    case REDUCER_ACTION_TYPE.UPDATE_MAP:
      return handleUpdateMap(state, action as MapAction);
    case REDUCER_ACTION_TYPE.NEW_MAP:
      return handleNewMap(state, action as NewMapAction);
    case REDUCER_ACTION_TYPE.UNDO:
      return handleUndo(state);
    case REDUCER_ACTION_TYPE.REDO:
      return handleRedo(state);
    case REDUCER_ACTION_TYPE.RENAME:
      return handleRenameMap(state, action as RenameMapAction);
    default:
      throw new Error();
  }
}

export function useMap(initState: StateType) {
  const [state, dispatch] = useReducer(reducer, initState);

  const newMap = useCallback(
    (map: Cell[] = [], name = initState.name) => {
      dispatch({
        type: REDUCER_ACTION_TYPE.NEW_MAP,
        payload: { data: map, name: name },
      });
    },
    [initState.name]
  );

  const updateMap = useCallback(
    (map: Cell[]) =>
      dispatch({ type: REDUCER_ACTION_TYPE.UPDATE_MAP, payload: map }),
    []
  );

  const undo = useCallback(
    () => dispatch({ type: REDUCER_ACTION_TYPE.UNDO }),
    []
  );

  const redo = useCallback(
    () => dispatch({ type: REDUCER_ACTION_TYPE.REDO }),
    []
  );

  const rename = useCallback(
    (name: string) =>
      dispatch({ type: REDUCER_ACTION_TYPE.RENAME, payload: name }),
    []
  );

  return { state, newMap, updateMap, undo, redo, rename };
}

export type UseMapType = ReturnType<typeof useMap>;
