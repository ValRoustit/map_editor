import { faSquareFull } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CSSProperties, MouseEventHandler, useCallback, useRef } from "react";

export enum CellType {
  Ground = "brown",
  Wall = "black",
  Water = "blue",
  Empty = "transparent",
}

export type CellTypeKeys = keyof typeof CellType;

const CellButtonsStyles = Object.keys(CellType).reduce<
  Record<CellType, CSSProperties>
>((acc, key) => {
  acc[key as CellType] = { color: CellType[key as CellTypeKeys] };
  return acc;
}, {} as Record<CellType, CSSProperties>);

export interface SelectCellTypeProps {
  cellType: CellTypeKeys;
  selectCellType: MouseEventHandler<HTMLButtonElement>;
}

export default function SelectCellType({
  cellType,
  selectCellType,
}: SelectCellTypeProps) {
  const popoverRef = useRef<HTMLDialogElement>(null);
  const timeoutRef = useRef<number>(undefined);

  const handleOpenPopover = useCallback(() => {
    popoverRef.current?.show();
  }, []);

  const handleClose = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      popoverRef.current?.close();
      timeoutRef.current = undefined;
    }, 500);
  }, []);

  const handleStopTimeOut = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  return (
    <div className={"relative"}>
      <button
        title="cell type"
        className="relative inline-flex min-w-full cursor-pointer items-center justify-center rounded-sm px-1 py-1 text-3xl transition-all hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={handleOpenPopover}
        style={CellButtonsStyles[cellType]}
      >
        <FontAwesomeIcon icon={faSquareFull} />
      </button>
      <dialog
        className="left-14 top-0 rounded-md border bg-white px-2 py-2 text-sm text-gray-600 shadow-md dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400"
        ref={popoverRef}
        onMouseLeave={handleClose}
        onMouseEnter={handleStopTimeOut}
      >
        <div className="grid w-60 grid-cols-3">
          {Object.keys(CellType).map((key) => {
            if (key !== "Empty")
              return (
                <button
                  key={key}
                  className="relative cursor-pointer items-center justify-center rounded-sm text-4xl transition-all hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={CellButtonsStyles[key]}
                  onClick={selectCellType}
                  value={key}
                  autoFocus
                >
                  <FontAwesomeIcon icon={faSquareFull} />
                  <p className="text-xs text-gray-600">{key.toUpperCase()}</p>
                </button>
              );
          })}
        </div>
      </dialog>
    </div>
  );
}
