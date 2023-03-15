import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  drawBrush,
  drawMap,
  eraseMap,
  hexGrid,
  SIZE,
} from "../utils/draw_utils";
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
  brushRadius: number;
  groundType: string;
  tool: Tool;
}

function Canvas({ brushRadius, groundType, tool }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePos = useRef<Point>({ x: 0, y: 0 });
  const [shouldDraw, setShouldDraw] = useState(false);

  const { state, updateMap } = useMapContext();

  const { handleGrab, handleMove, handleRelease } = useMoveCanvas(canvasRef);
  const { handleZoom, zoom } = usePanZoom(canvasRef);
  const { brush, handleStroke, startStroke, endStroke, stroke, setStroke } =
    useTools(canvasRef, zoom, brushRadius, tool, groundType);

  const renderGrid = useCallback(() => {
    const radius = SIZE * zoom.current;
    const context = canvasRef.current?.getContext(
      "2d"
    ) as CanvasRenderingContext2D;

    const transform = context.getTransform();

    const dx = mousePos?.current.x - transform.e;
    const dy = mousePos?.current.y - transform.f;

    hexGrid(context, radius);
    drawMap(context, state.map, flatTop, SIZE * zoom.current);
    if (shouldDraw && (tool === Tool.Brush || tool === Tool.Line))
      drawMap(context, stroke, flatTop, SIZE * zoom.current);
    if (shouldDraw && tool === Tool.Eraser)
      eraseMap(context, stroke, flatTop, SIZE * zoom.current);
    drawBrush(context, brush, flatTop, SIZE * zoom.current, Point(dx, dy));
  }, [brush, shouldDraw, state.map, stroke, tool, zoom]);

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

      throttledRenderGrid();
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [throttledRenderGrid]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (e.button === 2) handleGrab(e);
      else {
        setShouldDraw(true);
        startStroke(e);
        handleStroke(e);
        throttledRenderGrid();
      }
    },
    [handleGrab, handleStroke, startStroke, throttledRenderGrid]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      mousePos.current = Point(e.clientX, e.clientY);

      handleMove(e);
      if (shouldDraw) handleStroke(e);
      throttledRenderGrid();
    },
    [handleMove, handleStroke, shouldDraw, throttledRenderGrid]
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
    updateMap(stroke);
    setShouldDraw(false);
    endStroke();
    throttledRenderGrid();
  }, [endStroke, handleRelease, stroke, throttledRenderGrid, updateMap]);

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
