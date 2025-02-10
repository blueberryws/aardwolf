import { LOG } from '../utils/logger.js';

import { getColorStyle } from "./color_style.js";

export const EditPaletteButtonName = "edit-palette-button";
export class EditPaletteButton extends HTMLButtonElement {
    buttonText = "Edit Palette";
    constructor() {
        super();
        this.innerText = this.buttonText;
        try {
            const palette = getColorStyle();
            this.addEventListener("click", () => {
                try {
                    palette.openColorEditor();
                } catch (error) {
                    LOG.error(`Failed to open color editor: ${error.message}`);
                }
            });
        } catch (error) {
            LOG.error(`Failed to get color style: ${error.message}`);
        }
    }
}

customElements.define(EditPaletteButtonName, EditPaletteButton, {extends: "button"});