import { canvas, draw, getCursorCoords } from './canvas.js';
import { addPoint, currentStartPoint, resetCurrents, setCursorPosition, setEndPoint, viewParams, } from './state.js';
canvas.addEventListener('wheel', mouseZoom);
canvas.addEventListener('mousemove', mouseMove);
canvas.addEventListener('mousedown', mouseDown);
canvas.addEventListener('mouseup', mouseUp);
canvas.addEventListener('mouseleave', mouseLeave);
document.addEventListener('keydown', keyDown);
function mouseZoom(e) {
    const zoomSpeed = 1 / 200;
    const max = 20;
    if (e.deltaY) {
        const [oldX, oldY] = getCursorCoords(e);
        const delta = e.deltaY < -max ? -max : e.deltaY > max ? max : e.deltaY;
        viewParams.scale *= 1 - delta * zoomSpeed;
        const [newX, newY] = getCursorCoords(e);
        viewParams.moveOffset(newX - oldX, newY - oldY);
        draw();
    }
    e.stopPropagation();
    e.preventDefault();
}
let currentMouseStart = undefined;
let currentMouseMoving = false;
function mouseDown(e) {
    currentMouseStart = getCursorCoords(e);
}
function mouseUp(e) {
    if (currentMouseStart && !currentMouseMoving) {
        // clicked without a move
        addPoint(getCursorCoords(e));
        draw();
    }
    else {
        draw();
    }
    currentMouseStart = undefined;
    currentMouseMoving = false;
}
function mouseMove(e) {
    const [x, y] = getCursorCoords(e);
    setCursorPosition([x, y]);
    if (!currentMouseStart) {
        if (currentStartPoint) {
            setEndPoint([x, y]);
        }
        draw();
    }
    else {
        viewParams.moveOffset(x - currentMouseStart[0], y - currentMouseStart[1]);
        draw();
        // recompute canvas coords as we've moved the offset
        currentMouseStart = getCursorCoords(e);
        currentMouseMoving = true;
    }
}
function mouseLeave() {
    setCursorPosition(undefined);
    draw();
}
function keyDown(e) {
    if (e.key === 'Escape') {
        resetCurrents();
        draw();
    }
}
//# sourceMappingURL=mouse.js.map