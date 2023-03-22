// https://www.redblobgames.com/grids/hexagons/implementation.html#fractionalhex

export const ORIGIN_CUBE = Hex(0, 0, 0);

export type Point = { x: number; y: number };

export type HexCube = { q: number; r: number; s: number };

export interface Cell extends HexCube {
  value: string;
}

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

export const POINT_TOP: Orientation = {
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

export const FLAT_TOP: Orientation = {
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

export function hex_add<T extends HexCube, U extends HexCube>(
  a: T,
  b: U
): T & U {
  return { ...a, ...b, q: a.q + b.q, r: a.r + b.r, s: a.s + b.s };
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

export const HEX_DIRECTION = [
  Hex(1, 0, -1),
  Hex(1, -1, 0),
  Hex(0, -1, 1),
  Hex(-1, 0, 1),
  Hex(-1, 1, 0),
  Hex(0, 1, -1),
];

export function hex_direction(direction: number) {
  return HEX_DIRECTION[Math.abs(direction % 6)];
}

export function hex_neighbor(hex: HexCube, direction: number) {
  return hex_add(hex, hex_direction(direction));
}

export const HEX_DIAGONAL = [
  Hex(2, -1, -1),
  Hex(1, -2, 1),
  Hex(-1, -1, 2),
  Hex(-2, 1, 1),
  Hex(-1, 2, -1),
  Hex(1, 1, -2),
];

export function hex_diagonal_neighbor(hex: HexCube, direction: number) {
  return hex_add(hex, HEX_DIAGONAL[direction]);
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

export function hex_to_pixel(
  M: Orientation,
  size: number,
  h: HexCube,
  offset: Point = { x: 0, y: 0 }
) {
  const x = (M.f0 * h.q + M.f1 * h.r) * size;
  const y = (M.f2 * h.q + M.f3 * h.r) * size;
  return Point(x + offset.x, y + offset.y);
}

export function pixel_to_hex(
  M: Orientation,
  size: number,
  p: Point,
  offset: Point = { x: 0, y: 0 }
) {
  const pt = Point((p.x - offset.x) / size, (p.y - offset.y) / size);

  const q = M.b0 * pt.x + M.b1 * pt.y;
  const r = M.b2 * pt.x + M.b3 * pt.y;
  const s = -q - r;
  return hex_round(Hex(q, r, s));
}

export function hex_ring(center: HexCube, radius: number) {
  const ring: HexCube[] = [];

  let hex = hex_add(center, hex_scale(hex_direction(4), radius));
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < radius; j++) {
      ring.push(hex);
      hex = hex_neighbor(hex, i);
    }
  }
  return ring;
}

export function hex_spiral(center: HexCube, radius: number) {
  let results = [center];

  for (let i = 1; i <= radius; i++) {
    results = [...results, ...hex_ring(center, i)];
  }
  return results;
}

export function hex_range(center: HexCube, range: number) {
  const results = [];
  for (let q = -range; q <= range; q++) {
    for (
      let r = Math.max(-range, -q - range);
      r <= Math.min(range, -q + range);
      r++
    ) {
      const s = -q - r;
      results.push(hex_add(center, Hex(q, r, s)));
    }
  }
  return results;
}

export function hex_to_string(hex: HexCube) {
  return `${hex.q}_${hex.r}`;
}

export function map_size_to_pixel(
  M: Orientation,
  size: number,
  cols: number,
  rows: number
) {
  return { width: M.f0 * size * cols, height: M.f3 * size * rows };
}

export function hex_compare(h1: HexCube, h2: HexCube) {
  return h1.q === h2.q && h1.r === h2.r;
}
