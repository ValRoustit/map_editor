import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { hexGrid, Pen } from "../utils/draw_utils";
import useThrottleRAF from "../hooks/useThrottleRAF";
import usePanZoom from "../hooks/usePanZoom";
import useMoveCanvas from "../hooks/useMoveCanvas";
import { useMapContext } from "../context/MapContext";

const pen0: Pen = {
  active: false,
  x: 0,
  y: 0,
  value: "green",
  radius: 1,
};

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pen = useRef(pen0);

  const { state, updateMap } = useMapContext();

  const drawGrid = useCallback(() => {
    const context = canvasRef.current?.getContext("2d")!;
    hexGrid(context, pen.current.x, pen.current.y);
  }, [pen, state]);

  const { handleWheelZoom } = usePanZoom(canvasRef, drawGrid);
  const { handleGrab, handleMove, handleRelease } = useMoveCanvas(
    canvasRef,
    drawGrid
  );
  useEffect(() => {
    console.log("MountedCanva");
  }, []);

  const throttledGridRender = useThrottleRAF(drawGrid, 120);

  useEffect(() => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      canvasRef.current.width = rect.width;
      canvasRef.current.height = rect.height;
    }
    const id = requestAnimationFrame(drawGrid);

    return () => cancelAnimationFrame(id);
  }, []);

  useLayoutEffect(() => {
    function handleResize() {
      if (!canvasRef.current) return;
      let context = canvasRef.current.getContext("2d");
      const transform = context?.getTransform();
      const rect = canvasRef.current.getBoundingClientRect();
      canvasRef.current.width = rect.width;
      canvasRef.current.height = rect.height;
      context = canvasRef.current.getContext("2d");
      context?.setTransform(transform);

      throttledGridRender();
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      handleGrab(e);
      console.log(e.button);
      if (e.button === 0) pen.current.active = true;
    },
    [handleGrab]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      handleMove(e);
      if (pen.current.active) {
        pen.current.x = e.clientX;
        pen.current.y = e.clientY;
        throttledGridRender();
      }
    },
    [handleMove]
  );

  return (
    <canvas
      ref={canvasRef}
      width="800"
      height="500"
      onMouseDown={handleMouseDown}
      onMouseUp={handleRelease}
      onMouseMove={handleMouseMove}
      onMouseOut={handleRelease}
      onWheel={handleWheelZoom}
    />
  );
}
