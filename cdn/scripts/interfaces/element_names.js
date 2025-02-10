import { LOG } from '../utils/logger.js';

const ColorStyleElementName = "color-style";
const ColorStyleSelector = "style[is='color-style']";
const ColorStyleElement = document.querySelector(ColorStyleSelector);

if (!ColorStyleElement) {
    LOG.warn(`No element found for selector: ${ColorStyleSelector}`);
}

const EditPaletteButtonName = "edit-palette";

export {
    ColorStyleElementName as "ColorStyleElementName",
    ColorStyleSelector as "ColorStyleSelector",
    ColorStyleElement as "ColorStyleElement",
    EditPaletteButtonName as "EditPaletteButtonName",
}