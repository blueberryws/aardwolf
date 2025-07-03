import { modalBuilder } from "../modals/base.js";
import { ElementEditor } from "./element_editor.js";

export class LinkButtonEditor extends ElementEditor {
    constructor(link, button) {
        super();
        this.link = link;
        this.button = button;
        this.clickHandler = (e) => this.editLinkButton(e);
    }
  getHTMLContent() { // startfold
    return `<${this.link.elementType} is="${this.link.elementName}" href="${this.link.href || ""}"><button>${this.button.innerText}</button></${this.link.elementType}>`;
  } // endfold
  getJSONContent() { // startfold
    this.clean();
    return {
        elementType: this.element.ElementType,
        attributes: {is: this.element.elementName},
        content: this.element.innerText
    }
  } // endfold
  setEditable() { // startfold
    this.link.addEventListener("click", this.clickHandler);
  } // endfold
  unsetEditable() { // startfold
    this.link.removeEventListener("click", this.clickHandler);
  } // endfold
  clean() { // startfold
  } // endfold
  editLinkButton(e) { // startfold
    e.preventDefault();
    // e.stopPropagation();

    const modalContent = document.createElement("div");
    modalContent.classList.add("link-button-modal");

    const buttonLabel = document.createElement("label");
    buttonLabel.innerText = "Button Text:";
    modalContent.appendChild(buttonLabel);

    const buttonInput = document.createElement("input");
    buttonInput.value = this.button.innerText || "";
    modalContent.appendChild(buttonInput);

    const linkLabel = document.createElement("label");
    linkLabel.innerText = "Link Destination:";
    modalContent.appendChild(linkLabel);

    const linkInput = document.createElement("input");
    linkInput.value = this.link.href || "";
    modalContent.appendChild(linkInput);

    function updateLinkButton() {
        this.button.innerText = buttonInput.value;
        this.link.href = linkInput.value;
    }

    const modal = modalBuilder()
    modal.contentNode(modalContent)
    modal.actionFunc(updateLinkButton.bind(this));
    modal.setHeaderText("Edit Link Button");
    modal.showMe();
  } // endfold
}
