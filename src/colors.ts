const colorsEl = document.querySelector<HTMLElement>('.color .box')!;

const COLORS = ['black', 'red', 'blue', 'green'];

let currentColorIndex = 1;

export function getCurrentColor() {
  return COLORS[currentColorIndex]!;
}

export function nextColor() {
  currentColorIndex = (currentColorIndex + 1) % COLORS.length;
  updateColorIndicator();
}

function updateColorIndicator() {
  colorsEl.style.backgroundColor = getCurrentColor();
}

window.addEventListener('load', updateColorIndicator);
