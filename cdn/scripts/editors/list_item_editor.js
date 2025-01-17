import { modalBuilder } from "../modals/base.js";
import { ElementEditor } from "./element_editor.js";
import { EditableListItem } from "../elements/editable_list_item.js";

export class ListItemEditor extends ElementEditor {
    constructor(element) {
        super();
        this.element = element;

        this.upButton = this.buildUpButton();
        this.downButton = this.buildDownButton();
        this.copyButton = this.buildCopyButton();
        this.deleteButton = this.buildDeleteButton();
    }
  setEditable() { // startfold
    this.element.addEventListener("mouseover", () => {
        this.upButton.remove();
        this.element.appendChild(this.upButton);

        this.downButton.remove();
        this.element.appendChild(this.downButton);

        this.copyButton.remove();
        this.element.appendChild(this.copyButton);

        this.deleteButton.remove();
        this.element.appendChild(this.deleteButton);
    });
    this.element.addEventListener("mouseout", () => {
        this.removeButtons();
    });
  } // endfold
  removeButtons() { // startfold
    this.upButton.remove();
    this.downButton.remove();
    this.copyButton.remove();
    this.deleteButton.remove();
  } // endfold
  unsetEditable() { // startfold
  } // endfold
    buildUpButton() {  // startfold
        const btn = document.createElement("button");
        btn.innerText = "^";
        btn.classList.add("list-up-btn");
        btn.addEventListener("click", () => {
            const parentElement = this.element.parentElement;
            const siblings = Array.from(parentElement.children);
            const idx = siblings.indexOf(this.element);
            if (idx > 0) {
                this.element.remove();
                siblings[idx-1].insertAdjacentElement('beforebegin', this.element);
            }
        });
        return btn
    }  // endfold
    buildDownButton() {  // startfold
        const btn = document.createElement("button");
        btn.innerText = "v";
        btn.classList.add("list-down-btn");
        btn.addEventListener("click", () => {
            const parentElement = this.element.parentElement;
            const siblings = Array.from(parentElement.children);
            const idx = siblings.indexOf(this.element);
            if (idx < siblings.length - 1) {
                this.element.remove();
                siblings[idx+1].insertAdjacentElement('afterend', this.element);
            }
        });
        return btn
    }  // endfold
    buildCopyButton() {  // startfold
        const btn = document.createElement("button");
        btn.innerText = "+";
        btn.classList.add("list-clone-btn");
        btn.addEventListener("click", () => {
            this.removeButtons();
            const newItem = this.element.cloneNode(true);;
            this.element.after(newItem);
            newItem.editor.setEditable();
        });
        return btn
    }  // endfold
    buildDeleteButton() {  // startfold
        const btn = document.createElement("button");
        btn.innerText = "x";
        btn.classList.add("list-delete-btn");
        btn.addEventListener("click", () => {
            const modal = modalBuilder()
                .contentHTML(`<p>Are you sure you want to delete this item?</p>`)
                .setActionText('Delete')
                .actionFunc(() => {
                    this.element.remove();
                })
            modal.headerText = "Delete Item";
            modal.showMe();
        });
        return btn
    }  // endfold
}
