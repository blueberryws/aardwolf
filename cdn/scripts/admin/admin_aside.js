import { EditPaletteButton } from "../colors/edit_palette_button.js";
import { EditFontButton } from "../fonts/font_style.js";
import { EditFaviconButton } from "../favicon/favicon_editor.js";
import { EditHeadButton } from "../metadata/metadata_editor.js";

import { LOGGER } from "../utils/logger.js";


export const AdminAsideElementName = "admin-aside";

export class AdminAside extends HTMLElement { // startfold
  children = [
    EditPaletteButton,
    EditFontButton,
    EditHeadButton,
    EditFaviconButton,
  ]

  constructor() { // startfold
    super();
    this.setAttribute("is", AdminAsideElementName);
    const arrow = document.createElement("img");
    arrow.setAttribute("src", "/cdn/assets/menu-arrow-right.svg");
    arrow.id = "aside-arrow";
    this.appendChild(arrow);
    for (let child of this.children) {
        this.appendChild(new child());
    }
  } // endfold
}
customElements.define(AdminAsideElementName, AdminAside, {extends: "aside"});
// endfold
