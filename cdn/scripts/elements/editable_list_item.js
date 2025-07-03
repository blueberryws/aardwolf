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
    this.editor = new ListItemEditor(this);
  }
} // endfold
register(EditableListItem);
