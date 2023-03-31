import { ChangeEvent, useCallback, useState } from "react";
import "./App.css";
import Canvas from "./components/Canvas";
import OptionsBar from "./components/options/OptionsBar";
import Preview from "./components/Preview";
import SelectCellType, {
  CellTypeKeys,
} from "./components/tools/SelectCellType";
import { Tool, Toolbar } from "./components/tools/Toolbar";

function App() {
  const [tool, setTool] = useState(Tool.Brush);
  const [cellType, setCellType] = useState<CellTypeKeys>("Ground");
  const [brushRadius, setBrushRadius] = useState(0);

  const handleSelectTool = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setTool(e.target.value as Tool);
    },
    [setTool]
  );

  const handleSelectCellType = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      setCellType(e.target.value as CellTypeKeys);
    },
    []
  );

  const handleBrushChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setBrushRadius(parseInt(e.target.value));
  }, []);

  return (
    <div className="App">
      <OptionsBar />
      <div className="grid auto-cols-max grid-flow-col">
        <Toolbar
          cellType={cellType}
          selectCellType={handleSelectCellType}
          tool={tool}
          selectTool={handleSelectTool}
        />
        <div className="flex flex-col">
          <div className="text-transform: inline-flex items-center gap-2 border-b border-gray-400 border-transparent px-3 py-1 text-xs font-semibold uppercase text-gray-500">
            <label htmlFor="brushSize">
              Tool diameter ({brushRadius * 2 + 1})
            </label>
            <input
              className="range h-1.5 cursor-pointer appearance-none rounded-lg bg-gray-300  dark:bg-gray-700"
              type="range"
              id="brushSize"
              name="brushSize"
              min="0"
              max="10"
              value={brushRadius}
              onChange={handleBrushChange}
            />
          </div>
          <Canvas brushRadius={brushRadius} groundType={cellType} tool={tool} />
        </div>
      </div>
      <Preview />
    </div>
  );
}

export default App;
