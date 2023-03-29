import { useCallback, useEffect, useRef, useState } from "react";
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
import {
  FLAT_TOP,
  Hex,
  HexCube,
  hex_compare,
  pixel_to_hex,
  Point,
} from "../utils/hex_utils";
import { Tool } from "./tools/Toolbar";
import { useMapContext } from "../context/MapContext";
import { useTools } from "../hooks/useTools";
import useWindowResize from "../hooks/useWindowResize";
import useRenderCanvasOnMount from "../hooks/useRenderCanvasOnMount";
import { CellTypeKeys } from "./tools/SelectCellType";

export interface CanvasProps {
  brushRadius: number;
  groundType: CellTypeKeys;
  tool: Tool;
}

export default function Canvas({ brushRadius, groundType, tool }: CanvasProps) {
  // TODO add second canvas for cursor rendering
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePos = useRef<Point>({ x: 0, y: 0 });
  const brushCenter = useRef<HexCube>(Hex(0, 0, 0));
  const [draw, setDraw] = useState(false);
  const [grab, setGrab] = useState(false);
  const [displayBrush, setDisplayBrush] = useState(false);

  const { state, updateMap } = useMapContext();

  const { handleZoom, zoom } = usePanZoom(canvasRef);
  const { handleMove, canGrab } = useMoveCanvas(canvasRef, mousePos, tool);
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
    if (displayBrush)
      drawBrush(context, brush, FLAT_TOP, radius, mousePos?.current); // TODO fix display brush when selecting grab tool and display before cursor on the canvas
  }, [brush, draw, displayBrush, state.map, stroke, tool, zoom]);

  const hasBrushMoved = useCallback(() => {
    const radius = HEX_SIZE * zoom.current;
    const context = canvasRef.current?.getContext(
      "2d"
    ) as CanvasRenderingContext2D;

    const transform = context.getTransform();
    const offset = Point(transform.e, transform.f);

    const hex = pixel_to_hex(FLAT_TOP, radius, mousePos.current, offset);
    const prevBrushPos = brushCenter.current;
    brushCenter.current = hex;

    return !hex_compare(hex, prevBrushPos);
  }, [zoom]);

  const throttledRenderGrid = useThrottleRAF(renderGrid);

  useRenderCanvasOnMount(canvasRef, renderGrid);
  useWindowResize(canvasRef, throttledRenderGrid);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (e.button !== 0) return;
      if (canGrab) {
        setGrab(true);
        return;
      }
      setDraw(true);
      startStroke(e);
      handleStroke(e);
      renderGrid();
    },
    [handleStroke, renderGrid, canGrab, startStroke]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (grab) {
        handleMove(e);
        throttledRenderGrid();
      }
      if (draw) handleStroke(e);
      if (hasBrushMoved()) {
        throttledRenderGrid();
      }
      mousePos.current = Point(e.clientX, e.clientY);
    },
    [grab, draw, handleStroke, hasBrushMoved, handleMove, throttledRenderGrid]
  );

  const handleWheel = useCallback(
    (e: React.WheelEvent<HTMLCanvasElement>) => {
      handleZoom(e);
      throttledRenderGrid();
    },
    [handleZoom, throttledRenderGrid]
  );

  const handleMouseUp = useCallback(() => {
    if (canGrab) {
      setGrab(false);
    }
    if (draw) {
      endStroke();
      updateMap(Array.from(stroke.values()));
      setDraw(false);
    }
  }, [draw, endStroke, canGrab, stroke, updateMap]);

  const handleMouseOut = useCallback(() => {
    setDisplayBrush(false);
    handleMouseUp();
  }, [handleMouseUp]);

  useEffect(() => {
    renderGrid();
  }, [renderGrid, displayBrush]);

  useEffect(() => {
    let cursor = "auto";
    setDisplayBrush(!canGrab);
    if (!canGrab) setGrab(false);
    if (canvasRef.current) {
      if (grab) cursor = "grabbing";
      else if (canGrab) cursor = "grab";
      else cursor = "auto";
      canvasRef.current.style.cursor = cursor;
    }
  }, [grab, canGrab]);

  return (
    <canvas
      ref={canvasRef}
      width="800"
      height="500"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setDisplayBrush(true)}
      onMouseOut={handleMouseOut}
      onWheel={handleWheel}
    />
  );
}
