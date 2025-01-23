import { TextEditor } from "../editors/text_editor.js";
import { register, ELEMENT_NAMES } from "../element_registry.js";

export class EditableBlockquote extends HTMLQuoteElement { // startfold
  static elementName = ELEMENT_NAMES.editableBlockquote;
  static elementType = "blockquote"

  constructor() { // startfold
    super();
    this.editor = new TextEditor(this);
    this.setAttribute("is", EditableBlockquote.elementName);
  } // endfold
} // endfold
register(EditableBlockquote);

export class EditableFigcaption extends HTMLElement { // startfold
  static elementName = ELEMENT_NAMES.editableFigcaption;
  static elementType = "figcaption"

  constructor() { // startfold
    super();
    this.editor = new TextEditor(this);
    this.setAttribute("is", EditableFigcaption.elementName);
  } // endfold
} // endfold
register(EditableFigcaption);

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
