import { useCallback, useRef } from "react";
import { MapType } from "../context/useMap";
import { SIZE } from "../utils/draw_utils";
import {
  flatTop,
  HexCube,
  hex_to_JSON,
  pixel_to_hex,
  Point,
} from "../utils/hex_utils";

export function useTools(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  zoom: React.MutableRefObject<number>
) {
  const brush = useRef<MapType>();
  const brushCenter = useRef<HexCube>();

  // const toolRender = useCallback(() => {
  //   const context = canvasRef.current?.getContext(
  //     "2d"
  //   ) as CanvasRenderingContext2D;
  //   if (!brush.current) return;
  //   drawMap(context, brush.current, flatTop, size);
  // }, [canvasRef, size]);

  const getHex = useCallback(
    (mousePos: Point) => {
      const context = canvasRef.current?.getContext(
        "2d"
      ) as CanvasRenderingContext2D;
      const transform = context.getTransform();
      const offset = { x: transform.e, y: transform.f };

      const hex = pixel_to_hex(flatTop, zoom.current * SIZE, mousePos, offset);
      return hex;
    },
    [canvasRef, zoom]
  );

  const handleBrush = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      const mousePos = { x: event.clientX, y: event.clientY };

      const hex = getHex(mousePos);

      if (hex === brushCenter.current) return;

      brushCenter.current = hex;
      const mapKey = hex_to_JSON(hex);
      brush.current = new Map() as MapType;
      brush.current?.set(mapKey, "rgb(255 122 127 / 10%)");
    },
    [getHex]
  );

  return {
    brush,
    handleBrush,
  };
}
