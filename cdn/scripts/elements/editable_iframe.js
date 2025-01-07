import { IframeEditor } from "../editors/iframe_editor.js";
import { register, ELEMENT_NAMES } from "../element_registry.js";

export class EditableIframe extends HTMLDivElement { // startfold
  static observedAttributes = ["embed"]; 
  static elementName = ELEMENT_NAMES.editableIframe;
  static elementType = "div";

  constructor() {
    super();
    this.frame = this.ensureIframe();
    this.clicker = this.ensureClicker();
    this.editor = new IframeEditor(this);
  }
  ensureIframe() {
    let frame = this.querySelector("iframe");
    if (frame == null) {
      frame = document.createElement("iframe");
      this.appendChild(frame);
    }
    return frame;
  }
  ensureClicker() { // startfold
    let clicker = this.querySelector("div");
    if (clicker == null) {
      clicker = document.createElement("div");
      clicker.style.position = "absolute";
      clicker.style.top = "0";
      clicker.style.left = "0";
      clicker.style.width = "100%";
      clicker.style.height = "100%";
      clicker.style["min-width"] = "100px";
      clicker.style["min-height"] = "100px";
      clicker.style["z-index"] = "10";
      clicker.style.display = "none";
      this.appendChild(clicker);
    }
    return clicker;
  } // endfold
  attributeChangedCallback(name, oldValue, newValue) {
    console.log(newValue);
    this.frame.outerHTML = newValue; 
  }
} // endfold
register(EditableIframe);
