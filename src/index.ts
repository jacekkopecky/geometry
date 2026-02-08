window.addEventListener('load', setUp);
window.addEventListener('resize', resizeCanvas);

const canvas = document.querySelector('canvas')!;
const c = canvas.getContext('2d')!;

canvas.addEventListener('wheel', mouseZoom);
canvas.addEventListener('mousemove', mouseOver);

const viewParams = {
  scale: 80 * window.devicePixelRatio,
  offset: [0, 0] as [number, number],
};

function setUp() {
  resizeCanvas();
}

function setCanvasTransform() {
  c.resetTransform();
  c.translate(canvas.width / 2, canvas.height / 2);
  c.translate(...viewParams.offset);

  const scale = viewParams.scale;
  c.scale(scale, scale);

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
  c.beginPath();
  c.ellipse(0, 0, 1, 1, 0, 0, 7);
  c.stroke();
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
    const delta = e.deltaY < -max ? -max : e.deltaY > max ? max : e.deltaY;
    viewParams.scale *= 1 - delta * zoomSpeed;
    draw();
  }

  e.stopPropagation();
  e.preventDefault();
}

function mouseOver(e: MouseEvent) {
  const [x, y] = getCanvasCoords(e);

  draw();
  c.beginPath();
  const size = 30 / viewParams.scale;
  c.moveTo(x - size, y - size);
  c.lineTo(x + size, y + size);
  c.moveTo(x - size, y + size);
  c.lineTo(x + size, y - size);
  c.stroke();
}

function getCanvasCoords(e: MouseEvent): [number, number] {
  const x = ((e.offsetX / c.canvas.offsetWidth - 0.5) * c.canvas.width) / viewParams.scale;
  const y = ((e.offsetY / c.canvas.offsetHeight - 0.5) * c.canvas.height) / viewParams.scale;

  return [x, y];
}
