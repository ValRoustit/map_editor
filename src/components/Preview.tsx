import { useCallback, useEffect, useRef } from "react";
import { useMapContext } from "../context/MapContext";
import useThrottleRAF from "../hooks/useThrottleRAF";
import { drawPreview, HEX_SIZE } from "../utils/draw_utils";
import {
  FLAT_TOP,
  HexCube,
  hex_length,
  hex_to_pixel,
  Point,
} from "../utils/hex_utils";

export type CanvasLimitsType = {
  topLeft: Point;
  bottomRight: Point;
};

export default function Preview() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasSize = useRef(0);
  const offset = useRef({ x: 0, y: 0 });
  const renderHexSize = useRef(HEX_SIZE);
  const { state } = useMapContext();

  const renderGrid = useCallback(() => {
    const context = canvasRef.current?.getContext(
      "2d"
    ) as CanvasRenderingContext2D;

    drawPreview(
      context,
      state.map,
      FLAT_TOP,
      renderHexSize.current,
      offset.current
    );
  }, [state]);

  const throttledRenderGrid = useThrottleRAF(renderGrid);

  // TODO: limit canvas size with panzoom and move canvas,
  // TODO: constant preview size and add red box to visualize where in canvas you are should be able to grab and zoom from preview?

  const setCanvasValues = useCallback(() => {
    for (const cell of state.map) {
      const pos = hex_to_pixel(FLAT_TOP, renderHexSize.current, cell);
      offset.current.x = Math.min(
        offset.current.x,
        (pos.x -= 2 * renderHexSize.current)
      );
      offset.current.y = Math.min(
        offset.current.y,
        (pos.y -= 2 * renderHexSize.current)
      );

      canvasSize.current = Math.max(
        canvasSize.current,
        pos.x - offset.current.x + 2 * renderHexSize.current
      );
      canvasSize.current = Math.max(
        canvasSize.current,
        pos.y - offset.current.y + 2 * renderHexSize.current
      );
    }

    if (canvasSize.current > 100) renderHexSize.current = 10;
  }, [state]);

  useEffect(() => {
    setCanvasValues();

    if (canvasRef.current) {
      canvasRef.current.width = Math.max(200, canvasSize.current);
      canvasRef.current.height = Math.max(200, canvasSize.current);
    }
    throttledRenderGrid();
  }, [setCanvasValues, state, throttledRenderGrid]);

  return (
    <canvas className="preview" ref={canvasRef} width="250" height="250" />
  );
}
