import { LOG } from '../utils/logger.js';

import { ListItemEditor } from "../editors/list_item_editor.js";
import { register, ELEMENT_NAMES } from "../element_registry.js";

// Data Element
export class EditableListItem extends HTMLLIElement { // startfold
  static elementName = ELEMENT_NAMES.editableListItem;
  static elementType = "li";

  constructor() { // startfold
    super();
    this.setAttribute("is", EditableListItem.elementName);
  } // endfold
  connectedCallback() {
    try {
      this.editor = new ListItemEditor(this);
      LOG.info(`EditableListItem connected with editor: ${this.editor}`);
    } catch (error) {
      LOG.error(`Error in connectedCallback of EditableListItem: ${error.message}`);
    }
  }
} // endfold
try {
  register(EditableListItem);
} catch (error) {
  LOG.error(`Failed to register EditableListItem: ${error.message}`);
}