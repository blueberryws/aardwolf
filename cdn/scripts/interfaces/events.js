export const EditColorsEvent = "editColors";
export const SetDocumentEditable = "setDocumentEditable";
export const UnsetDocumentEditable = "unsetDocumentEditable";
export const ImageSetChanged = "imageSetChanged";

export function dispatch(eventName) {
    console.log(eventName);
    const newEvent = new CustomEvent(eventName);
    document.dispatchEvent(newEvent);
}
