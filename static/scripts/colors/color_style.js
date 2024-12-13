import { MakeToast } from "../utils/make_toast.js";
import { EditColorsEvent } from "../interfaces/events.js";
import { ColorEditorModal } from "./color_editor_modal.js";

export const ColorStyleElementName = "color-style";
export function getColorStyle() {
    return document.querySelector(`style[is='${ColorStyleElementName}']`)
}

export class ColorStyle extends HTMLStyleElement { // startfold
  // This is how the component communicates with itself between edits.
  static observedAttributes = ["data-palette", "data-primary-color", "data-secondary-color"];
  paletteSize = 5;
  colorValidationRegex = /^#[0-9A-Fa-f]{6}/g;
  defaultPrimaryColor = "#999900"
  defaultSecondaryColor = "#000000"
  defaultPalette = ["#ff0000", "#aaaaaa", "#777777", "#333333", "#000000"];
  userErrorMessage = "Unable to set color palette.\nIf this persists, please contact support."

  constructor() { // startfold
    super();
    this.ensureDefaults();
    this.render();
    const other = getColorStyle();
    if (other != null && other !== this) {
        throw(`There can only be ONE ${ColorStyleElementName} element!`);
    }
    document.addEventListener(EditColorsEvent, (e) => this.openColorEditor(e));

  } // endfold
  openColorEditor() { // startfold
    const modal = new ColorEditorModal();
    modal.showMe();
  } //endfold
  ensureDefaults() { // startfold
    // Create a default color palette, if one doesn't exist.
    if (this.dataset.palette == null) {
      this.dataset.palette = JSON.stringify(this.defaultPalette);
    }
    if (this.dataset.primaryColor == null) {
        this.dataset.primaryColor = this.defaultPrimaryColor;
    }
    if (this.dataset.secondaryColor == null) {
        this.dataset.secondaryColor = this.defaultSecondaryColor;
    }
  } // endfold
  validateColors(colors) { // startfold
    let newColors
    try {
      newColors = JSON.parse(colors); 
    } catch(e) {
      console.error(e);
      MakeToast(this.userErrorMessage);
      return
    }
    const errorString = `invalid color set: ${newColors}`;
    if (!Array.isArray(newColors)) {
      console.error(errorString);
      MakeToast(this.userErrorMessage);
      return
    }
    for (let color of newColors) {
      if (typeof color != "string") {
        console.error(errorString);
        MakeToast(this.userErrorMessage);
        return
      }
      let passedRegex = this.colorValidationRegex.test(color);
      this.colorValidationRegex.lastIndex = 0;
      if (!passedRegex) {
        console.error(errorString);
        MakeToast(this.userErrorMessage);
        return
      }
    }
    return newColors
  } // endfold
  render() { // startfold
    const palette = JSON.parse(this.dataset.palette);
    this.innerHTML = `
  :root {
    --color-one: ${palette[0]};
    --color-two: ${palette[1]};
    --color-three: ${palette[2]};
    --color-four: ${palette[3]};
    --color-five: ${palette[4]};
  }
`
  } // endfold
  attributeChangedCallback(name, oldValue, newValue) { // startfold
    if (name == "data-primary-color" || name == "data-secondary-color") {
        return
    }
    const newColors = this.validateColors(newValue);
    if (newColors != null) {
        this.render();
    } else {
        this.dataset["name"] = oldValue;
    }
  } // endfold
  generatePaletteChoices() { // startfold
    return [
      ["#ff0000", "#af0000", "#8f0000", "#4f0000", "#0f0000"],
      ["#00ff00", "#00aa00", "#008800", "#004400", "#000000"],
      ["#0000ff", "#0000aa", "#000088", "#000044", "#000000"],
      ["#ffffff", "#aaaaaa", "#777777", "#333333", "#000000"],
      [this.dataset.primaryColor, this.dataset.secondaryColor, "#000000", "#ffffff", "#000000"],
    ]
  } // endfold
} // endfold
customElements.define(ColorStyleElementName, ColorStyle, {extends: "style"});
