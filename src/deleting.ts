export let currentlyDeleting = false;

const deleteEl = document.querySelector('.delete')!;
deleteEl.addEventListener('click', () => toggleDelete());

export function toggleDelete(value?: boolean) {
  if (value != null) {
    currentlyDeleting = value;
  } else {
    currentlyDeleting = !currentlyDeleting;
  }
  deleteEl.classList.toggle('active', currentlyDeleting);
}
