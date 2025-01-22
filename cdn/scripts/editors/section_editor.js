import { modalBuilder } from "../modals/base.js";
import { ElementEditor } from "./element_editor.js";
import { dispatch, SetDocumentEditable } from "../interfaces/events.js";
import { htmlFromJSON } from "../utils/html.js";
import { SECTIONS, REGISTRY } from "../element_registry.js";

function makeSection(section) {
    const newSection = new section();
    newSection.editor.setEditable();
    newSection.classList.add(newSection.classes[0]);
    return newSection;
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
    this.element.addEventListener("mouseenter", () => {
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
    this.element.addEventListener("mouseleave", () => {
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

  buildNextClass() { // startfold
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
  } // endfold
  buildPrevClass() { // startfold
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
  } // endfold
  showAddSection() { // startfold
    const selector = document.createElement("select");
    for (const sectionName in SECTIONS) {
        const opt = document.createElement("option");
        opt.value = sectionName;
        opt.innerText = sectionName;
        selector.appendChild(opt);
    }
    const modal = modalBuilder()
        .actionFunc(() => {
            const newSectionType = SECTIONS[selector.value];
            const newSection = makeSection(newSectionType);
            this.element.after(newSection);
            dispatch(SetDocumentEditable);
        })
        .setHeaderText("Add Section")
        .setActionText("Add")
        .contentNode(selector)
        .showMe()
  } // endfold

  ensureDefaults() { // startfold
    /*
        For now, we're using position as THE CORRECT proxy here.
        In the future, we will likely need something more complex.
        Classes? custom attribute selectors?
        Unclear at this time, but since we only have one theme, and 0 html schema migrations,
        this is sufficient.


        Additionally, we are NOT checking for child content at this time. The section defaults only
        check top-level content at this time. This will likely need to evolve around the same time
        as the above.
    */

    let newChildren = [];
    for (const [position, contentPiece] of this.element.defaultContent.entries()) {
      const existingContent = this.element.children[position];
      if (existingContent != null) {
        newChildren.push(existingContent); 
      } else {
        const newChild = htmlFromJSON(contentPiece, REGISTRY);
        newChildren.push(newChild); 
      }
    }
    this.element.innerHTML = "";
    newChildren.forEach(e => this.element.appendChild(e));
  } // endfold
}
