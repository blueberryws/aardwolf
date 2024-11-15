import { modalBuilder } from "../modals/base.js";
import { ElementEditor } from "./element_editor.js";
import { makeHero } from "../sections/hero.js";
import { dispatch, SetDocumentEditable } from "../interfaces/events.js";

export const SECTION_CHOICES = {
    "hero": makeHero,
}

export class EditableSectionEditor extends ElementEditor {
    constructor(element) {
        super();
        this.element = element;

        this.addButton = this.buildAddButton();
        this.deleteButton = this.buildDeleteButton();
        this.upButton = this.buildUpButton();
        this.downButton = this.buildDownButton();
        this.deleteButton = this.buildDeleteButton();

        this.nextButton = this.buildNextClass();
        this.prevButton = this.buildPrevClass();
    }
  setEditable() { // startfold
    this.element.addEventListener("mouseover", () => {
        this.addButton.remove();
        this.element.appendChild(this.addButton);
        this.deleteButton.remove();
        this.element.appendChild(this.deleteButton);
        this.upButton.remove();
        this.element.appendChild(this.upButton);

        this.downButton.remove();
        this.element.appendChild(this.downButton);
        this.nextButton.remove();
        this.element.appendChild(this.nextButton);
        this.prevButton.remove();
        this.element.appendChild(this.prevButton);
    });
    this.element.addEventListener("mouseout", () => {
        this.addButton.remove();
        this.deleteButton.remove();
        this.upButton.remove();
        this.downButton.remove();
        this.nextButton.remove();
        this.prevButton.remove();
    });
  } // endfold
  unsetEditable() { // startfold
        this.addButton.remove();
        this.deleteButton.remove();
        this.upButton.remove();
        this.downButton.remove();
        this.nextButton.remove();
        this.prevButton.remove();
  } // endfold
    buildAddButton() {  // startfold
        const btn = document.createElement("button");
        btn.innerText = "+";
        btn.classList.add("section-add-btn");
        btn.addEventListener("click", () => this.showAddSection());
        return btn
    }  // endfold
    buildDeleteButton() {  // startfold
        const btn = document.createElement("button");
        btn.innerText = "x";
        btn.classList.add("section-delete-btn");
        btn.addEventListener("click", () => {
            const modal = modalBuilder()
                .contentHTML(`<p>Are you sure you want to delete this section?</p>`)
                .setActionText('Delete')
                .actionFunc(() => {
                    this.element.remove();
                })
            modal.headerText = "Delete Section";
            modal.showMe();
        });
        return btn
    }  // endfold
    buildUpButton() {  // startfold
        const btn = document.createElement("button");
        btn.innerText = "^";
        btn.classList.add("section-up-btn");
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
        btn.classList.add("section-down-btn");
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

  buildNextClass() {
        const btn = document.createElement("button");
        btn.innerText = ">";
        btn.classList.add("section-next-btn");
        btn.addEventListener("click", () => {
            const curClass = this.element.classList[0];
            const curIdx = this.element.classes.indexOf(curClass);
            let nextIdx = curIdx + 1;
            if (nextIdx >= this.element.classes.length) {
                nextIdx = 0;
            }
            const nextClass = this.element.classes[nextIdx];
            this.element.classList.remove(curClass);
            this.element.classList.add(nextClass);
        });
        return btn
    } 
  buildPrevClass() {
      const btn = document.createElement("button");
      btn.innerText = "<";
      btn.classList.add("section-prev-btn");
      btn.addEventListener("click", () => {
          const curClass = this.element.classList[0];
          const curIdx = this.element.classes.indexOf(curClass);
          let nextIdx = curIdx - 1;
          if (nextIdx < 0) {
              nextIdx = this.element.classes.length - 1;
          }
          const nextClass = this.element.classes[nextIdx];
          this.element.classList.remove(curClass);
          this.element.classList.add(nextClass);
      });
      return btn
  }
  showAddSection() { // startfold
    const selector = document.createElement("select");
    for (const sectionName in SECTION_CHOICES) {
        const opt = document.createElement("option");
        opt.value = sectionName;
        opt.innerText = sectionName;
        selector.appendChild(opt);
    }
    const modal = modalBuilder()
        .actionFunc(() => {
            this.element.after(SECTION_CHOICES[selector.value]());
            dispatch(SetDocumentEditable);
        })
        .setHeaderText("Add Section")
        .setActionText("Add")
        .contentNode(selector)
        .showMe()
  } // endfold
}
