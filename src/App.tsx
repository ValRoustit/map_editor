import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { IconContext } from "react-icons";
import "./App.css";
import Canvas from "./components/Canvas";
import { Tool, Toolbar } from "./components/Toolbar";
import { MapContextProvider } from "./context/MapContext";

function App() {
  const [tool, setTool] = useState<Tool>(Tool.Brush);

  const handleSelectTool = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setTool(e.target.value as Tool);
    },
    [setTool]
  );

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
          <Canvas tool={tool} />
        </div>
      </MapContextProvider>
    </IconContext.Provider>
  );
}

export default App;
