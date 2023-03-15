import { useCallback, useEffect, useRef, useState } from "react";
import { Tool } from "../components/Toolbar";
import { MapType } from "../context/useMap";
import { SIZE } from "../utils/draw_utils";
import {
  flatTop,
  HexCube,
  hex_add,
  hex_linedraw,
  hex_range,
  hex_spiral,
  hex_to_JSON,
  JSON_to_hex,
  ORIGIN_CUBE,
  pixel_to_hex,
  Point,
} from "../utils/hex_utils";

export function useTools(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  zoom: React.MutableRefObject<number>,
  brushRadius: number,
  tool: Tool,
  groundType: string
) {
  const brushCenter = useRef<HexCube>();
  const [brush, setBrush] = useState<MapType>(new Map());
  const [stroke, setStroke] = useState<MapType>(new Map());

  useEffect(() => {
    const hexArray = hex_range(ORIGIN_CUBE, brushRadius);
    const newBrush = new Map() as MapType;
    hexArray?.forEach((h) => {
      newBrush?.set(hex_to_JSON(h), "rgb(255 122 127 / 20%)");
    });
    setBrush(newBrush);
  }, [brushRadius]);

  const getHex = useCallback(
    (mousePos: Point) => {
      const context = canvasRef.current?.getContext(
        "2d"
      ) as CanvasRenderingContext2D;
      const transform = context.getTransform();
      const offset = Point(transform.e, transform.f);

      const hex = pixel_to_hex(flatTop, zoom.current * SIZE, mousePos, offset);
      return hex;
    },
    [canvasRef, zoom]
  );

  const startStroke = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      const mousePos = Point(event.clientX, event.clientY);

      const hex = getHex(mousePos);

      brushCenter.current = hex;
    },
    [getHex]
  );

  const endStroke = useCallback(() => {
    setStroke(new Map() as MapType);
  }, []);

  const handleStroke = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      const mousePos = Point(event.clientX, event.clientY);

      const hex = getHex(mousePos);

      if (!brushCenter.current) return;
      if (hex === brushCenter.current) return;

      const line = hex_linedraw(brushCenter?.current, hex);

      if (tool !== Tool.Line) brushCenter.current = hex;
      // const hexArray = hex_spiral(hex, brushRadius);

      const value = tool === Tool.Eraser ? "transparent" : groundType; // TODO: replace this

      if (tool === Tool.Line) stroke.clear();

      line.forEach((hexLine) => {
        brush.forEach((v, k) => {
          const newKey = hex_to_JSON(hex_add(hexLine, JSON_to_hex(k)));
          stroke.set(newKey, value);
        });
      });
    },
    [brush, getHex, groundType, stroke, tool]
  );

  return {
    brush,
    startStroke,
    endStroke,
    handleStroke,
    stroke,
    setStroke,
  };
}

// const handleBrush = useCallback(
//   (event: React.MouseEvent<HTMLCanvasElement>) => {
//     const mousePos = { x: event.clientX, y: event.clientY };

//     const hex = getHex(mousePos);

//     if (hex === brushCenter.current) return; // hexCube type does not nest any references

//     brushCenter.current = hex;
//     // const mapKey = hex_to_JSON(hex);
//     const hexArray = hex_spiral(hex, brushRadius);

//     brush.current.clear();
//     hexArray?.forEach((h) => {
//       brush.current?.set(hex_to_JSON(h), "rgb(255 122 127 / 10%)");
//     });
//   },
//   [brushRadius, getHex]
// );
