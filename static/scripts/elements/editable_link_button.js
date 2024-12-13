import { LinkButtonEditor } from "../editors/link_button_editor.js";

// Data Element
export const EditableLinkButtonName = "editable-link-button";

export class EditableLinkButton extends HTMLAnchorElement { // startfold
  elementName = "editable-link-button";
  elementType = "a";
  buttonDefault = "GO";

  constructor() { // startfold
    super();
    this.ensureButton()
    this.editor = new LinkButtonEditor(this, this.button);
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

customElements.define(EditableLinkButtonName, EditableLinkButton, {extends: "a"});
