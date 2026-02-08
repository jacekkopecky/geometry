const colorsEl = document.querySelector('.color .box');
const COLORS = ['black', 'red', '#47f', '#0b0'];
let currentColorIndex = 1;
export function getCurrentColor() {
    return COLORS[currentColorIndex];
}
export function nextColor() {
    currentColorIndex = (currentColorIndex + 1) % COLORS.length;
    updateColorIndicator();
}
function updateColorIndicator() {
    colorsEl.style.backgroundColor = getCurrentColor();
}
window.addEventListener('load', updateColorIndicator);
//# sourceMappingURL=colors.js.map