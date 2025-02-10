import { LOG } from '../utils/logger.js';

import { EditPaletteButton } from "../colors/edit_palette_button.js";
import { EditFontButton } from "../fonts/font_style.js";
import { EditFaviconButton } from "../favicon/favicon_editor.js";
import { EditHeadButton } from "../metadata/metadata_editor.js";


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
    
    try {
      for (let child of this.children) {
          this.appendChild(new child());
      }
    } catch (error) {
      LOG.error(`Failed to append child components: ${error.message}`);
      throw error; // rethrowing after logging
    }
  } // endfold
}
try {
  customElements.define(AdminAsideElementName, AdminAside, {extends: "aside"});
} catch (error) {
  LOG.fatal(`Failed to define custom element ${AdminAsideElementName}: ${error.message}`);
}