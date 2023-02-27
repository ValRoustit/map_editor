import { MapType } from "../context/useMap";

export type Draw = (context: CanvasRenderingContext2D) => void;

export type Pen = {
  active: boolean;
  x: number;
  y: number;
  value: string;
  radius: number;
};

export const radius = 100;

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

export function hexagon(i: number, j: number): Path2D {
  const a = (2 * Math.PI) / 6;

  const verticalOffset = (i + 1) % 2; // offset for vertical layout
  const x = Math.round(radius * i * (1 + Math.cos(a)));
  const y = Math.round(radius * Math.sin(a) * (2 * j + verticalOffset));

  const path = new Path2D();
  for (var i = 0; i < 6; i++) {
    path.lineTo(x + radius * Math.cos(a * i), y + radius * Math.sin(a * i));
  }
  return path;
}

// export function hexGridDash(context: CanvasRenderingContext2D, radius: number) {
//   // see doc for transform matrix values
//   const storedTransform = context.getTransform();

//   const dx = Math.round(storedTransform.e);
//   const dy = Math.round(storedTransform.f);

//   const height = context.canvas.height;
//   const width = context.canvas.width;

//   // for flat top orientation
//   const horiSpacing = Math.round((3 / 2) * radius);
//   const vertSpacing = Math.round(Math.sqrt(3) * radius);

//   // flat top configuration https://www.redblobgames.com/grids/hexagons/
//   const nbColumns = Math.ceil(width / horiSpacing) + 2;
//   const nbRows = Math.ceil(height / vertSpacing) + 2;
//   // offset in number of hexagone
//   const colOffset = Math.floor(dx / horiSpacing) + 1;
//   const rowOffset = Math.floor(dy / vertSpacing) + 1;

//   context.beginPath();
//   context.setLineDash([radius, radius * 2]);
//   context.moveTo(0, 50);
//   context.lineTo(300, 50);
//   context.stroke();
// }

export function hexGrid(
  context: CanvasRenderingContext2D,
  xm: number,
  ym: number
) {
  // see doc for transform matrix values
  const storedTransform = context.getTransform();

  const scale = storedTransform.a;
  const dx = Math.round(storedTransform.e / scale);
  const dy = Math.round(storedTransform.f / scale);

  const height = context.canvas.height / scale;
  const width = context.canvas.width / scale;

  const hexWidth = Math.round((3 / 2) * radius);
  const hexHeight = Math.round(Math.sqrt(3) * radius);

  // flat top configuration https://www.redblobgames.com/grids/hexagons/
  const nbColumns = Math.ceil(width / hexWidth) + 2;
  const nbRows = Math.ceil(height / hexHeight) + 2;
  // offset in number of hexagone
  const colOffset = Math.floor(dx / hexWidth) + 1;
  const rowOffset = Math.floor(dy / hexHeight) + 1;

  clearCanvas(context);

  for (let j = -rowOffset; j <= nbRows - rowOffset; j++) {
    for (let i = -colOffset; i <= nbColumns - colOffset; i++) {
      context.fillStyle = "transparent";
      context.strokeStyle = "white";

      const hexPath = hexagon(i, j);
      if (i === 0 && j === 0) context.fillStyle = "red";
      if (context.isPointInPath(hexPath, xm, ym)) {
        console.log("i: ", i);
        console.log("j: ", j);
      }

      context.stroke(hexPath);
      context.fill(hexPath);
    }
  }
}

export function drawMap(context: CanvasRenderingContext2D, map: MapType) {
  context.lineWidth = 3;
  context.strokeStyle = "black";
  map.forEach((value, key) => {
    const hexPath = hexagon(key.x, key.y);
    context.fillStyle = value;
    context.stroke(hexPath);
    context.fill(hexPath);
  });

  // if (map?.has(`${i}, ${j}`))  = map.get(`${i}-${j}`)!;
  //     if (pen?.active && context.isPointInPath(hexPath, pen.x, pen.y)) {
  //       console.log("pen");
  //       context.lineWidth = 3;
  //       context.fillStyle = pen.value;
  //       context.strokeStyle = "black";

  //       map?.set(`${i}-${j}`, pen.value);
  //     }
}

export function drawPen(
  context: CanvasRenderingContext2D,
  map: MapType,
  pen: Pen
) {
  const storedTransform = context.getTransform();
  const scale = storedTransform.a;
  const dx = Math.round(storedTransform.e / scale);
  const dy = Math.round(storedTransform.f / scale);
}
