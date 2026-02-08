import { getCurrentColor } from './colors.js';
import { findNearestCircle, findNearestPoint } from './nearest.js';
import { circles, currentCursor, currentUnfinished, viewParams } from './state.js';
import type { Circle, Point } from './types.js';

export const canvas = document.querySelector('canvas')!;
const c = canvas.getContext('2d')!;

const CROSS_STYLE = 'black';
const CROSS_SIZE = 30;
const LINE_WIDTH = 1.5;
const POINT_RADIUS = 3 * LINE_WIDTH;
const SNAP_DISTANCE = CROSS_SIZE * Math.sqrt(2);

window.addEventListener('load', resizeCanvas);
window.addEventListener('resize', resizeCanvas);

function resizeCanvas() {
  canvas.width = canvas.clientWidth * window.devicePixelRatio;
  canvas.height = canvas.clientHeight * window.devicePixelRatio;

  draw();
}

function setCanvasTransform() {
  c.resetTransform();
  c.translate(canvas.width / 2, canvas.height / 2);

  const scale = viewParams.scale;
  c.scale(scale, scale);
  c.translate(...viewParams.offset);

  c.lineWidth = LINE_WIDTH / scale;
}

export function draw() {
  clearCanvas();
  setCanvasTransform();

  for (const [x, y, radius, color] of circles) {
    if (radius) {
      drawCircle(x, y, radius, color);
    } else {
      drawPoint(x, y, color);
    }
  }

  if (currentUnfinished) {
    const [x, y, r] = currentUnfinished;
    if (r) {
      drawCircle(x, y, r, getCurrentColor());
    } else {
      drawPoint(x, y, getCurrentColor());
    }
  } else {
    drawCursor();
  }
}

function drawCircle(x: number, y: number, r: number, style = 'black') {
  c.strokeStyle = style;
  c.beginPath();
  c.ellipse(x, y, r, r, 0, 0, 7);
  c.stroke();
}

function drawPoint(x: number, y: number, style = 'black') {
  const pointRadius = POINT_RADIUS / viewParams.scale;
  c.fillStyle = style;
  c.beginPath();
  c.ellipse(x, y, pointRadius, pointRadius, 0, 0, 7);
  c.fill();
}

function clearCanvas() {
  c.save();
  c.setTransform(1, 0, 0, 1, 0, 0);
  c.clearRect(0, 0, c.canvas.width, c.canvas.height);
  c.restore();
}

function getPointForEventCoords(e: MouseEvent): Point {
  const x = ((e.offsetX / c.canvas.offsetWidth - 0.5) * c.canvas.width) / viewParams.scale;
  const y = ((e.offsetY / c.canvas.offsetHeight - 0.5) * c.canvas.height) / viewParams.scale;

  return [x - viewParams.offset[0], y - viewParams.offset[1]];
}

export function getCursorCoords(e: MouseEvent, snap = false): Point {
  const point = getPointForEventCoords(e);

  if (snap) {
    const nearest = findNearestPoint(point, circles, SNAP_DISTANCE / viewParams.scale);
    if (nearest) return nearest;
  }

  return point;
}

export function getNearestCircle(e: MouseEvent): Circle | undefined {
  const point = getPointForEventCoords(e);
  return findNearestCircle(point, circles, SNAP_DISTANCE / viewParams.scale);
}

function drawCursor() {
  if (currentCursor) drawCross(...currentCursor);
}

function drawCross(x: number, y: number) {
  c.strokeStyle = CROSS_STYLE;
  c.beginPath();
  const size = CROSS_SIZE / viewParams.scale;
  c.moveTo(x - size, y - size);
  c.lineTo(x + size, y + size);
  c.moveTo(x - size, y + size);
  c.lineTo(x + size, y - size);
  c.stroke();
}
