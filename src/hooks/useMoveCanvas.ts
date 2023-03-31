import { useCallback, useEffect, useState } from "react";
import { Tool } from "../components/tools/Toolbar";
import { Point } from "../utils/hex_utils";

export default function useMoveCanvas(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  mousePos: React.RefObject<Point>,
  tool: Tool
) {
  const [canGrab, setCanGrab] = useState(false);

  const handleMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!mousePos.current) return;

      const context = canvasRef.current?.getContext(
        "2d"
      ) as CanvasRenderingContext2D;
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const transform = context.getTransform();

      const dx = mousePos.current.x - e.clientX + rect.left;
      const dy = mousePos.current.y - e.clientY + rect.top;

      transform.e -= dx;
      transform.f -= dy;

      context.setTransform(transform);
    },
    [canvasRef, mousePos]
  );

  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      if (canGrab) return;
      if (e.code === "Space" && canvasRef.current) {
        setCanGrab(true);
      }
    }

    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [canvasRef, canGrab]);

  useEffect(() => {
    function handleKeyup(e: KeyboardEvent) {
      if (e.code === "Space" && canvasRef.current && tool !== Tool.Grab) {
        setCanGrab(false);
      }
    }

    window.addEventListener("keyup", handleKeyup);
    return () => {
      window.removeEventListener("keyup", handleKeyup);
    };
  }, [canvasRef, tool]);

  useEffect(() => {
    tool === Tool.Grab ? setCanGrab(true) : setCanGrab(false);
  }, [tool]);

  return {
    canGrab,
    handleMove,
    setCanGrab,
  };
}
