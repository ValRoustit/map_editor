import { ChangeEventHandler } from "react";

export enum CellType {
  Ground = "brown",
  Wall = "black",
  Water = "blue",
  Empty = "transparent",
}

export type CellTypeKeys = keyof typeof CellType;

export interface SelectCellTypeProps {
  cellType: CellTypeKeys;
  selectCellType: ChangeEventHandler<HTMLSelectElement>;
}

export default function SelectCellType({
  cellType,
  selectCellType,
}: SelectCellTypeProps) {
  return (
    <select onChange={selectCellType} value={cellType}>
      {Object.keys(CellType).map((key, index) => {
        if (key !== "Empty")
          return (
            <option key={index} value={key}>
              {key}
            </option>
          );
      })}
    </select>
  );
}
