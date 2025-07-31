export function toggleNextPrev() {
    const nextButtons = document.querySelectorAll("section .next-button");
    const prevButtons = document.querySelectorAll("section .prev-button");
    nextButtons.forEach(btn => btn.click());
    prevButtons.forEach(btn => btn.click());
}
export function AutoResizeTextarea(textarea) {
  // Temporarily set height to 'auto' to get the true scrollHeight
  textarea.style.height = 'auto';
  // Set the height to the scrollHeight
  if (textarea.scrollHeight < 10) {
      textarea.style.height = "20px";
  } else {
      textarea.style.height = textarea.scrollHeight + 'px';
  }
}
