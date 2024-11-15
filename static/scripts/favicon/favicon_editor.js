import { AdminModal } from "../modals/base.js";
// Data Element
export const EditableFaviconName = "editable-favicon";
export function getEditableFavicon() {
    const favicon = document.querySelector(`link[rel='icon']`);
    return favicon
}

export class FaviconEditorModal extends AdminModal { // startfold
  actionText = "Update";
  headerText = "Edit Site Icon";
  contentClass = "modal-content";
  connectedCallback() { // startfold
    this.favicon = getEditableFavicon();
    this.href = this.favicon.href;

    this.imgPreview = document.createElement("img");
    this.imgPreview.src = this.href;
    this.beforeAction = () => {
        this.favicon.href = this.href;
    };
    this.render();
  } // endfold
  getContent() { // startfold
    const content = document.createElement("div");

    content.appendChild(this.imgPreview);

    const form = document.createElement("form");
    const iconInput = document.createElement("input");
    iconInput.type = "file";
    iconInput.addEventListener("change", (e) => {
       var file    = e.target.files[0];
       var reader  = new FileReader();
     
       reader.addEventListener("loadend", () => {
         this.href = reader.result;
         this.imgPreview.src = this.href;
       })
     
       if (file) {
         reader.readAsDataURL(file);
       }
    })
    form.appendChild(iconInput);
    content.appendChild(form);
    return content
  } // endfold
} // endfold
customElements.define("favicon-editor-modal", FaviconEditorModal, {extends: "dialog"});

// Edit Button startfold
export const EditFaviconButtonName = "edit-favicon-button";
export class EditFaviconButton extends HTMLButtonElement {
    buttonText = "Site Icon";
    constructor() {
        super();
        this.innerText = this.buttonText;
        this.addEventListener("click", () => {
            const modal = new FaviconEditorModal();
            modal.showMe();
        });
    }
}

customElements.define(EditFaviconButtonName, EditFaviconButton, {extends: "button"});
// endfold
