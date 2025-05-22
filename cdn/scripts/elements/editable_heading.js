import { TextEditor } from "../editors/text_editor.js";
import { register, ELEMENT_NAMES } from "../element_registry.js";
import { CLEANABLE_ATTR } from "../interfaces/selectors.js";

export class EditableHeading extends HTMLHeadingElement { // startfold
  static elementName = "ABSTRACT_HEADING_NAME"
  static elementType =  "ABSTRACT_HEADING_TYPE"

  constructor() { // startfold
    super();
    this.editor = new TextEditor(this);
    this.setAttribute("is", this.constructor.elementName);
  } // endfold

} // endfold

export class EditableH1 extends EditableHeading {
    static elementName = ELEMENT_NAMES.editableH1;
    static elementType =  "h1";
}

export class EditableH2 extends EditableHeading {
    static elementName = ELEMENT_NAMES.editableH2;
    static elementType =  "h2";
}

export class EditableH3 extends EditableHeading {
    static elementName = ELEMENT_NAMES.editableH3;
    static elementType =  "h3";
}

export class EditableH4 extends EditableHeading {
    static elementName = ELEMENT_NAMES.editableH4;
    static elementType =  "h4";
}

export class EditableH5 extends EditableHeading {
    static elementName = ELEMENT_NAMES.editableH5;
    static elementType =  "h5";
}

export class EditableH6 extends EditableHeading {
    static elementName = ELEMENT_NAMES.editableH6;
    static elementType =  "h6";
}

register(EditableH1);
register(EditableH2);
register(EditableH3);
register(EditableH4);
register(EditableH5);
register(EditableH6);
