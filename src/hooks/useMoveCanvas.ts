import { useCallback, useEffect, useState } from "react";
import { Point } from "../utils/hex_utils";

export default function useMoveCanvas(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  mousePos: React.RefObject<Point>
) {
  const [shouldGrab, setShouldGrab] = useState(false);

  const handleMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!mousePos.current) return;

      const context = canvasRef.current?.getContext(
        "2d"
      ) as CanvasRenderingContext2D;

      const transform = context.getTransform();

      const dx = mousePos.current.x - e.clientX;
      const dy = mousePos.current.y - e.clientY;

      transform.e -= dx;
      transform.f -= dy;

      context.setTransform(transform);
    },
    [canvasRef, mousePos]
  );

  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      if (e.code === "Space") {
        setShouldGrab(true);
      }
    }

    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, []);

  useEffect(() => {
    function handleKeyup(e: KeyboardEvent) {
      if (e.code === "Space") setShouldGrab(false);
    }

    window.addEventListener("keyup", handleKeyup);
    return () => {
      window.removeEventListener("keyup", handleKeyup);
    };
  }, []);

  return {
    shouldGrab,
    handleMove,
  };
}
