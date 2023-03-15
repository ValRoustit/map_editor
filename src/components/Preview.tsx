import { useEffect, useRef } from "react";
import { useMapContext } from "../context/MapContext";

export default function Preview() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { state } = useMapContext();

  useEffect(() => {
    console.log(state);
  }, [state]);

  return <canvas ref={canvasRef} width="300" height="200" />;
}
