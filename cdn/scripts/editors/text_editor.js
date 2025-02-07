import { ElementEditor } from "./element_editor.js";

export class TextEditor extends ElementEditor {
    constructor(element) {
        super();
        this.element = element;
        this.element.addEventListener("focusout", () => this.clean());
    }
  getHTMLContent() { // startfold
    this.clean();
    return `<${this.element.elementType} is="${this.element.elementName}">${this.element.innerText}</${this.element.elementType}>`;
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
    this.element.contentEditable = true 
  } // endfold
  unsetEditable() { // startfold
    console.log("unset editable called");
    this.element.removeAttribute("contentEditable");
  } // endfold
    clean() { // startfold
        const text = this.element.innerText.replaceAll("\n", "<br>");
        this.element.innerHTML = text;
    } // endfold
}
