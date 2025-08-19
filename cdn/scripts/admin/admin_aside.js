import { EditPaletteButton } from "../colors/edit_palette_button.js";
import { EditFontButton } from "../fonts/font_style.js";
import { EditFaviconButton } from "../favicon/favicon_editor.js";
import { EditHeadButton } from "../metadata/metadata_editor.js";
import { OpenHelpButton } from "./open_help.js";

import { LOGGER } from "../utils/logger.js";


export const AdminAsideElementName = "admin-aside";

class AdminAsideEditor {
    constructor(element) {
       this.element = element;
       this.handleTouch = (e) => this.takeFocus(e);
       this.element.addEventListener("touchend", this.handleTouch);
    }
    takeFocus() { // startfold
        const hadFocus = this.element.classList.contains("focus");
        const otherSelected = document.querySelectorAll(".focus");
        otherSelected.forEach(el => {
            el.editor.removeFocus();
        });
        if (!hadFocus) {
          this.element.classList.add("focus");
        }
    } // endfold
    removeFocus() { // startfold
        this.element.classList.remove("focus");
    } // endfold
}

export class AdminAside extends HTMLElement { // startfold
  children = [
    EditPaletteButton,
    EditFontButton,
    EditHeadButton,
    EditFaviconButton,
    OpenHelpButton,
  ]

  constructor() { // startfold
    super();
    this.setAttribute("is", AdminAsideElementName);
    const arrow = document.createElement("span");
    arrow.id = "aside-arrow";
    arrow.innerText = "menu ➤";
    this.appendChild(arrow);
    for (let child of this.children) {
        this.appendChild(new child());
    }
    this.editor = new AdminAsideEditor(this);
  } // endfold
}
customElements.define(AdminAsideElementName, AdminAside, {extends: "aside"});
// endfold
