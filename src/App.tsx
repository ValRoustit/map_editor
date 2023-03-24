import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { useEffectOnce, useLocalStorage } from "usehooks-ts";
import "./App.css";
import Canvas from "./components/Canvas";
import Preview from "./components/Preview";
import SelectCellType, { CellType } from "./components/SelectCellType";
import { Tool, Toolbar } from "./components/Toolbar";
import { useMapContext } from "./context/MapContext";
import { download, trimExtension, upload } from "./utils/utils";

function App() {
  const [tool, setTool] = useState(Tool.Brush);
  const [cellType, setCellType] = useState(CellType.Ground);
  const [brushRadius, setBrushRadius] = useState(0);
  const [fileName, setFileName] = useState("");
  const modalRef = useRef<HTMLDialogElement>(null);

  const { state, newMap, redo, undo } = useMapContext();

  const [storedMap, setStoredMap] = useLocalStorage("storedMap", {
    name: state.name,
    data: JSON.stringify(state.map),
  });

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

  const handleOpenModal = useCallback(() => {
    modalRef.current?.showModal();
  }, []);

  const handleDownload = useCallback(() => {
    const mapData = JSON.stringify(state.map);
    setStoredMap({ name: fileName, data: mapData });
    download(mapData, fileName);
  }, [fileName, setStoredMap, state.map]);

  const handleUpload = useCallback(async () => {
    const mapData = await upload();
    const name = trimExtension(mapData.name);
    const map = await mapData.text();

    setFileName(name);
    newMap(JSON.parse(map), name);
  }, [newMap]);

  useEffect(() => {
    setStoredMap({ name: state.name, data: JSON.stringify(state.map) });
  }, [setStoredMap, state.map, state.name]);

  useEffectOnce(() => {
    newMap(JSON.parse(storedMap.data), storedMap.name);
    setFileName(storedMap.name);
  });

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
        <button onClick={handleOpenModal}>Save map</button>
        <button onClick={handleUpload}>Open map</button>
        <button onClick={() => newMap()}>new map</button>
        <button onClick={undo} disabled={!state.undos.length}>
          Undo
        </button>
        <button onClick={redo} disabled={!state.redos.length}>
          Redo
        </button>
        <dialog ref={modalRef}>
          <form method="dialog">
            <p>
              <label>
                Map name:
                <input
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                />
              </label>
            </p>
            <div>
              <button value="cancel">Cancel</button>
              <button value="default" onClick={handleDownload}>
                Save
              </button>
            </div>
          </form>
        </dialog>
      </div>
      <Canvas brushRadius={brushRadius} groundType={cellType} tool={tool} />
      <Preview />
    </div>
  );
}

export default App;
