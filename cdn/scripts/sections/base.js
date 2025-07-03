import { EditableSectionEditor } from "../editors/section_editor.js";


export class EditableSection extends HTMLElement { // startfold
  static elementType = "section";

  static elementName = "ABSTRACT_SECTION_BASE";
  static sectionName = "ABSTRACT_SECTION_BASE";

  classes = []
  // defaultContent = [] // This is abstract. Implement in childs!

  constructor() { // startfold
    super();
    this.editor = new EditableSectionEditor(this);
    this.setAttribute("is", this.constructor.elementName);
  } // endfold
}
