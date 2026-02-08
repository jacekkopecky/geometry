import { canvas, draw, getCursorCoords, getNearestCircle } from './canvas.js';
import { getCurrentColor, nextColor } from './colors.js';
import { currentlyDeleting, toggleDelete } from './deleting.js';
import { dist } from './nearest.js';
import { addFromUnfinished, circles, deleteCircle, resetCircles, resetView, setCursorPosition, setUnfinished, viewParams, } from './state.js';
// a move shorter than this time in milliseconds counts as a click
const MIN_MOVE_TIME_MS = 100;
// variables for the workflow of selecting points that define a circle
let currentStartPoint;
let currentRadiusStartPoint;
let currentEndPoint;
// variables for dragging the canvas
let currentMouseStart = undefined;
let currentMouseMoving = false;
let currentMouseMoveMinTime = 0;
window.addEventListener('load', setUpListeners);
function setUpListeners() {
    canvas.addEventListener('wheel', mouseZoom, { passive: false });
    canvas.addEventListener('mousemove', mouseMove);
    canvas.addEventListener('mousedown', mouseDown);
    canvas.addEventListener('mouseup', mouseUp);
    canvas.addEventListener('mouseleave', mouseLeave);
    document.addEventListener('keyup', keyUp);
    document.addEventListener('keydown', keyDown);
    const resetButtons = document.querySelectorAll('button.reset');
    for (const btn of resetButtons) {
        btn.addEventListener('click', resetCanvasData);
    }
}
function mouseZoom(e) {
    e.stopPropagation();
    e.preventDefault();
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
}
function mouseDown(e) {
    currentMouseStart = getCursorCoords(e);
    currentMouseMoveMinTime = Date.now() + MIN_MOVE_TIME_MS;
}
function addPoint(p, startOtherRadius = false) {
    if (currentStartPoint) {
        if (!startOtherRadius) {
            addFromUnfinished();
            resetCurrents();
        }
        else {
            currentRadiusStartPoint = p;
            currentEndPoint = undefined;
            updateUnfinished();
        }
    }
    else {
        currentStartPoint = p;
        currentEndPoint = undefined;
        currentRadiusStartPoint = undefined;
        updateUnfinished();
    }
}
function updateUnfinished() {
    if (currentStartPoint && (currentEndPoint || currentRadiusStartPoint)) {
        // a circle
        const [x, y] = currentStartPoint;
        const radiusStart = currentRadiusStartPoint || currentStartPoint;
        const r = currentEndPoint ? dist(radiusStart, currentEndPoint) : 0;
        setUnfinished([x, y, r, getCurrentColor()]);
    }
    else if (currentStartPoint) {
        // a single point or nothing, always in default color
        setUnfinished(currentStartPoint);
    }
}
function mouseUp(e) {
    if (currentlyDeleting && !currentMouseMoving) {
        deleteCircle(getNearestCircle(e));
        toggleDelete();
        draw();
    }
    else if (currentMouseStart && !currentMouseMoving) {
        // clicked without a move
        const snap = !e.shiftKey;
        const startOtherRadius = currentRadiusStartPoint == null && (e.altKey || e.metaKey);
        addPoint(getCursorCoords(e, snap), startOtherRadius);
        draw();
    }
    else {
        draw();
    }
    currentMouseStart = undefined;
    currentMouseMoving = false;
}
function mouseMove(e) {
    if (currentMouseStart) {
        // we're dragging the canvas
        // ignore the first MIN_MOVE_TIME_MS of a move
        if (Date.now() < currentMouseMoveMinTime)
            return;
        const [x, y] = getCursorCoords(e);
        viewParams.moveOffset(x - currentMouseStart[0], y - currentMouseStart[1]);
        draw();
        // recompute canvas coords as we've moved the offset
        currentMouseStart = getCursorCoords(e);
        currentMouseMoving = true;
    }
    else {
        // not dragging
        const snap = !e.shiftKey;
        const p = getCursorCoords(e, snap);
        setCursorPosition(p);
        if (currentStartPoint) {
            currentEndPoint = p;
            updateUnfinished();
        }
        draw();
    }
}
function mouseLeave() {
    currentMouseStart = undefined;
    currentMouseMoving = false;
    setCursorPosition(undefined);
    draw();
}
function keyUp(e) {
    // ignore keys with modifiers
    if (e.shiftKey || e.altKey || e.ctrlKey || e.metaKey)
        return;
    switch (e.key) {
        case 'Escape':
            resetCurrents();
            toggleDelete(false);
            draw();
            break;
        case 'r':
            resetView();
            draw();
            break;
        case 'c':
            nextColor();
            updateUnfinished();
            draw();
            break;
        case 'd':
            toggleDelete();
            draw();
            break;
    }
}
function keyDown(e) {
    // cmd-z must be done on keydown, it doesn't get to keyup
    if (e.key === 'z' && (e.metaKey || e.altKey || e.ctrlKey)) {
        // undo - delete last circle
        deleteCircle(circles.at(-1));
        draw();
        e.preventDefault();
        return;
    }
}
function resetCurrents() {
    currentStartPoint = undefined;
    currentRadiusStartPoint = undefined;
    currentEndPoint = undefined;
    setUnfinished(undefined);
}
function resetCanvasData(e) {
    // throw an exception if the data doesn't parse
    const circles = JSON.parse(e.target.dataset.circles ?? 'error');
    resetCircles(circles);
    draw();
}
//# sourceMappingURL=ui-controls.js.map