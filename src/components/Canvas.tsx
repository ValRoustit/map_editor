import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { hexGrid } from "./draw_utils";
import useThrottleRAF from "../hooks/useThrottleRAF";
import usePanZoom from "../hooks/usePanZoom";
import useMoveCanvas from "../hooks/useMoveCanvas";

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawGrid = () => {
    const context = canvasRef.current?.getContext("2d")!;
    hexGrid(context, 100);
  };

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
      canvasRef.current.width = document.body.clientWidth;
      canvasRef.current.height = document.body.clientHeight;
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
    },
    [handleGrab]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      handleMove(e);
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
