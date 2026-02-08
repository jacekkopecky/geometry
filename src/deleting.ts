export let currentlyDeleting = false;

const deleteEl = document.querySelector('.delete')!;
deleteEl.addEventListener('click', toggleDelete);

export function toggleDelete() {
  currentlyDeleting = !currentlyDeleting;
  deleteEl.classList.toggle('active', currentlyDeleting);
}
