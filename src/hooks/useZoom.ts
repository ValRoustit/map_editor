import { useCallback, useRef } from "react";
import useAnimationFrame from "./useAnimationFrame";

function useZoom(
  // draw: () => void,
  canvas: React.RefObject<HTMLCanvasElement>,
  zoom: number = 1
) {
  const setZoom = useCallback((step: number) => {
    console.log(step);
    const context = canvas.current?.getContext("2d")!;
    const newZoom = Math.round(zoom * step * 100) / 100;
    context.setTransform(newZoom, 0, 0, newZoom, 0, 0);

    // render();
    return newZoom;
  }, []);

  return setZoom;
}

export default useZoom;
