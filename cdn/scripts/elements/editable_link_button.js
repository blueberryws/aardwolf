import { LinkButtonEditor } from "../editors/link_button_editor.js";
import { register, ELEMENT_NAMES } from "../element_registry.js";

export class EditableLinkButton extends HTMLAnchorElement { // startfold
  static elementName = ELEMENT_NAMES.editableLinkButton;
  static elementType = "a";
  buttonDefault = "GO";

  constructor() { // startfold
    super();
    this.ensureButton()
    this.editor = new LinkButtonEditor(this, this.button);
    this.setAttribute("is", EditableLinkButton.elementName);
  } // endfold
  ensureButton() {
    this.button = this.querySelector("button");
    if (this.button == null) {
        this.button = document.createElement("button");
        this.appendChild(this.button);
        this.button.innerText = this.buttonDefault;
    }
  }
} // endfold
register(EditableLinkButton);
