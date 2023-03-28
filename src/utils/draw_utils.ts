import Color from "colorjs.io";
import { CellType } from "../components/tools/SelectCellType";
import {
  Cell,
  hex_add,
  hex_to_pixel,
  Orientation,
  pixel_to_hex,
  Point,
} from "./hex_utils";

export const HEX_SIZE = 100;

export function clearCanvas(context: CanvasRenderingContext2D) {
  const height = context.canvas.height;
  const width = context.canvas.width;

  const storedTransform = context.getTransform();
  // clear canvas
  context.resetTransform();
  context.clearRect(0, 0, width, height);
  // reapply zoom and offset
  context.setTransform(storedTransform);
}

export function hexagon(i: number, j: number, radius: number): Path2D {
  const a = (2 * Math.PI) / 6;

  const verticalOffset = i % 2;
  const x = Math.round(radius * i * (1 + Math.cos(a)));
  const y = Math.round(radius * Math.sin(a) * (2 * j + verticalOffset));

  return hexPath(x, y, radius);
}

export function hexPath(x: number, y: number, radius: number) {
  const a = (2 * Math.PI) / 6;
  const path = new Path2D();
  for (let i = 0; i < 6; i++) {
    path.lineTo(x + radius * Math.cos(a * i), y + radius * Math.sin(a * i));
  }
  path.closePath();
  return path;
}

export function hexGrid(context: CanvasRenderingContext2D, radius: number) {
  // see html canvas doc for transform matrix values
  const storedTransform = context.getTransform();

  const dx = storedTransform.e;
  const dy = storedTransform.f;

  const height = context.canvas.height;
  const width = context.canvas.width;

  // flat top configuration https://www.redblobgames.com/grids/hexagons/
  const hexWidth = Math.round((3 / 2) * radius);
  const hexHeight = Math.round(Math.sqrt(3) * radius);

  const nbColumns = Math.ceil(width / hexWidth) + 2;
  const nbRows = Math.ceil(height / hexHeight) + 2;
  // offset in number of hexagone
  const colOffset = Math.floor(dx / hexWidth) + 1;
  const rowOffset = Math.floor(dy / hexHeight) + 1;

  clearCanvas(context);

  context.lineWidth = 1;
  context.strokeStyle = "black";
  for (let j = -rowOffset; j <= nbRows - rowOffset; j++) {
    for (let i = -colOffset; i <= nbColumns - colOffset; i++) {
      context.fillStyle = "transparent";
      const path = hexagon(i, j, radius);
      context.fill(path);
      context.stroke(path);
    }
  }
}

export function isHexOnScreen(
  context: CanvasRenderingContext2D,
  point: Point,
  size: number
) {
  const width = context.canvas.width;
  const height = context.canvas.height;
  const transform = context.getTransform();

  const pointOffset = { x: point.x + transform.e, y: point.y + transform.f };

  return (
    pointOffset.x >= -size &&
    pointOffset.x <= width + size &&
    pointOffset.y >= -size &&
    pointOffset.y <= height + size
  );
}

export function drawMap(
  context: CanvasRenderingContext2D,
  map: Cell[],
  orientation: Orientation,
  size: number
) {
  map?.forEach((e) => {
    const point = hex_to_pixel(orientation, size, e);
    if (!isHexOnScreen(context, point, size)) return;

    const path = hexPath(point.x, point.y, size);
    context.lineWidth = 2;
    context.strokeStyle = "white";
    context.fillStyle = CellType[e.value];
    context.fill(path);
    context.stroke(path);
  });
}

export function drawBrush(
  context: CanvasRenderingContext2D,
  brush: Cell[],
  orientation: Orientation,
  size: number,
  mousePos: Point
) {
  const transform = context.getTransform();

  const dx = mousePos.x - transform.e;
  const dy = mousePos.y - transform.f;

  const brushColor = new Color(CellType[brush[0].value]);
  brushColor.alpha = 0.3;

  brush.forEach((e) => {
    const cubeOffset = pixel_to_hex(orientation, size, Point(dx, dy));
    const newHex = hex_add(cubeOffset, e);
    const point = hex_to_pixel(orientation, size, newHex);
    if (!isHexOnScreen(context, point, size)) return;

    const path = hexPath(point.x, point.y, size); // TODO have only the stroke with no neighbor
    context.lineWidth = 5;
    context.fillStyle = brushColor.toString();
    context.strokeStyle = "#FFFF00";
    context.fill(path);
    context.stroke(path);
  });
}

export function eraseMap(
  context: CanvasRenderingContext2D,
  map: Cell[],
  orientation: Orientation,
  size: number
) {
  map.forEach((e) => {
    const point = hex_to_pixel(orientation, size, e);
    if (!isHexOnScreen(context, point, size)) return;

    const path = hexPath(point.x, point.y, size);
    context.globalCompositeOperation = "destination-out";
    context.lineWidth = 1;
    context.fill(path);
    context.globalCompositeOperation = "source-over";
    context.strokeStyle = "black";
    context.stroke(path);
  });
}

export function drawPreview(
  context: CanvasRenderingContext2D,
  map: Cell[],
  orientation: Orientation,
  size: number,
  offset: Point
) {
  context.resetTransform();
  context.translate(-offset.x, -offset.y);

  map.forEach((e) => {
    const point = hex_to_pixel(orientation, size, e);

    const path = hexPath(point.x, point.y, size);
    context.fillStyle = CellType[e.value];
    context.fill(path);
  });
}
