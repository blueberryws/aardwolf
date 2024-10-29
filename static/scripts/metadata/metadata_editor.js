import { AdminModal } from "../modals/base.js";
// Data Element
export const EditableHeadName = "editable-head";
export function getEditableHead() {
    return document.querySelector(`head[is='${EditableHeadName}']`)
}

export class EditableHead extends HTMLHeadElement { // startfold
  // This is how the component communicates with itself between edits.
  userErrorMessage = "Unable to save metadata.\nIf this persists, please contact support."
  supportedNames = [
    "rating",
    "google-site-verification",
    "robots",
    "google",
    "googlebot",
  ]

  constructor() { // startfold
    super();
    [this.siteTitle, this.description] = this.ensureDefaults();
    const other = getEditableHead();
    if (other != null && other !== this) {
        throw(`There can only be ONE ${EditableHeadName} element!`);
    }
  } // endfold
  openHeaditor() { // startfold
    const modal = new HeadEditorModal();
    modal.showMe();
  } //endfold
  ensureDefaults() { // startfold
    let title = this.querySelector("title");
    let description = this.querySelector("meta[name='description']");
    if (title == null) {
        title = document.createElement("title");
        this.appendChild(title);
    }
    if (description == null) {
        description = document.createElement("meta");
        description.name = "description";
        this.appendChild(description);
    }
    return [title, description]
  } // endfold
  getEditableChildren() { // startfold
    let editableChildren = [];
    for (const child of this.children) {
        if (
            child.name != null
            && this.supportedNames.includes(child.name)
        ) {
            editableChildren.push(child)
        }
    }
    return editableChildren
  } // endfold
}
customElements.define(EditableHeadName, EditableHead, {extends: "head"});
// endfold

export class HeadEditorModal extends AdminModal { // startfold
  actionText = "Update";
  headerText = "SEO and Metadata";
  contentClass = "modal-content";
  connectedCallback() { // startfold
    this.head = getEditableHead();
    this.beforeAction = () => {
        this.head.siteTitle.innerText = this.titleText.value; 
        this.head.description.content = this.descriptionText.value;
    };
    this.render();
  } // endfold
  getContent() { // startfold
    const content = document.createElement("div");
    content.classList.add(this.contentClass);
    content.classList.add("metadata-modal");

    const titleLabel = document.createElement("label");
    titleLabel.innerText = "Title:";
    content.appendChild(titleLabel);

    this.titleText = document.createElement("input");
    this.titleText.type = "text";
    this.titleText.value = this.head.siteTitle.innerText || "";
    content.appendChild(this.titleText);

    const descriptionLabel = document.createElement("label");
    descriptionLabel.innerText = "Site Description:";
    content.appendChild(descriptionLabel);

    this.descriptionText = document.createElement("input");
    this.descriptionText.type = "text";
    this.descriptionText.value = this.head.description.content || "";
    content.appendChild(this.descriptionText);

    return content
  } // endfold
} // endfold
customElements.define("head-editor-modal", HeadEditorModal, {extends: "dialog"});

// Edit Button startfold
export const EditHeadButtonName = "edit-head-button";
export class EditHeadButton extends HTMLButtonElement {
    buttonText = "SEO and Metadata";
    constructor() {
        super();
        this.innerText = this.buttonText;
        const fonts = getEditableHead();
        this.addEventListener("click", fonts.openHeaditor);
    }
}

customElements.define(EditHeadButtonName, EditHeadButton, {extends: "button"});
// endfold
