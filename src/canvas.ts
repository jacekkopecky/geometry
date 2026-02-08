import { findNearestPoint } from './nearest.js';
import { circles, currentCursor, currentEndPoint, currentStartPoint, viewParams } from './state.js';
import type { Point } from './types.js';

export const canvas = document.querySelector('canvas')!;
const c = canvas.getContext('2d')!;

const CROSS_STYLE = 'black';
const CROSS_SIZE = 30;
const POINT_RADIUS = 4;
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

  c.lineWidth = 1 / scale;
}

export function draw() {
  clearCanvas();
  setCanvasTransform();

  for (const [x, y, radius] of circles) {
    if (radius) {
      drawCircle(x, y, radius);
    } else {
      drawPoint(x, y);
    }
  }

  if (currentStartPoint) {
    const [x, y] = currentStartPoint;
    if (currentEndPoint) {
      const r = Math.sqrt((x - currentEndPoint[0]) ** 2 + (y - currentEndPoint[1]) ** 2);
      drawCircle(x, y, r, 'red');
    } else {
      drawPoint(x, y, 'red');
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

export function getCursorCoords(e: MouseEvent, snap = false): Point {
  const x = ((e.offsetX / c.canvas.offsetWidth - 0.5) * c.canvas.width) / viewParams.scale;
  const y = ((e.offsetY / c.canvas.offsetHeight - 0.5) * c.canvas.height) / viewParams.scale;

  const point: Point = [x - viewParams.offset[0], y - viewParams.offset[1]];

  if (snap) {
    const nearest = findNearestPoint(point, circles, SNAP_DISTANCE / viewParams.scale);
    if (nearest) return nearest;
  }

  return point;
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
