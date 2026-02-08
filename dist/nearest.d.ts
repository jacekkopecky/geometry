import { type Circle, type Point } from './types.js';
export declare function findNearestPoint(pos: Point, circles: readonly Circle[], threshold: number): Point | undefined;
export declare function findNearestCircle(pos: Point, circles: readonly Circle[], threshold: number): Circle | undefined;
export declare function dist(p1: Point | Circle, p2: Point | Circle): number;
export declare function getCircleIntersections(c: Circle, circles: Circle[]): Point[];
//# sourceMappingURL=nearest.d.ts.map