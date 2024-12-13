import { TextEditor } from "../editors/text_editor.js";

// Data Element
export const EditableH1Name = "editable-h1";
export const EditableH2Name = "editable-h2";
export const EditableH3Name = "editable-h3";
export const EditableH4Name = "editable-h4";
export const EditableH5Name = "editable-h5";
export const EditableH6Name = "editable-h6";

export class EditableHeading extends HTMLHeadingElement { // startfold
  // This is how the component communicates with itself between edits.
  static elementName = ""
  static elementType = ""

  constructor() { // startfold
    super();
    this.editor = new TextEditor(this);
  } // endfold
} // endfold

export class EditableH1 extends EditableHeading {
    elementName = EditableH1Name;
    elementType = "h1";
}
export class EditableH2 extends EditableHeading {
    elementName = EditableH2Name;
    elementType = "h2";
}
export class EditableH3 extends EditableHeading {
    elementName = EditableH3Name;
    elementType = "h3";
}
export class EditableH4 extends EditableHeading {
    elementName = EditableH4Name;
    elementType = "h4";
}
export class EditableH5 extends EditableHeading {
    elementName = EditableH5Name;
    elementType = "h5";
}
export class EditableH6 extends EditableHeading {
    elementName = EditableH6Name;
    elementType = "h6";
}

customElements.define(EditableH1Name, EditableH1, {extends: "h1"});
customElements.define(EditableH2Name, EditableH2, {extends: "h2"});
customElements.define(EditableH3Name, EditableH3, {extends: "h3"});
customElements.define(EditableH4Name, EditableH4, {extends: "h4"});
customElements.define(EditableH5Name, EditableH5, {extends: "h5"});
customElements.define(EditableH6Name, EditableH6, {extends: "h6"});
