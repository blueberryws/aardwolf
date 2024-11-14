import { TextEditor } from "../editors/text_editor.js";

// Data Element
export const EditableParagraphName = "editable-paragraph";

export class EditableParagraph extends HTMLParagraphElement { // startfold
  // This is how the component communicates with itself between edits.
  elementName = "editable-paragraph"
  elementType = "p"

  constructor() { // startfold
    super();
    this.editor = new TextEditor(this);
  } // endfold
} // endfold

customElements.define(EditableParagraphName, EditableParagraph, {extends: "p"});
