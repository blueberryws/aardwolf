import { TextEditor } from "../editors/text_editor.js";
import { register, ELEMENT_NAMES } from "../element_registry.js";

export class EditableParagraph extends HTMLParagraphElement { // startfold
  static elementName = ELEMENT_NAMES.editableParagraph;
  static elementType = "p"

  constructor() { // startfold
    super();
    this.editor = new TextEditor(this);
    this.setAttribute("is", EditableParagraph.elementName);
  } // endfold
} // endfold

register(EditableParagraph);
