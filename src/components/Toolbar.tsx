import { IoBrushOutline, IoResize } from "react-icons/io5";
import { BsEraser } from "react-icons/bs";
import { ChangeEventHandler } from "react";

export enum Tool {
  Brush = "brush",
  Eraser = "eraser",
  Line = "line",
}

export interface ToolbarProps {
  tool: Tool;
  selectTool: ChangeEventHandler<HTMLInputElement>;
}

export function Toolbar({ tool, selectTool }: ToolbarProps) {
  return (
    <fieldset className="toolbar" aria-label="tool menu">
      <input
        type="radio"
        name="tool"
        id={Tool.Brush}
        value={Tool.Brush}
        checked={tool === Tool.Brush}
        onChange={selectTool}
      />
      <label className="icon-button" htmlFor={Tool.Brush} title={Tool.Brush}>
        <IoBrushOutline />
      </label>
      <input
        type="radio"
        name="tool"
        id={Tool.Eraser}
        value={Tool.Eraser}
        checked={tool === Tool.Eraser}
        onChange={selectTool}
      />
      <label className="icon-button" htmlFor={Tool.Eraser} title={Tool.Eraser}>
        <BsEraser />
      </label>
      <input
        type="radio"
        name="tool"
        id={Tool.Line}
        value={Tool.Line}
        checked={tool === Tool.Line}
        onChange={selectTool}
      />
      <label className="icon-button" htmlFor={Tool.Line} title={Tool.Line}>
        <IoResize />
      </label>
    </fieldset>
  );
}
