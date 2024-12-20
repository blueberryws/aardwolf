import { SetDocumentEditable, UnsetDocumentEditable } from "../interfaces/events.js";
export class ElementEditor {
    constructor() {
        document.addEventListener(SetDocumentEditable, () => this.setEditable());
        document.addEventListener(UnsetDocumentEditable, () => this.unsetEditable());
    }
    clean() {}
    setEditable() {}
    unsetEditable() {}
}
