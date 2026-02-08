import type { Circle, Point } from './types.js';
interface ViewParams {
    scale: number;
    readonly offset: Point;
    moveOffset(x: number, y: number): void;
    _scale: number;
    _offset: Point;
}
export declare const viewParams: ViewParams;
export declare const circles: Circle[];
export declare let currentCursor: Point | undefined;
export declare let currentUnfinished: Circle | undefined;
export declare function setCursorPosition(p?: Point): void;
export declare function addFromUnfinished(): void;
export declare function setUnfinished(c?: Circle): void;
export declare function deleteCircle(c?: Circle): void;
export declare function resetView(): void;
export declare function resetCircles(arr: Circle[]): void;
export {};
//# sourceMappingURL=state.d.ts.map