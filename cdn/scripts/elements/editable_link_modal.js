import { LOG } from '../utils/logger.js';

import { LinkButtonEditor } from "../editors/link_button_editor.js";
import { register, ELEMENT_NAMES } from "../element_registry.js";
import { ImageSetChanged } from "../interfaces/events.js";

export class EditableLinkModal extends HTMLDivElement { // startfold
  static elementName = ELEMENT_NAMES.editableLinkModal;
  static elementType = "div";

  constructor() { // startfold
    super();
    this.setAttribute("is", EditableLinkModal.elementName);
    this.setAttribute("onclick", "this.querySelector('dialog').showModal();");
  } // endfold

  connectedCallback() {
    try {
      this.modal = this.ensureModal();
      this.ensureClose();
    } catch (error) {
      LOG.error(`Error in connectedCallback: ${error}`);
    }
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
    let modalChild = this.querySelector("dialog");
    let closeButton = modalChild.querySelector("button");
    if (closeButton == null) {
      closeButton = document.createElement("button");
      closeButton.innerText = "X";
      modalChild.appendChild(closeButton);
    }
    closeButton.setAttribute("onclick", "this.parentElement.close(); event.stopPropagation();");
  }
} // endfold

try {
  register(EditableLinkModal);
} catch (error) {
  LOG.error(`Error registering EditableLinkModal: ${error}`);
}

export class ImageAttributionSet extends EditableLinkModal { // startfold
  static elementName = ELEMENT_NAMES.imageAttributionSet;
  static elementType = "div";

  constructor() { // startfold
    super();
    this.setAttribute("is", ImageAttributionSet.elementName);
    this.innerText = "Photo Credits";

    try {
      document.addEventListener(ImageSetChanged, () => this.render());
      this.render();
    } catch (error) {
      LOG.error(`Error in ImageAttributionSet constructor: ${error}`);
    }
  } // endfold

  render() {
    try {
      const modal = this.ensureModal();
      let modalHeader = modal.querySelector("h2");
      if (modalHeader == null) {
        modalHeader = document.createElement("h2");
        modalHeader.innerText = "Photos Via Pexels.com";
        modal.appendChild(modalHeader);
      }

      this.ensureClose();
      const pictures = document.querySelectorAll("picture");

      let photos = modal.querySelector("ul");
      if (photos == null) {
        photos = document.createElement("ul");
        modal.appendChild(photos);
      }
      photos.innerHTML = "";
      for (const pic of pictures) {
        const img = pic.querySelector("img");
        const li = document.createElement("li");

        const attr = document.createElement("a");
        attr.href = pic.dataset.attributionHref;
        attr.innerText = pic.dataset.attributionText;
        attr.target = "_blank";
        attr.rel = "noopener noreferrer";
        li.appendChild(attr);

        const alt = document.createElement("p");
        alt.innerText = img.alt;
        li.appendChild(alt);

        photos.appendChild(li);
      }
      modal.appendChild(photos);
    } catch (error) {
      LOG.error(`Error in render method: ${error}`);
    }
  }
} // endfold

try {
  register(ImageAttributionSet);
} catch (error) {
  LOG.error(`Error registering ImageAttributionSet: ${error}`);
}