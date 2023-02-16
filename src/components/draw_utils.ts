export type Draw = (context: CanvasRenderingContext2D) => void;

export function preDraw(context: CanvasRenderingContext2D) {
  const height = context.canvas.height;
  const width = context.canvas.width;

  const storedTransform = context.getTransform();
  // clear canvas
  context.resetTransform();
  context.clearRect(0, 0, width, height);
  // reapply zoom and offset
  context.setTransform(storedTransform);
}

export function hexagon(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number
) {
  const a = (2 * Math.PI) / 6;
  context.beginPath();
  for (var i = 0; i < 6; i++) {
    context.lineTo(x + r * Math.cos(a * i), y + r * Math.sin(a * i));
  }
  context.closePath();
  context.fill();
  context.stroke();
}

export function hexGrid(context: CanvasRenderingContext2D, radius: number) {
  // angle between hex center and two consecutives vertices
  const a = (2 * Math.PI) / 6;

  const storedTransform = context.getTransform();

  // see doc for setTransform
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
  // offset in hexagone
  const colOffset = Math.floor(dx / hexWidth) + 1;
  const rowOffset = Math.floor(dy / hexHeight) + 1;

  // might be usefull later
  const hex0 = {
    x: 0,
    y: 0,
  };

  preDraw(context);

  for (let j = -rowOffset; j <= nbRows - rowOffset; j++) {
    for (let i = -colOffset; i <= nbColumns - colOffset; i++) {
      context.fillStyle = "transparent";
      if (i === 0 && j === 0) context.fillStyle = "red";
      const verticalOffset = (i + 1) % 2; // offset for vertical layout
      const x = Math.round(hex0.x + radius * i * (1 + Math.cos(a)));
      const y = Math.round(
        hex0.y + radius * Math.sin(a) * (2 * j + verticalOffset)
      );
      hexagon(context, x, y, radius);
    }
  }
}
