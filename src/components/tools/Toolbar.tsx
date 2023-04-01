import {
  faArrowsUpDown,
  faEraser,
  faHand,
  faPencil,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChangeEventHandler, MouseEventHandler } from "react";
import ToolButton from "./ToolButton";
import SelectCellType, { CellType, CellTypeKeys } from "./SelectCellType";

export enum Tool {
  Brush = "brush",
  Eraser = "eraser",
  Line = "line",
  Grab = "grab",
}

export interface ToolbarProps {
  cellType: CellTypeKeys;
  tool: Tool;
  selectCellType: MouseEventHandler<HTMLButtonElement>;
  selectTool: ChangeEventHandler<HTMLInputElement>;
}

export function Toolbar({
  cellType,
  tool,
  selectCellType,
  selectTool,
}: ToolbarProps) {
  return (
    <fieldset
      className="flex max-w-max flex-col border-r border-t border-gray-400"
      aria-label="tool menu"
    >
      <p className="text-transform: inline-flex justify-center py-1 text-xs font-semibold uppercase text-gray-500">
        tools
      </p>
      <ToolButton
        value={Tool.Brush}
        checked={tool === Tool.Brush}
        onChange={selectTool}
        title={Tool.Brush}
      >
        <FontAwesomeIcon icon={faPencil} />
      </ToolButton>
      <ToolButton
        value={Tool.Eraser}
        checked={tool === Tool.Eraser}
        onChange={selectTool}
        title={Tool.Eraser}
      >
        <FontAwesomeIcon icon={faEraser} />
      </ToolButton>
      <ToolButton
        value={Tool.Line}
        checked={tool === Tool.Line}
        onChange={selectTool}
        title={Tool.Line}
      >
        <FontAwesomeIcon icon={faArrowsUpDown} />
      </ToolButton>
      <ToolButton
        value={Tool.Grab}
        checked={tool === Tool.Grab}
        onChange={selectTool}
        title={Tool.Grab}
      >
        <FontAwesomeIcon icon={faHand} />
      </ToolButton>
      <SelectCellType cellType={cellType} selectCellType={selectCellType} />
    </fieldset>
  );
}
