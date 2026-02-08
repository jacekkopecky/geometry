const canvas = document.querySelector('canvas')!;
const c = canvas.getContext('2d')!;

type Point = [x: number, y: number];
type Circle = [x: number, y: number, radius?: number];

const viewParams = {
  scale: 80 * window.devicePixelRatio,
  offset: [0, 0] as Point,
};

const circles: Circle[] = [
  [0, 0, 1],
  [0, 0],
];

let currentStartPoint: Point | undefined = undefined;
let currentEndPoint: Point | undefined = undefined;
let currentMouseStart: Point | undefined = undefined;
let currentMouseMoving = false;

function setUp() {
  resizeCanvas();
}

function setCanvasTransform() {
  c.resetTransform();
  c.translate(canvas.width / 2, canvas.height / 2);

  const scale = viewParams.scale;
  c.scale(scale, scale);
  c.translate(...viewParams.offset);

  c.lineWidth = 1 / scale;
}

function resizeCanvas() {
  canvas.width = canvas.clientWidth * window.devicePixelRatio;
  canvas.height = canvas.clientHeight * window.devicePixelRatio;

  draw();
}

function draw() {
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
  }
}

function drawCircle(x: number, y: number, r: number, style = 'black') {
  c.strokeStyle = style;
  c.beginPath();
  c.ellipse(x, y, r, r, 0, 0, 7);
  c.stroke();
}

function drawPoint(x: number, y: number, style = 'black') {
  const pointRadius = 3 / viewParams.scale;
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

function mouseZoom(e: WheelEvent) {
  const zoomSpeed = 1 / 200;
  const max = 20;

  if (e.deltaY) {
    const [oldX, oldY] = getCursorCoords(e);

    const delta = e.deltaY < -max ? -max : e.deltaY > max ? max : e.deltaY;
    viewParams.scale *= 1 - delta * zoomSpeed;

    const [newX, newY] = getCursorCoords(e);
    viewParams.offset[0] -= oldX - newX;
    viewParams.offset[1] -= oldY - newY;

    draw();
  }

  e.stopPropagation();
  e.preventDefault();
}

function mouseAddPoint(e: MouseEvent) {
  const p = getCursorCoords(e);
  if (!currentStartPoint) {
    currentStartPoint = p;
  } else if (currentEndPoint) {
    const [x, y] = currentStartPoint;
    const [x2, y2] = currentEndPoint;
    circles.push([x, y, Math.sqrt((x2 - x) ** 2 + (y2 - y) ** 2)]);
    resetCurrents();
  } else {
    // a single point added
    circles.push(p);
    resetCurrents();
  }
  draw();
}

function getCursorCoords(e: MouseEvent): Point {
  const x = ((e.offsetX / c.canvas.offsetWidth - 0.5) * c.canvas.width) / viewParams.scale;
  const y = ((e.offsetY / c.canvas.offsetHeight - 0.5) * c.canvas.height) / viewParams.scale;

  return [x - viewParams.offset[0], y - viewParams.offset[1]];
}

function mouseDown(e: MouseEvent) {
  currentMouseStart = getCursorCoords(e);
}

function mouseUp(e: MouseEvent) {
  if (currentMouseStart && !currentMouseMoving) {
    // clicked without a move
    mouseAddPoint(e);
  }
  currentMouseStart = undefined;
  currentMouseMoving = false;
}

function mouseMove(e: MouseEvent) {
  const [x, y] = getCursorCoords(e);

  if (!currentMouseStart) {
    if (currentStartPoint) {
      currentEndPoint = [x, y];
      draw();
    } else {
      // not dragging or drawing
      draw();
      c.beginPath();
      const size = 30 / viewParams.scale;
      c.moveTo(x - size, y - size);
      c.lineTo(x + size, y + size);
      c.moveTo(x - size, y + size);
      c.lineTo(x + size, y - size);
      c.stroke();
    }
  } else {
    viewParams.offset[0] += x - currentMouseStart[0];
    viewParams.offset[1] += y - currentMouseStart[1];
    draw();
    // recompute canvas coords as we've moved the offset
    currentMouseStart = getCursorCoords(e);
    currentMouseMoving = true;
  }
}

function keyDown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    resetCurrents();
    draw();
  }
}

function resetCurrents() {
  currentMouseMoving = false;
  currentMouseStart = undefined;
  currentStartPoint = undefined;
  currentEndPoint = undefined;
}

window.addEventListener('load', setUp);
window.addEventListener('resize', resizeCanvas);

canvas.addEventListener('wheel', mouseZoom);
canvas.addEventListener('mousemove', mouseMove);
canvas.addEventListener('mousedown', mouseDown);
canvas.addEventListener('mouseup', mouseUp);
document.addEventListener('keydown', keyDown);
