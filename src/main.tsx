import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { MapContextProvider } from "./context/MapContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <MapContextProvider>
      <App />
    </MapContextProvider>
  </React.StrictMode>
);
