import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { IconContext } from "react-icons";
import "./App.css";
import Canvas from "./components/Canvas";
import { Tool, Toolbar } from "./components/Toolbar";
import { MapContextProvider } from "./context/MapContext";

function App() {
  const [tool, setTool] = useState<Tool>(Tool.Brush);
  const [brushRadius, setBrushRadius] = useState(0);

  const handleSelectTool = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setTool(e.target.value as Tool);
    },
    [setTool]
  );

  const handleBrushChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setBrushRadius(parseInt(e.target.value));
  }, []);

  useEffect(() => {
    const cb = (e: MouseEvent) => e.preventDefault();
    window.addEventListener("contextmenu", cb); // remove rightClick menu
    return () => {
      window.removeEventListener("contextmenu", cb);
    };
  }, []);

  return (
    <IconContext.Provider value={{ className: "react-icons" }}>
      <MapContextProvider>
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
          </div>
          <Canvas
            brushRadius={brushRadius}
            groundType="rgb(255, 195, 0)"
            tool={tool}
          />
        </div>
      </MapContextProvider>
    </IconContext.Provider>
  );
}

export default App;
