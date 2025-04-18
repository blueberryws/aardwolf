import { ElementEditor } from "./element_editor.js";

export class TextEditor extends ElementEditor {
    constructor(element) {
        super();
        this.element = element;
        this.element.addEventListener("focusout", () => this.clean());
        this.element.addEventListener("paste", function(e) {
            // cancel paste
            e.preventDefault();
        
            // get text representation of clipboard
            var text = (e.originalEvent || e).clipboardData.getData('text/plain');
        
            // insert text manually
            document.execCommand("insertHTML", false, text);
        });
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
        if (this.element.innerHTML.replace(/\s+/g, '') == "") {
            this.element.innerHTML = "";
        } else {
            this.element.innerHTML = this.element.innerHTML.replaceAll("\n", "<br>");
        }
    } // endfold
}
