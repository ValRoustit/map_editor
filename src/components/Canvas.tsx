import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { drawMap, hexGrid, SIZE } from "../utils/draw_utils";
import useThrottleRAF from "../hooks/useThrottleRAF";
import usePanZoom from "../hooks/usePanZoom";
import useMoveCanvas from "../hooks/useMoveCanvas";
import { flatTop, Point } from "../utils/hex_utils";
import { Tool } from "./Toolbar";
import { useMapContext } from "../context/MapContext";
import { useTools } from "../hooks/useTools";
import { MapType } from "../context/useMap";

const MAP: MapType = new Map();
MAP.set(JSON.stringify({ q: 10, r: 10, s: 3 }), "blue");

export interface CanvasProps {
  tool: Tool;
}

function Canvas({ tool }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { state } = useMapContext();

  const { handleGrab, handleMove, handleRelease } = useMoveCanvas(canvasRef);
  const { handleZoom, zoom } = usePanZoom(canvasRef);
  const { brush, handleBrush } = useTools(canvasRef, zoom);

  const renderGrid = useCallback(() => {
    const radius = SIZE * zoom.current;
    const context = canvasRef.current?.getContext(
      "2d"
    ) as CanvasRenderingContext2D;
    hexGrid(context, radius);
    drawMap(context, MAP, flatTop, SIZE * zoom.current);
    const brushMap = brush.current as MapType;
    drawMap(context, brushMap, flatTop, SIZE * zoom.current);
  }, [brush, zoom]);

  const throttledRenderGrid = useThrottleRAF(renderGrid, 120); //remplace with animate

  useEffect(() => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      canvasRef.current.width = rect.width;
      canvasRef.current.height = rect.height;
    }
    const id = requestAnimationFrame(renderGrid);

    return () => cancelAnimationFrame(id);
    // should render only on mount
  }, [renderGrid]);

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

      throttledRenderGrid();
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [throttledRenderGrid]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      handleGrab(e);
    },
    [handleGrab]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      handleMove(e);
      throttledRenderGrid();
      handleBrush(e);
    },
    [handleBrush, handleMove, throttledRenderGrid]
  );

  const handleWheel = useCallback(
    (e: React.WheelEvent<HTMLCanvasElement>) => {
      handleZoom(e);
      throttledRenderGrid();
    },
    [handleZoom, throttledRenderGrid]
  );

  const handleMouseLeave = useCallback(() => {
    handleRelease();
  }, [handleRelease]);

  return (
    <canvas
      ref={canvasRef}
      width="800"
      height="500"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseLeave}
      onMouseMove={handleMouseMove}
      onMouseOut={handleMouseLeave}
      onWheel={handleWheel}
    />
  );
}

export default Canvas;
