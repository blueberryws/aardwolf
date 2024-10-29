import { AdminModal } from "../modals/base.js";
// Data Element
export const FontStyleElementName = "font-style";
export function getFontStyle() {
    return document.querySelector(`style[is='${FontStyleElementName}']`)
}

export class FontStyle extends HTMLStyleElement { // startfold
  // This is how the component communicates with itself between edits.
  static observedAttributes = ["data-header-font", "data-body-font"];
  defaultHeaderFont = "Roboto"
  defaultBodyFont = "Arial"
  userErrorMessage = "Unable to set fonts.\nIf this persists, please contact support."
  headerFonts = {
    Arial: "local",
    Montserrat: {
        url: "/static/fonts/Montserrat/Montserrat-VariableFont_wght.ttf",
    },
    Roboto: {
        url: "/static/fonts/Roboto/Roboto-Regular.ttf",
    },
  }
  bodyFonts = {
    Arial: "local",
    Montserrat: {
        url: "/static/fonts/Montserrat/Montserrat-VariableFont_wght.ttf",
    },
    Roboto: {
        url: "/static/fonts/Roboto/Roboto-Regular.ttf",
    },
  }

  constructor() { // startfold
    super();
    this.ensureDefaults();
    this.render();
    const other = getFontStyle();
    if (other != null && other !== this) {
        throw(`There can only be ONE ${FontStyleElementName} element!`);
    }
  } // endfold
  openFontEditor() { // startfold
    const modal = new FontEditorModal();
    modal.showMe();
  } //endfold
  ensureDefaults() { // startfold
    // Create a default color palette, if one doesn't exist.
    if (this.dataset.headerFont == null) {
        this.dataset.headerFont = this.defaultHeaderFont;
    }
    if (this.dataset.bodyFont == null) {
        this.dataset.bodyFont = this.defaultBodyFont;
    }
  } // endfold
  render() { // startfold
    let headerFontFace = "";
    const headerFontInfo = this.headerFonts[this.dataset.headerFont];
    if (headerFontInfo != "local" && headerFontInfo != null) {
      headerFontFace = `
  @font-face {
    font-family: '${this.dataset.headerFont}';
    src: url('${headerFontInfo.url}');
  }
`
    }
    let bodyFontFace = "";
    const bodyFontInfo = this.bodyFonts[this.dataset.bodyFont];
    if (bodyFontInfo != "local" && bodyFontInfo != null) {
      bodyFontFace = `
  @font-face {
    font-family: '${this.dataset.bodyFont}';
    src: url('${bodyFontInfo.url}');
  }
`
    }
    this.innerHTML = `
  ${headerFontFace}
  ${bodyFontFace}
  :root {
    --header-font-family: "${this.dataset.headerFont}";
    --body-font-family: "${this.dataset.bodyFont}";
  }
`
  } // endfold
  attributeChangedCallback(name, oldValue, newValue) { // startfold
    this.render();
  } // endfold
}
customElements.define(FontStyleElementName, FontStyle, {extends: "style"});
// endfold

export class FontEditorModal extends AdminModal { // startfold
  actionText = "Update";
  headerText = "Edit Fonts";
  contentClass = "modal-content";
  connectedCallback() { // startfold
    this.fontStyle = getFontStyle();
    this.curHeaderFont = this.fontStyle.dataset.headerFont;
    this.curBodyFont = this.fontStyle.dataset.bodyFont;
    this.beforeCancel = () => {
        this.fontStyle.dataset.headerFont = this.curHeaderFont;
        this.fontStyle.dataset.bodyFont = this.curBodyFont;
    };
    this.render();
  } // endfold
  getContent() { // startfold
    const content = document.createElement("div");
    content.classList.add("modal-content");
    content.classList.add("font-modal");

    const headerLabel = document.createElement("label");
    headerLabel.innerText = "Header Font:";
    content.appendChild(headerLabel);

    const headerFontChoice = document.createElement("select");
    headerFontChoice.value = this.fontStyle.dataset.headerFont;
    // Add listener here.
    headerFontChoice.addEventListener("change", () => {
        this.fontStyle.dataset.headerFont = headerFontChoice.value;
    });
    for (const fontName in this.fontStyle.headerFonts) {
        const fontOption = document.createElement("option");
        fontOption.value = fontName;
        fontOption.innerText = fontName;
        headerFontChoice.appendChild(fontOption);
    }
    headerFontChoice.value = this.fontStyle.dataset.headerFont;
    content.appendChild(headerFontChoice);

    const bodyLabel = document.createElement("label");
    bodyLabel.innerText = "Body Font:";
    content.appendChild(bodyLabel);

    const bodyFontChoice = document.createElement("select");
    // Add listener here.
    bodyFontChoice.addEventListener("change", () => {
        this.fontStyle.dataset.bodyFont = bodyFontChoice.value;
    })
    for (const fontName in this.fontStyle.bodyFonts) {
        const fontOption = document.createElement("option");
        fontOption.value = fontName;
        fontOption.innerText = fontName;
        bodyFontChoice.appendChild(fontOption);
    }
    bodyFontChoice.value = this.fontStyle.dataset.bodyFont;
    content.appendChild(bodyFontChoice);

    return content
  } // endfold
} // endfold
customElements.define("font-editor-modal", FontEditorModal, {extends: "dialog"});

// Edit Button startfold
export const EditFontButtonName = "edit-fonts-button";
export class EditFontButton extends HTMLButtonElement {
    buttonText = "Edit Fonts";
    constructor() {
        super();
        this.innerText = this.buttonText;
        const fonts = getFontStyle();
        this.addEventListener("click", fonts.openFontEditor);
    }
}

customElements.define(EditFontButtonName, EditFontButton, {extends: "button"});
// endfold
