import { useCallback, useRef, useState } from "react";
import {
  drawBrush,
  drawMap,
  eraseMap,
  hexGrid,
  HEX_SIZE,
} from "../utils/draw_utils";
import useThrottleRAF from "../hooks/useThrottleRAF";
import usePanZoom from "../hooks/usePanZoom";
import useMoveCanvas from "../hooks/useMoveCanvas";
import { FLAT_TOP, Point } from "../utils/hex_utils";
import { Tool } from "./Toolbar";
import { useMapContext } from "../context/MapContext";
import { useTools } from "../hooks/useTools";
import useWindowResize from "../hooks/useWindowResize";
import useOnMount from "../hooks/useOnMount";

export interface CanvasProps {
  brushRadius: number;
  groundType: string;
  tool: Tool;
}

function Canvas({ brushRadius, groundType, tool }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePos = useRef<Point>({ x: 0, y: 0 });
  const [draw, setDraw] = useState(false);
  const [grab, setGrab] = useState(false);

  const { state, updateMap } = useMapContext();

  const { handleZoom, zoom } = usePanZoom(canvasRef);
  const { handleMove, shouldGrab } = useMoveCanvas(canvasRef, mousePos);
  const { brush, handleStroke, startStroke, endStroke, stroke } = useTools(
    canvasRef,
    zoom,
    brushRadius,
    tool,
    groundType
  );

  const renderGrid = useCallback(() => {
    const radius = HEX_SIZE * zoom.current;
    const context = canvasRef.current?.getContext(
      "2d"
    ) as CanvasRenderingContext2D;

    hexGrid(context, radius);
    drawMap(context, state.map, FLAT_TOP, HEX_SIZE * zoom.current);
    if (draw && (tool === Tool.Brush || tool === Tool.Line))
      drawMap(
        context,
        Array.from(stroke.values()),
        FLAT_TOP,
        HEX_SIZE * zoom.current
      );
    if (draw && tool === Tool.Eraser)
      eraseMap(
        context,
        Array.from(stroke.values()),
        FLAT_TOP,
        HEX_SIZE * zoom.current
      );
    drawBrush(context, brush, FLAT_TOP, radius, mousePos?.current);
  }, [brush, draw, state.map, stroke, tool, zoom]);

  const renderBrush = useCallback(() => {
    const radius = HEX_SIZE * zoom.current;
    const context = canvasRef.current?.getContext(
      "2d"
    ) as CanvasRenderingContext2D;

    drawBrush(context, brush, FLAT_TOP, radius, mousePos?.current);
  }, [brush, zoom]);

  const throttledRenderGrid = useThrottleRAF(renderGrid, 120); //remplace with animate

  useOnMount(canvasRef, throttledRenderGrid);
  useWindowResize(canvasRef, throttledRenderGrid);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (shouldGrab) {
        setGrab(true);
        return;
      }
      setDraw(true);
      startStroke(e);
      handleStroke(e);
      throttledRenderGrid();
    },
    [handleStroke, shouldGrab, startStroke, throttledRenderGrid]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (grab) handleMove(e);
      if (draw) handleStroke(e);
      throttledRenderGrid();
      mousePos.current = Point(e.clientX, e.clientY);
    },
    [grab, handleMove, handleStroke, draw, throttledRenderGrid]
  );

  const handleWheel = useCallback(
    (e: React.WheelEvent<HTMLCanvasElement>) => {
      handleZoom(e);
      throttledRenderGrid();
    },
    [handleZoom, throttledRenderGrid]
  );

  const handleMouseUp = useCallback(() => {
    if (shouldGrab) {
      setGrab(false);
      return;
    }
    setDraw(false);
    endStroke();
    updateMap(Array.from(stroke.values()));
    throttledRenderGrid();
  }, [endStroke, shouldGrab, stroke, throttledRenderGrid, updateMap]);

  return (
    <canvas
      ref={canvasRef}
      width="800"
      height="500"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onMouseOut={handleMouseUp}
      onWheel={handleWheel}
    />
  );
}

export default Canvas;
