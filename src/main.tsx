import React from "react";
import ReactDOM from "react-dom/client";
import { IconContext } from "react-icons";
import App from "./App";
import { MapContextProvider } from "./context/MapContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <IconContext.Provider value={{ className: "react-icons" }}>
      <MapContextProvider>
        <App />
      </MapContextProvider>
    </IconContext.Provider>
  </React.StrictMode>
);
