// admin_aside.js

import { EditPaletteButton } from "./edit_palette_button.js";
import { EditFontButton } from "./font_style.js";
import { EditFaviconButton } from "./favicon_editor.js";
import { EditHeadButton } from "./metadata_editor.js";
import { OpenHelpButton } from "./open_help.js";

import { LOGGER } from "../scripts/utils/logger.js";

export const AdminAsideElementName = "admin-aside";
// TODO: make the color editor actually work
// TODO: make all the editors connect to the data layer

/* ---------------------------------- *
 * Internal editor helper
 * ---------------------------------- */
class AdminAsideEditor {
    constructor(element) {
        this.element = element;
        this.handleTouch = (e) => this.takeFocus(e);
        this.element.addEventListener("touchend", this.handleTouch, { passive: true });
    }
    takeFocus() { // startfold
        const hadFocus = this.element.classList.contains("focus");
        const otherSelected = document.querySelectorAll(".focus");
        otherSelected.forEach((el) => {
            if (el !== this.element && el.editor?.removeFocus) {
                el.editor.removeFocus();
            } else {
                el.classList.remove("focus");
            }
        });
        if (!hadFocus) {
            this.element.classList.add("focus");
        }
    } // endfold
    removeFocus() { // startfold
        this.element.classList.remove("focus");
    } // endfold
}

/* ---------------------------------- *
 * <admin-aside> (autonomous element)
 * ---------------------------------- */
export class AdminAside extends HTMLElement { // startfold
    // Keep the list outside the constructor so it's stable for subclassing/tests
    childrenDefs = [
        EditPaletteButton,
        EditFontButton,
        EditHeadButton,
        EditFaviconButton,
        OpenHelpButton,
    ];

    constructor() { // startfold
        super();

        // A11y parity with <aside>
        this.setAttribute("role", "complementary");
        this.setAttribute("aria-label", this.getAttribute("aria-label") || "Admin menu");

        // Optional: keep a class hook in case your CSS targeted the old <aside>
        this.classList.add("admin-aside");

        // Build UI
        const arrow = document.createElement("span");
        arrow.id = "aside-arrow";
        arrow.innerText = "menu ➤";
        this.appendChild(arrow);

        for (const Child of this.childrenDefs) {
            this.appendChild(new Child());
        }

        // Focus handling
        this.editor = new AdminAsideEditor(this);
    } // endfold

}
customElements.define(AdminAsideElementName, AdminAside);
// endfold

