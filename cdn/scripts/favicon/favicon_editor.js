import { AdminModal } from "../modals/base.js";
import { CLEANABLE_ATTR } from "../interfaces/selectors.js";
import { LOGO_SAVE } from "../urls.js";
// Data Element
export const EditableFaviconName = "editable-favicon";

export function getEditableFavicon() {
    let favicon = document.querySelector(`link[rel='icon']`);
    if (favicon == null) {
        const head = document.querySelector("head");
        favicon = new EditableFavicon();
        head.appendChild(favicon);
    }
    return favicon
}

export class FaviconEditor { // startfold
    constructor(element) { // startfold 
        this.element = element;
    } // endfold
    clean() { // startfold
        if (this.element.tmpHref) {
            this.element.href = this.element.tmpHref;
        }
    } // endfold
    setHref(href) { // startfold
        // upload
        const siteId = document.documentElement.dataset.siteId;
        fetch(LOGO_SAVE, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                siteId: siteId,
                logoSrc: href,
            }),
        }).then(
            r => r.json()
        ).then(
            (r) => {
                this.element.tmpHref = r.src;
            }
        );
        // store result in tmp
        this.element.href = href;
    } // endfold
} // endfold

export class EditableFavicon extends HTMLLinkElement { // startfold
  constructor() { // startfold
    super();
    this.editor = new FaviconEditor(this);
    this.setAttribute("rel", "icon");
    this.setAttribute(`data-${CLEANABLE_ATTR}`, true);
  } // endfold
} // endfold
customElements.define("editable-favicon", EditableFavicon, {extends: "link"});


export class FaviconEditorModal extends AdminModal { // startfold
  actionText = "Update";
  headerText = "Edit Favicon";
  contentClass = "modal-content";
  connectedCallback() { // startfold
    this.classList.add("favicon-modal");
    this.favicon = getEditableFavicon();
    this.href = this.favicon.href;

    this.imgPreview = document.createElement("img");
    this.imgPreview.src = this.href;
    this.beforeAction = () => {
        this.favicon.editor.setHref(this.href);
    };
    this.render();
  } // endfold
  getInstructions() { // startfold
    const instructions = document.createElement("details");
    instructions.innerHTML = `
    <summary>What is a favicon?</summary>
    <p>The favicon is a little round image is the "site icon" for your website. Your browser will put it in your tab, and search engines will also display it in search results.</p>
    <img src="/cdn/images/favicon_example.png" />
    <img src="/cdn/images/favicon_example_2.png" />
    <p>Make sure that the image you upload is a square. The system will optimize it to a 16x16 .ico file.</p>
`
    return instructions;
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
