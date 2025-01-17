import { LinkButtonEditor } from "../editors/link_button_editor.js";
import { register, ELEMENT_NAMES } from "../element_registry.js";

export class EditableLinkModal extends HTMLAnchorElement { // startfold
  static elementName = ELEMENT_NAMES.editableLinkModal;
  static elementType = "a";

  constructor() { // startfold
    super();
    this.setAttribute("is", EditableLinkModal.elementName);
    this.openModal = (e) => this._openModal(e);
    this.closeModal = (e) => this._closeModal(e);
    this.addEventListener("click", this.openModal); 
    this.ensureModal();
  } // endfold
  _openModal(e) {
    this.querySelector("dialog").showModal();
    this.ensureClose();
  }
  _closeModal(e) {
    this.querySelector("dialog").close();
    e.stopPropagation();
  }
  ensureModal() {
    let modalChild = this.querySelector("dialog");
    if (modalChild == null) {
        modalChild = document.createElement("dialog");
        this.appendChild(modalChild);
    }
    return modalChild;
  }
  ensureClose() {
    const modalChild = this.querySelector("dialog");
    let closeButton = modalChild.querySelector("button");
    if (closeButton == null) {
        closeButton = document.createElement("button");
        closeButton.innerText = "X";
        modalChild.appendChild(closeButton);
    }
    closeButton.addEventListener("click", this.closeModal);
  }
} // endfold
register(EditableLinkModal);
