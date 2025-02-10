import { LOG } from '../utils/logger.js';

import { EditableSectionEditor } from "../editors/section_editor.js";

export class EditableSection extends HTMLElement { // startfold
  static elementType = "section";

  static elementName = "ABSTRACT_SECTION_BASE";
  static sectionName = "ABSTRACT_SECTION_BASE";

  classes = []
  // defaultContent = [] // This is abstract. Implement in childs!

  constructor() { // startfold
    super();
    try {
      this.editor = new EditableSectionEditor(this);
      this.setAttribute("is", this.constructor.elementName);
      LOG.info("EditableSection constructed successfully.");
    } catch (error) {
      LOG.error("Error during EditableSection construction: " + error.message);
    }
  } // endfold
}