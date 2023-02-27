import "./App.css";
import Canvas from "./components/Canvas";
import { MapContextProvider } from "./context/MapContext";

function App() {
  return (
    <MapContextProvider>
      <div className="App">
        <Canvas />
      </div>
    </MapContextProvider>
  );
}

export default App;
