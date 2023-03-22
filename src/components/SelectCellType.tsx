import { ChangeEventHandler } from "react";

export enum CellType {
  Ground = "brown",
  Wall = "black",
  Water = "blue",
}

export interface SelectCellTypeProps {
  cellType: CellType;
  selectCellType: ChangeEventHandler<HTMLSelectElement>;
}

export default function SelectCellType({
  cellType,
  selectCellType,
}: SelectCellTypeProps) {
  return (
    <select onChange={selectCellType} value={cellType}>
      <option value={CellType.Ground}>Ground</option>
      <option value={CellType.Wall}>Wall</option>
      <option value={CellType.Water}>Water</option>
    </select>
  );
}
