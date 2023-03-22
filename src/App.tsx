import { ChangeEvent, useCallback, useEffect, useState } from "react";
import "./App.css";
import Canvas from "./components/Canvas";
import Preview from "./components/Preview";
import SelectCellType, { CellType } from "./components/SelectCellType";
import { Tool, Toolbar } from "./components/Toolbar";
import { useMapContext } from "./context/MapContext";
import { download } from "./utils/utils";

function App() {
  const [tool, setTool] = useState(Tool.Brush);
  const [cellType, setCellType] = useState(CellType.Ground);
  const [brushRadius, setBrushRadius] = useState(0);

  const { state } = useMapContext();

  const handleSelectTool = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setTool(e.target.value as Tool);
    },
    [setTool]
  );

  const handleSelectCellType = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      setCellType(e.target.value as CellType);
    },
    []
  );

  const handleBrushChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setBrushRadius(parseInt(e.target.value));
  }, []);

  const handleDownload = useCallback(() => {
    console.log(state.map);
    download(JSON.stringify(state.map), "map.json", "text/plain");
  }, [state]);

  return (
    <div className="App">
      <Toolbar tool={tool} selectTool={handleSelectTool} />
      <div className="brushSize">
        <input
          type="range"
          id="brushSize"
          name="brushSize"
          min="0"
          max="10"
          value={brushRadius}
          onChange={handleBrushChange}
        />
        <label htmlFor="brushSize">width</label>
        <SelectCellType
          cellType={cellType}
          selectCellType={handleSelectCellType}
        />
        <button onClick={handleDownload}>download</button>
      </div>
      <Canvas brushRadius={brushRadius} groundType={cellType} tool={tool} />
      <Preview />
    </div>
  );
}

export default App;
