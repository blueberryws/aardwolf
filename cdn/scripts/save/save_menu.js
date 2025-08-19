import { IS_LOCAL, GET_STORE } from "../globals.js";
import { dispatch, CleanDocument, SetDocumentEditable, UnsetDocumentEditable, SetLoading, UnsetLoading } from "../interfaces/events.js";
import { CLEANABLE_SELECTOR } from "../interfaces/selectors.js";
import { register, ELEMENT_NAMES } from "../element_registry.js";
import { SaveButton } from "./save_button.js";
import { ResetButton } from "./reset_button.js";

class SaveMenuEditor {
  constructor(element) {
      this.element = element;
      this.mouseEnter = (e) => this.takeFocus(e);
      this.mouseLeave = (e) => this.removeFocus(e);
      this.touchEnd = (e) => this.takeFocus(e);
      this.element.addEventListener("mouseenter", this.mouseEnter);
      this.element.addEventListener("mouseleave", this.mouseLeave);
      this.element.addEventListener("touchend", this.touchEnd);
  }
  takeFocus(e) {
      if (!this.element.classList.contains("focus")) {
        e.stopPropagation();
        e.preventDefault();
      }
      this.element.classList.add("focus");
  }
  removeFocus() {
      this.element.classList.remove("focus");
  }
}

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
        this.editor = new SaveMenuEditor(this);
    }
}
register(SaveMenu);
