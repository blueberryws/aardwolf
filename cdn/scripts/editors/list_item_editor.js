import { modalBuilder } from "../modals/base.js";
import { ElementEditor } from "./element_editor.js";
import { EditableListItem } from "../elements/editable_list_item.js";
import { SetDocumentEditable, UnsetDocumentEditable, dispatch } from "../interfaces/events.js";
import { toggleNextPrev } from "../utils/interactions.js";

export class ListItemEditor extends ElementEditor {
    constructor(element) {
        super();
        this.element = element;

        this.upButton = this.buildUpButton();
        this.downButton = this.buildDownButton();
        this.copyButton = this.buildCopyButton();
        this.deleteButton = this.buildDeleteButton();

        this.enterListener = (e) => this.takeFocus(e);
        this.leaveListener = () => this.removeButtons();
    }
    takeFocus(e) { // startfold
        console.log(this.scrolled);
        if (this.scrolled == true) {
            this.scrolled = false;
            return
        }
        if (e != null) {
            e.stopPropagation();
        }
        const otherSelected = document.querySelectorAll(".focus");
        otherSelected.forEach(el => {
            el.editor.removeFocus();
        });
        this.element.classList.add("focus");
        this.upButton.remove();
        this.element.appendChild(this.upButton);

        this.downButton.remove();
        this.element.appendChild(this.downButton);

        this.copyButton.remove();
        this.element.appendChild(this.copyButton);

        this.deleteButton.remove();
        this.element.appendChild(this.deleteButton);
    } // endfold
    removeFocus() { // startfold
        this.removeButtons();
        this.element.classList.remove("focus");
    } // endfold
  setEditable() { // startfold
    this.element.addEventListener("mouseenter", this.enterListener);
    this.element.addEventListener("mouseleave", this.leaveListener); 
    this.element.addEventListener("touchend", this.enterListener);
  } // endfold
  removeButtons() { // startfold
    console.log("called remove buttons");
    this.upButton.remove();
    this.downButton.remove();
    this.copyButton.remove();
    this.deleteButton.remove();
  } // endfold
  unsetEditable() { // startfold
    this.element.removeEventListener("mouseenter", this.enterListener);
    this.element.removeEventListener("mouseleave", this.leaveListener); 
    this.element.removeEventListener("touchend", this.enterListener);
    this.removeButtons();
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
            dispatch(UnsetDocumentEditable);
            const newItem = this.element.cloneNode(true);
            this.element.after(newItem);
            newItem.editor.removeButtons();
            const newPictures = newItem.querySelectorAll("picture");
            for (const pic of newPictures) {
              pic.editor.newId();   
            }
            dispatch(SetDocumentEditable);
            toggleNextPrev();
        });
        return btn
    }  // endfold
    buildDeleteButton() {  // startfold
        const btn = document.createElement("button");
        btn.innerText = "x";
        btn.classList.add("list-delete-btn");
        btn.addEventListener("click", (e) => {
            const itemsList = e.target.closest("ul");
            const itemCount = itemsList.querySelectorAll("li").length;
            if (itemCount <= 1) {
                return
            }
            const modal = modalBuilder()
                .contentHTML(`<p>Are you sure you want to delete this item?</p>`)
                .setActionText('Delete')
                .actionFunc(() => {
                    this.element.remove();
                    toggleNextPrev();
                })
            modal.headerText = "Delete Item";
            modal.showMe();
        });
        return btn
    }  // endfold
}
