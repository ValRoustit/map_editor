import { useCallback, useEffect, useRef, useState } from "react";
import { CellType, CellTypeKeys } from "../components/tools/SelectCellType";
import { Tool } from "../components/tools/Toolbar";
import { HEX_SIZE } from "../utils/draw_utils";
import {
  Cell,
  FLAT_TOP,
  HexCube,
  hex_add,
  hex_compare,
  hex_linedraw,
  hex_range,
  hex_to_string,
  ORIGIN_CUBE,
  pixel_to_hex,
  Point,
} from "../utils/hex_utils";

export function useTools(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  zoom: React.MutableRefObject<number>,
  brushRadius: number,
  tool: Tool,
  groundType: CellTypeKeys
) {
  const brushCenter = useRef<HexCube>();
  const [brush, setBrush] = useState<Cell[]>([]);
  const [stroke, setStroke] = useState<Map<string, Cell>>(new Map());

  useEffect(() => {
    const hexArray = hex_range(ORIGIN_CUBE, brushRadius);

    setBrush(hexArray.map<Cell>((h) => ({ ...h, value: groundType })));
  }, [brushRadius, groundType]);

  const getHex = useCallback(
    (mousePos: Point) => {
      const context = canvasRef.current?.getContext(
        "2d"
      ) as CanvasRenderingContext2D;
      const transform = context.getTransform();
      const offset = Point(transform.e, transform.f);

      const hex = pixel_to_hex(
        FLAT_TOP,
        zoom.current * HEX_SIZE,
        mousePos,
        offset
      );
      return hex;
    },
    [canvasRef, zoom]
  );

  const startStroke = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      const mousePos = Point(event.clientX, event.clientY);

      const hex = getHex(mousePos);

      brushCenter.current = hex;

      const value = tool === Tool.Eraser ? "Empty" : groundType;
      brush.forEach((e) => {
        const h = hex_add(hex, e);
        stroke.set(hex_to_string(h), { ...h, value: value });
      });
    },
    [brush, getHex, groundType, stroke, tool]
  );

  const endStroke = useCallback(() => {
    setStroke(new Map());
  }, []);

  const handleStroke = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      const mousePos = Point(event.clientX, event.clientY);

      const hex = getHex(mousePos);

      if (!brushCenter.current || hex_compare(hex, brushCenter.current)) return;

      const line = hex_linedraw(brushCenter.current, hex);

      if (tool !== Tool.Line) brushCenter.current = hex;
      if (tool === Tool.Line) stroke.clear();

      const value = tool === Tool.Eraser ? "Empty" : groundType;

      line.forEach((hexLine) => {
        brush.forEach((e) => {
          const h = hex_add(hexLine, e);
          stroke.set(hex_to_string(h), { ...h, value: value });
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
