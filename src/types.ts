export type Point = Readonly<[x: number, y: number]>;
export type Vector = Point;
export type Circle = Readonly<[x: number, y: number, radius?: number]>;

export function isPoint(c: Circle): c is Point {
  return !c[2];
}
