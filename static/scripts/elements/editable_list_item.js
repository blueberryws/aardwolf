import { ListItemEditor } from "../editors/list_item_editor.js";

// Data Element
export const EditableListItemName = "editable-list-item";

export class EditableListItem extends HTMLLIElement { // startfold
  elementName = "editable-list-item";
  elementType = "li";

  constructor() { // startfold
    super();
  } // endfold
  connectedCallback() {
    this.editor = new ListItemEditor(this);
  }
} // endfold

customElements.define(EditableListItemName, EditableListItem, {extends: "li"});
