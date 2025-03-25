export function toggleNextPrev() {
    const nextButtons = document.querySelectorAll("section .next-button");
    const prevButtons = document.querySelectorAll("section .prev-button");
    nextButtons.forEach(btn => btn.click());
    prevButtons.forEach(btn => btn.click());
}
