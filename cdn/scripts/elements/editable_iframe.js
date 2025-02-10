import { LOG } from '../utils/logger.js';

import { IframeEditor } from "../editors/iframe_editor.js";
import { register, ELEMENT_NAMES } from "../element_registry.js";

export class EditableIframe extends HTMLDivElement { // startfold
  static observedAttributes = ["embed"]; 
  static elementName = ELEMENT_NAMES.editableIframe;
  static elementType = "div";

  constructor() {
    super();
    try {
      this.frame = this.ensureIframe();
      this.clicker = this.ensureClicker();
      this.editor = new IframeEditor(this);
    } catch (error) {
      LOG.error("Error in EditableIframe constructor: " + error.message);
    }
  }
  ensureIframe() {
    try {
      let frame = this.querySelector("iframe");
      if (frame == null) {
        frame = document.createElement("iframe");
        this.appendChild(frame);
      }
      return frame;
    } catch (error) {
      LOG.error("Error in ensureIframe: " + error.message);
      return null; // in case of error, return null to avoid further issues
    }
  }
  ensureClicker() { // startfold
    try {
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
    } catch (error) {
      LOG.error("Error in ensureClicker: " + error.message);
      return null; // in case of error, return null to avoid further issues
    }
  } // endfold
  attributeChangedCallback(name, oldValue, newValue) {
    try {
      LOG.debug(`attributeChangedCallback triggered: ${name} changed from ${oldValue} to ${newValue}`);
      this.frame.outerHTML = newValue; 
    } catch (error) {
      LOG.error("Error in attributeChangedCallback: " + error.message);
    }
  }
} // endfold
try {
  register(EditableIframe);
} catch (error) {
  LOG.error("Error in registration: " + error.message);
}