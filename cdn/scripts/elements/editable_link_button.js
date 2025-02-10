import { LOG } from '../utils/logger.js';

import { LinkButtonEditor } from "../editors/link_button_editor.js";
import { register, ELEMENT_NAMES } from "../element_registry.js";

export class EditableLinkButton extends HTMLAnchorElement { // startfold
  static elementName = ELEMENT_NAMES.editableLinkButton;
  static elementType = "a";
  buttonDefault = "GO";

  constructor() { // startfold
    super();
    try {
      this.ensureButton();
      this.editor = new LinkButtonEditor(this, this.button);
      this.setAttribute("is", EditableLinkButton.elementName);
    } catch (error) {
      LOG.error("Error during EditableLinkButton construction: " + error.message);
    }
  } // endfold

  ensureButton() {
    try {
      this.button = this.querySelector("button");
      if (this.button == null) {
        this.button = document.createElement("button");
        this.appendChild(this.button);
        this.button.innerText = this.buttonDefault;
        LOG.debug("Button created and added to EditableLinkButton.");
      } else {
        LOG.info("Button already exists in EditableLinkButton.");
      }
    } catch (error) {
      LOG.error("Error in ensureButton: " + error.message);
    }
  }
} // endfold

try {
  register(EditableLinkButton);
} catch (error) {
  LOG.error("Error registering EditableLinkButton: " + error.message);
}