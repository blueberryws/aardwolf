export const EditColorsEvent = "editColors";
export function emitEditColors() {
    const editColorsEvent = new CustomEvent(EditColorsEvent);
    document.dispatchEvent(editColorsEvent);
}
