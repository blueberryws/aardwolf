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
        this.head.getEditableChildren().forEach(child => child.remove());
        for (let child of this.metaChildren.children) {
            const selector = child.querySelector("select");
            const content = child.querySelector("input");
            if (content.value != "" && content.value != null) {
              const newMeta = document.createElement("meta");
              newMeta.name = selector.value;
              newMeta.content = content.value;
              this.head.appendChild(newMeta);
            }
        }
    };
    this.metaChildren = null;
    this.render();
  } // endfold
  makeMetaSelector(name, content) { // startfold
    const container = document.createElement("div");
    const selector = document.createElement("select");
    for (let opt of this.head.supportedNames) {
        const option = document.createElement("option");
        option.value = opt;
        option.innerText = opt;
        selector.appendChild(option);
    }
    if (name != null) {
        selector.value = name;
    }
    container.appendChild(selector);

    const input = document.createElement("input");
    input.value = content;
    container.appendChild(input);

    const removeButton = document.createElement("button");
    removeButton.innerText = "x";
    removeButton.addEventListener("click", () => {
        container.remove();
    })
    container.appendChild(removeButton);
    return container;
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

    this.metaChildren = document.createElement("div");
    for (let meta of this.head.getEditableChildren()) {
        const metaLine = this.makeMetaSelector(meta.name, meta.content);
        this.metaChildren.appendChild(metaLine);
    }
    content.appendChild(this.metaChildren);

    const addButton = document.createElement("button");
    addButton.innerText = "Add Metadata";
    addButton.addEventListener("click", () => {
        const newMeta = this.makeMetaSelector(null, "");
        this.metaChildren.appendChild(newMeta);
    });
    content.appendChild(addButton);

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
