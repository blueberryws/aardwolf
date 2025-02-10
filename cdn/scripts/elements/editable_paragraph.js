import { LOG } from '../utils/logger.js';

import { TextEditor } from "../editors/text_editor.js";
import { register, ELEMENT_NAMES } from "../element_registry.js";

export class EditableBlockquote extends HTMLQuoteElement { // startfold
  static elementName = ELEMENT_NAMES.editableBlockquote;
  static elementType = "blockquote"

  constructor() { // startfold
    super();
    try {
      this.editor = new TextEditor(this);
      this.setAttribute("is", EditableBlockquote.elementName);
    } catch (error) {
      LOG.error(`Error initializing EditableBlockquote: ${error.message}`);
    }
  } // endfold
} // endfold
try {
  register(EditableBlockquote);
} catch (error) {
  LOG.error(`Error registering EditableBlockquote: ${error.message}`);
}

export class EditableFigcaption extends HTMLElement { // startfold
  static elementName = ELEMENT_NAMES.editableFigcaption;
  static elementType = "figcaption"

  constructor() { // startfold
    super();
    try {
      this.editor = new TextEditor(this);
      this.setAttribute("is", EditableFigcaption.elementName);
    } catch (error) {
      LOG.error(`Error initializing EditableFigcaption: ${error.message}`);
    }
  } // endfold
} // endfold
try {
  register(EditableFigcaption);
} catch (error) {
  LOG.error(`Error registering EditableFigcaption: ${error.message}`);
}

export class EditableParagraph extends HTMLParagraphElement { // startfold
  static elementName = ELEMENT_NAMES.editableParagraph;
  static elementType = "p"

  constructor() { // startfold
    super();
    try {
      this.editor = new TextEditor(this);
      this.setAttribute("is", EditableParagraph.elementName);
    } catch (error) {
      LOG.error(`Error initializing EditableParagraph: ${error.message}`);
    }
  } // endfold
} // endfold

try {
  register(EditableParagraph);
} catch (error) {
  LOG.error(`Error registering EditableParagraph: ${error.message}`);
}