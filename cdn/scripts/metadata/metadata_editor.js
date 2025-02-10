import { LOG } from '../utils/logger.js';

import { AdminModal } from "../modals/base.js";
import { fromHTML } from "../utils/html.js";

// Data Element
export const EditableHeadName = "editable-head";
export function getEditableHead() {
    const head = document.querySelector(`head[is='${EditableHeadName}']`);
    if (!head) {
        LOG.error("EditableHead not found in the document.");
    }
    return head;
}

export class EditableHead extends HTMLHeadElement { // startfold
  userErrorMessage = "Unable to save metadata.\nIf this persists, please contact support.";
  supportedNames = [
    "rating",
    "google-site-verification",
    "robots",
    "google",
    "googlebot",
  ];

  constructor() { // startfold
    super();
    [this.siteTitle, this.description] = this.ensureDefaults();

    const other = getEditableHead();
    if (other != null && other !== this) {
        LOG.fatal(`There can only be ONE ${EditableHeadName} element!`);
        throw new Error(`There can only be ONE ${EditableHeadName} element!`);
    }
  } // endfold
  
  openHeaditor() { // startfold
    const modal = new HeadEditorModal();
    modal.showMe();
  } // endfold
  
  ensureDefaults() { // startfold
    let title = this.querySelector("title");
    let description = this.querySelector("meta[name='description']");
    
    if (title == null) {
        title = document.createElement("title");
        this.appendChild(title);
        LOG.debug("Created a new title element.");
    }
    
    if (description == null) {
        description = document.createElement("meta");
        description.name = "description";
        this.appendChild(description);
        LOG.debug("Created a new meta description element.");
    }
    
    return [title, description];
  } // endfold
  
  getEditableChildren() { // startfold
    let editableChildren = [];
    for (const child of this.children) {
        if (
            child.name != null
            && this.supportedNames.includes(child.name)
        ) {
            editableChildren.push(child);
        }
    }
    LOG.info(`Found ${editableChildren.length} editable children.`);
    return editableChildren;
  } // endfold
}

customElements.define(EditableHeadName, EditableHead, {extends: "head"});
// endfold

export class HeadEditorModal extends AdminModal { // startfold
  actionText = "Update";
  headerText = "SEO and Metadata";
  contentClass = "modal-content";

  connectedCallback() { // startfold
    try {
        this.head = getEditableHead();
        this.document = document.documentElement;
        this.beforeAction = () => {
            try {
                this.head.siteTitle.innerText = this.titleText.value; 
                this.head.description.content = this.descriptionText.value;
                this.document.lang = this.languageSelector.value;
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
                LOG.info("Metadata successfully updated.");
            } catch (error) {
                LOG.error("Error while updating metadata: " + error.message);
            }
        };
        this.metaChildren = null;
        this.render();
    } catch (error) {
        LOG.error("Error in connectedCallback: " + error.message);
    }
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
        LOG.info("Metadata input removed.");
    });
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

    const languageLabel = document.createElement("label");
    languageLabel.innerText = "Language:";
    content.appendChild(languageLabel);

    this.languageSelector = document.createElement("select");
    this.languageSelector.appendChild(fromHTML("<option value='en'>English</option>"));
    this.languageSelector.appendChild(fromHTML("<option value='es'>Spanish</option>"));
    this.languageSelector.value = this.document.lang || 'en';
    content.appendChild(this.languageSelector);

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
        LOG.info("New metadata input added.");
    });
    content.appendChild(addButton);

    return content;
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
        this.addEventListener("click", () => {
            try {
                fonts.openHeaditor();
                LOG.info("Opened head editor.");
            } catch (error) {
                LOG.error("Error opening head editor: " + error.message);
            }
        });
    }
}

customElements.define(EditHeadButtonName, EditHeadButton, {extends: "button"});
// endfold