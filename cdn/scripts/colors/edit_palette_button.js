import { getColorStyle } from "./color_style.js";

export const EditPaletteButtonName = "edit-palette-button";
export class EditPaletteButton extends HTMLButtonElement {
    buttonText = "Colors";
    constructor() {
        super();
        this.innerText = this.buttonText;
        const palette = getColorStyle();
        this.addEventListener("click", palette.openColorEditor);
    }
}

customElements.define(EditPaletteButtonName, EditPaletteButton, {extends: "button"});
