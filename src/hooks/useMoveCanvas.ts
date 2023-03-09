import { useCallback, useRef, useState } from "react";
import { Point } from "../utils/hex_utils";

const ORIGIN = { x: 0, y: 0 };

export default function useMoveCanvas(
  canvasRef: React.RefObject<HTMLCanvasElement>
) {
  const [grab, setGrab] = useState(false);

  const mousePos = useRef<Point>(ORIGIN);

  const handleGrab = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.button === 2) setGrab(true);
    mousePos.current.x = e.clientX;
    mousePos.current.y = e.clientY;
  }, []);

  const handleMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!grab) return;

      const context = canvasRef.current?.getContext(
        "2d"
      ) as CanvasRenderingContext2D;

      const transform = context.getTransform();

      const dx = mousePos.current.x - e.clientX;
      const dy = mousePos.current.y - e.clientY;

      transform.e -= dx;
      transform.f -= dy;

      context.setTransform(transform);

      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
    },
    [grab, canvasRef]
  );

  const handleRelease = useCallback(() => {
    setGrab(false);
  }, []);

  return {
    handleGrab,
    handleMove,
    handleRelease,
  };
}
