// https://www.redblobgames.com/grids/hexagons/implementation.html#fractionalhex

export type Point = { x: number; y: number };

export type HexCube = { q: number; r: number; s: number };

export type HexOffset = { col: number; row: number };

export type Orientation = {
  f0: number;
  f1: number;
  f2: number;
  f3: number;
  b0: number;
  b1: number;
  b2: number;
  b3: number;
  startAngle: number;
};

export const pointTop: Orientation = {
  f0: Math.sqrt(3.0),
  f1: Math.sqrt(3.0) / 2.0,
  f2: 0.0,
  f3: 3.0 / 2.0,
  b0: Math.sqrt(3.0) / 3.0,
  b1: -1.0 / 3.0,
  b2: 0.0,
  b3: 2.0 / 3.0,
  startAngle: 0.5,
};

export const flatTop: Orientation = {
  f0: 3.0 / 2.0,
  f1: 0.0,
  f2: Math.sqrt(3.0) / 2.0,
  f3: Math.sqrt(3.0),
  b0: 2.0 / 3.0,
  b1: 0.0,
  b2: -1.0 / 3.0,
  b3: Math.sqrt(3.0) / 3.0,
  startAngle: 0.0,
};

export type Layout = {
  orientation: Orientation;
  size: number; // hex radius
  origin: Point;
};

export function Point(x: number, y: number): Point {
  return { x: x, y: y };
}

export function Hex(q: number, r: number, s: number): HexCube {
  if (Math.round(q + r + s) !== 0) throw "q + r + s must be 0";
  return { q: q, r: r, s: s };
}

export function hex_add(a: HexCube, b: HexCube): HexCube {
  return Hex(a.q + b.q, a.r + b.r, a.s + b.s);
}

export function hex_subtract(a: HexCube, b: HexCube): HexCube {
  return Hex(a.q - b.q, a.r - b.r, a.s - b.s);
}

export function hex_scale(a: HexCube, k: number) {
  return Hex(a.q * k, a.r * k, a.s * k);
}

export function hex_rotate_left(a: HexCube) {
  return Hex(-a.s, -a.q, -a.r);
}

export function hex_rotate_right(a: HexCube) {
  return Hex(-a.r, -a.s, -a.q);
}

const hex_directions = [
  Hex(1, 0, -1),
  Hex(1, -1, 0),
  Hex(0, -1, 1),
  Hex(-1, 0, 1),
  Hex(-1, 1, 0),
  Hex(0, 1, -1),
];

export function hex_direction(direction: number) {
  return hex_directions[Math.abs(direction % 6)];
}

export function hex_neighbor(hex: HexCube, direction: number) {
  return hex_add(hex, hex_direction(direction));
}

const hex_diagonals = [
  Hex(2, -1, -1),
  Hex(1, -2, 1),
  Hex(-1, -1, 2),
  Hex(-2, 1, 1),
  Hex(-1, 2, -1),
  Hex(1, 1, -2),
];

export function hex_diagonal_neighbor(hex: HexCube, direction: number) {
  return hex_add(hex, hex_diagonals[direction]);
}

// distance from origin
export function hex_length(hex: HexCube) {
  return (Math.abs(hex.q) + Math.abs(hex.r) + Math.abs(hex.s)) / 2;
}

// distance between two hex
export function hex_distance(a: HexCube, b: HexCube) {
  return hex_length(hex_subtract(a, b));
}

// round fractional hex coord
export function hex_round(h: HexCube) {
  let qi = Math.round(h.q);
  let ri = Math.round(h.r);
  let si = Math.round(h.s);

  const q_diff = Math.abs(qi - h.q);
  const r_diff = Math.abs(ri - h.r);
  const s_diff = Math.abs(si - h.s);

  if (q_diff > r_diff && q_diff > s_diff) {
    qi = -ri - si;
  } else if (r_diff > s_diff) {
    ri = -qi - si;
  } else {
    si = -qi - ri;
  }
  return Hex(qi, ri, si);
}

// linear interpolation between two hex
export function hex_lerp(a: HexCube, b: HexCube, t: number) {
  return Hex(
    a.q * (1.0 - t) + b.q * t,
    a.r * (1.0 - t) + b.r * t,
    a.s * (1.0 - t) + b.s * t
  );
}

export function hex_linedraw(a: HexCube, b: HexCube) {
  const N = hex_distance(a, b);
  const a_nudge = Hex(a.q + 1e-6, a.r + 1e-6, a.s - 2e-6);
  const b_nudge = Hex(b.q + 1e-6, b.r + 1e-6, b.s - 2e-6);
  const results = [];
  const step = 1.0 / Math.max(N, 1);
  for (let i = 0; i <= N; i++) {
    results.push(hex_round(hex_lerp(a_nudge, b_nudge, step * i)));
  }
  return results;
}

export function OffsetCoord(col: number, row: number): HexOffset {
  return { col: col, row: row };
}

const EVEN = 1;
const ODD = -1;
export function qoffset_from_cube(offset: number, h: HexCube) {
  const col = h.q;
  const row = h.r + (h.q + offset * (h.q & 1)) / 2;
  if (offset !== EVEN && offset !== ODD) {
    throw "offset must be EVEN (+1) or ODD (-1)";
  }
  return OffsetCoord(col, row);
}

export function qoffset_to_cube(offset: number, h: HexOffset) {
  const q = h.col;
  const r = h.row - (h.col + offset * (h.col & 1)) / 2;
  const s = -q - r;
  if (offset !== EVEN && offset !== ODD) {
    throw "offset must be EVEN (+1) or ODD (-1)";
  }
  return Hex(q, r, s);
}

export function roffset_from_cube(offset: number, h: HexCube) {
  const col = h.q + (h.r + offset * (h.r & 1)) / 2;
  const row = h.r;
  if (offset !== EVEN && offset !== ODD) {
    throw "offset must be EVEN (+1) or ODD (-1)";
  }
  return OffsetCoord(col, row);
}

export function roffset_to_cube(offset: number, h: HexOffset) {
  const q = h.col - (h.row + offset * (h.row & 1)) / 2;
  const r = h.row;
  const s = -q - r;
  if (offset !== EVEN && offset !== ODD) {
    throw "offset must be EVEN (+1) or ODD (-1)";
  }
  return Hex(q, r, s);
}

export function hex_to_pixel(
  M: Orientation,
  size: number,
  h: HexCube,
  origin: Point = { x: 0, y: 0 }
) {
  const x = (M.f0 * h.q + M.f1 * h.r) * size;
  const y = (M.f2 * h.q + M.f3 * h.r) * size;
  return Point(x + origin.x, y + origin.y);
}

export function pixel_to_hex(
  M: Orientation,
  size: number,
  p: Point,
  origin: Point = { x: 0, y: 0 }
) {
  const pt = Point((p.x - origin.x) / size, (p.y - origin.y) / size);

  const q = M.b0 * pt.x + M.b1 * pt.y;
  const r = M.b2 * pt.x + M.b3 * pt.y;
  const s = -q - r;
  return hex_round(Hex(q, r, s));
}

export function hex_to_JSON(hex: HexCube) {
  return JSON.stringify(hex);
}

export function JSON_to_hex(hexJSON: string) {
  return JSON.parse(hexJSON);
}
