import { IS_LOCAL, GET_STORE } from "../globals.js";
import { dispatch, CleanDocument, SetDocumentEditable, UnsetDocumentEditable, SetLoading, UnsetLoading } from "../interfaces/events.js";
import { CLEANABLE_SELECTOR } from "../interfaces/selectors.js";
import { register, ELEMENT_NAMES } from "../element_registry.js";
import { SaveButton } from "./save_button.js";
import { ResetButton } from "./reset_button.js";


export class SaveMenu extends HTMLElement {
  static elementName = "save-menu";

    constructor() {
        super();
        this.store = GET_STORE();
        this.saveButton = new SaveButton();
        this.resetButton = new ResetButton();
        this.label = document.createElement("label");
        this.label.innerText = "💾";
        this.appendChild(this.label);
        this.appendChild(this.saveButton);
        if (IS_LOCAL()) {
            this.appendChild(this.resetButton);
        }
    }
}
register(SaveMenu);
