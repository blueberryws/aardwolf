import { MakeToast } from "../utils/make_toast.js";
import { EditColorsEvent } from "../interfaces/events.js";
import { ColorEditorModal } from "./color_editor_modal.js";
import { contrast } from "../utils/colors.js";

export const ColorStyleElementName = "color-style";
export function getColorStyle() {
    return document.querySelector(`style[is='${ColorStyleElementName}']`)
}

export class ColorStyle extends HTMLStyleElement { // startfold
  // This is how the component communicates with itself between edits.
  static observedAttributes = ["data-palette", "data-primary-color", "data-secondary-color"];
  paletteSize = 4;
  colorValidationRegex = /^#[0-9A-Fa-f]{6}/g;
  defaultPrimaryColor = "#ffffff"
  defaultSecondaryColor = "#000000"
  defaultPalette = ["#ffffff", "#aaaaaa", "#555555", "#000000"];
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
    const wContrast = contrast(parseHexColor(palette[0]), parseHexColor(this.dataset.primaryColor));
    const bContrast = contrast(parseHexColor(palette[3]), parseHexColor(this.dataset.primaryColor));
    const contrastColor = wContrast > bContrast ? palette[0] : palette[3];
    this.innerHTML = `
  :root {
    --palette-color-one: ${palette[0]};
    --palette-color-two: ${palette[1]};
    --palette-color-three: ${palette[2]};
    --palette-color-four: ${palette[3]};
    --palette-brand-contrast-color: ${contrastColor};
    --palette-brand-color: ${this.dataset.primaryColor};
  }
`
  console.log("render complete");
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
    // primary: off-white mid-color dark-color off-black
    // secondary: off-white mid-color dark-color off-black
    // grayscale: white light-gray dark-gray black
    // brownscale: ivory tan mid-brown dark-brown (#755E4A)
    // 
    // 0 1 2 3 4 5 6 7 8 9 a b c d e f
    // 0         5         a         f
    const grayscale = ["#ffffff", "#aaaaaa", "#555555", "#000000"]; // pure grayscale
    const brownscale =["#F6E4D5", "#D3C0AD", "#39332C", "#201A15"]; 
    const monochrome = genStraight(this.dataset.secondaryColor);
    return [
      grayscale,
      [grayscale[0], monochrome[1], monochrome[2], grayscale[3]],
      brownscale,
      [brownscale[0], monochrome[1], monochrome[2], brownscale[3]],
      monochrome,
    ]
  } // endfold
} // endfold
customElements.define(ColorStyleElementName, ColorStyle, {extends: "style"});


export function genStraight(hex) {
  const base = parseHexColor(hex);
  console.log(base);
  const largest = getLargest(base);
  const smallest = getSmallest(base);
  let white = genWhite(base); 
  let colorTwo = {
    r: Math.floor((192 / largest) * base.r), 
    g: Math.floor((192 / largest) * base.g), 
    b: Math.floor((192 / largest) * base.b), 
  }
  let colorThree = {
    r: Math.floor((96 / largest) * base.r), 
    g: Math.floor((96 / largest) * base.g), 
    b: Math.floor((96 / largest) * base.b), 
  }
  let black = {
    r: Math.floor((28 / largest) * base.r),
    g: Math.floor((28 / largest) * base.g), 
    b: Math.floor((28 / largest) * base.b), 
  }
  if (largest > 220 && smallest > 200) {
    white = base;
  } else if (largest > 136) {
    colorTwo = base;
  } else if (largest > 64) {
    colorThree = base;
  } else {
    black = base;
  }
  const palette = [
    rgbToHex(white.r, white.g, white.b),
    rgbToHex(colorTwo.r, colorTwo.g, colorTwo.b),
    rgbToHex(colorThree.r, colorThree.g, colorThree.b),
    rgbToHex(black.r, black.g, black.b),
  ]
  return palette;
}

function genWhite(base) {
    const smallest = getSmallest(base);
    return {
      r: base.r + genWhiteComponent(base.r, smallest),
      g: base.g + genWhiteComponent(base.g, smallest),
      b: base.b + genWhiteComponent(base.b, smallest),
    }
}

function genWhiteComponent(component, smallest) {
    const maxSize = 255;
    const stepSize = (maxSize - component) / (maxSize - smallest);
    const stepCount = 235 - smallest;
    return Math.floor(stepSize * stepCount);
}

function getLargest(base) {
  if (base.r >= base.g && base.r >= base.b) {
    return base.r;
  } else if (base.g >= base.r && base.g >= base.b) {
    return base.g;
  } else {
    return base.b;
  }
}

function getSmallest(base) {
  if (base.r <= base.g && base.r <= base.b) {
    return base.r;
  } else if (base.g <= base.r && base.g <= base.b) {
    return base.g;
  } else {
    return base.b;
  }
}

function parseHexColor(hex) {
  // Remove the '#' if present
  hex = hex.replace("#", "");

  // Check if it's a shorthand hex value (e.g., #f00)
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }

  // Convert to RGB values
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  return { r, g, b };
}

function componentToHex(c) {
  var hex = Math.floor(c).toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
