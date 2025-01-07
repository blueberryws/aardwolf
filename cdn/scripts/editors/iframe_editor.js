import { modalBuilder } from "../modals/base.js";
import { ElementEditor } from "./element_editor.js";

export class IframeEditor extends ElementEditor { // startfold
  constructor(editableIframe) {
    super();
    this.editableIframe = editableIframe;
    this.openModal = (e) => this.editIframe(e);
    this.editableIframe.clicker.addEventListener("click", this.openModal);
  }
  setEditable() {
    this.editableIframe.clicker.style.display = "block";
  }
  unsetEditable() {
    this.editableIframe.clicker.style.display = "none";
  }
  editIframe(e) {
    e.preventDefault();
    // e.stopPropagation();

    const modalContent = document.createElement("div");

    const embedLabel = document.createElement("label");
    embedLabel.innerText = "Embed Code:";
    modalContent.appendChild(embedLabel);

    const embedInput = document.createElement("textarea");
    embedInput.value = this.editableIframe.frame.innerHTML || "";
    modalContent.appendChild(embedInput);

    function updateIframe() {
        this.editableIframe.setAttribute("embed", embedInput.value);
    }

    const modal = modalBuilder()
    modal.contentNode(modalContent)
    modal.actionFunc(updateIframe.bind(this));
    modal.showMe();
  }
} // endfold
