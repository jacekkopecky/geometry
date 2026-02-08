import { canvas } from './canvas.js';

export let currentlyDeleting = false;

const deleteEl = document.querySelector('.delete')!;
deleteEl.addEventListener('click', toggleDelete);

export function toggleDelete() {
  currentlyDeleting = !currentlyDeleting;
  deleteEl.classList.toggle('active', currentlyDeleting);
  canvas.classList.toggle('deleting', currentlyDeleting);
}
