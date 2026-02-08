export type Point = Readonly<[x: number, y: number]>;
export type Vector = Point;
export type Circle = Readonly<[x: number, y: number, radius?: number, color?: string]>;
export declare function isPoint(c: Circle): c is Point;
//# sourceMappingURL=types.d.ts.map