import { MakeToast } from "../scripts/utils/make_toast.js";
import { EditColorsEvent } from "../scripts/interfaces/events.js";
import { contrast } from "../scripts/utils/colors.js";
import { AdminModal } from "./admin_modal_import.js";


export const ColorStyleElementName = "color-style";
export function getColorStyle() {
    return document.querySelector(ColorStyleElementName);
}

// NEW: use this everywhere you need to guarantee one exists
export function ensureColorStyleSingleton() {
    let el = document.querySelector(ColorStyleElementName);
    if (!el) {
        el = new ColorStyle();
        document.body.appendChild(el);
    }
    return el;
}


/* ============================
   ColorPaletteSelector (autonomous)
   ============================ */
class ColorPaletteSelector extends HTMLElement {
    static observedAttributes = ["data-colors", "checked"];

    groupName = "selected-palette";
    #radioEl = null;

    constructor() {
        super();
        this.addEventListener("click", () => this.handleClick());
        this.classList.add("color-palette");
    }

    connectedCallback() {
        // Allow author to override the group via attribute
        if (this.hasAttribute("data-group")) {
            this.groupName = this.getAttribute("data-group");
        }
        this.render();
    }

    attributeChangedCallback() {
        this.render();
    }

    handleClick() {
        // Update the managed radio and notify ColorStyle
        if (this.#radioEl) {
            this.#radioEl.checked = true;
            // Uncheck other radios in the same group inside sibling selectors
            document
                .querySelectorAll(`color-palette-selector input[type="radio"][name="${this.groupName}"]`)
                .forEach((el) => {
                    if (el !== this.#radioEl) el.checked = false;
                });
        }
        const colorStyle = getColorStyle();
        if (colorStyle) {
            colorStyle.dataset.palette = this.dataset.colors;
        }
        // Reflect checked attribute for styling
        this.setAttribute("checked", "");
        document
            .querySelectorAll(`color-palette-selector[checked]`)
            .forEach((el) => {
                if (el !== this) el.removeAttribute("checked");
            });
    }

    render() {
        const checked = this.hasAttribute("checked") ? "checked" : "";
        const colors = safeJsonParseArray(this.dataset.colors) || [];
        let html = `<input type="radio" name="${this.groupName}" value='${this.dataset.colors ?? "[]"}' ${checked}>`;
        for (let color of colors) {
            html += `<div style="background-color:${color}"></div>`;
        }
        this.innerHTML = html;

        this.#radioEl = this.querySelector('input[type="radio"]');
        if (this.#radioEl) {
            // keep attribute ↔ state in sync
            this.#radioEl.addEventListener("change", () => {
                if (this.#radioEl.checked) this.setAttribute("checked", "");
                else this.removeAttribute("checked");
            });
        }
    }
}
customElements.define("color-palette-selector", ColorPaletteSelector);

/* ============================
   ColorEditorModal (autonomous)
   ============================ */
export class ColorEditorModal extends AdminModal {
    actionText = "Update";
    headerText = "Set Colors";
    contentClass = "modal-content";

    connectedCallback() {
        super.connectedCallback?.(); // in case AdminModal implements one
        this.classList.add("colors-modal");

        this.colorStyle = getColorStyle();
        this.currentPalette = JSON.parse(this.colorStyle.dataset.palette);
        this.curPrimaryColor = this.colorStyle.dataset.primaryColor;
        this.curSecondaryColor = this.colorStyle.dataset.secondaryColor;
        this.curDarkModeDefault = this.colorStyle.dataset.darkModeDefault;

        this.beforeCancel = () => {
            this.colorStyle.dataset.palette = JSON.stringify(this.currentPalette);
            this.colorStyle.dataset.primaryColor = this.curPrimaryColor;
            this.colorStyle.dataset.secondaryColor = this.curSecondaryColor;
            this.colorStyle.dataset.darkModeDefault = this.curDarkModeDefault;
        };

        this.render();
    }

    makeSelectors() {
        const selectors = document.createElement("div");
        selectors.classList.add("selectors");

        const primaryLabel = document.createElement("label");
        primaryLabel.innerText = "Primary Color";
        selectors.appendChild(primaryLabel);

        const primaryInput = document.createElement("input");
        primaryInput.type = "color";
        primaryInput.value = this.colorStyle.dataset.primaryColor;
        primaryInput.addEventListener("change", (e) => {
            this.colorStyle.dataset.primaryColor = e.target.value;
            this.render();
        });
        selectors.appendChild(primaryInput);

        const secondaryLabel = document.createElement("label");
        secondaryLabel.innerText = "Secondary Color";
        selectors.appendChild(secondaryLabel);

        const secondaryInput = document.createElement("input");
        secondaryInput.type = "color";
        secondaryInput.value = this.colorStyle.dataset.secondaryColor;
        secondaryInput.addEventListener("change", (e) => {
            this.colorStyle.dataset.secondaryColor = e.target.value;
            this.render();
        });
        selectors.appendChild(secondaryInput);

        const invertLabel = document.createElement("label");
        invertLabel.innerText = "Invert Colors:";
        selectors.appendChild(invertLabel);

        const invertInput = document.createElement("input");
        invertInput.type = "checkbox";
        if (this.curDarkModeDefault === "true") {
            invertInput.setAttribute("checked", "true");
        }
        invertInput.addEventListener("change", () => {
            this.colorStyle.dataset.darkModeDefault = invertInput.checked ? "true" : "false";
        });
        selectors.appendChild(invertInput);

        return selectors;
    }

    getInstructions() {
        const instructions = document.createElement("details");
        instructions.innerHTML = `
      <summary>How To Set Colors</summary>
      <ol>
        <li>Click the Color Selector for "Primary Color" To Pick Your Primary Color</li>
        <li>Click the Color Selector for "Secondary Color" To Pick Your Secondary Color</li>
        <li>Pick from one of the generated color palettes.</li>
      </ol>
      <p>Note: The color palettes are generated using the secondary color. The primary color is used directly across the site.</p>
    `;
        return instructions;
    }

    getContent() {
        const content = document.createElement("div");
        content.classList.add(this.contentClass);

        content.appendChild(this.makeSelectors());

        const currentPaletteData = JSON.parse(this.colorStyle.dataset.palette);
        const currentPalette = document.createElement("color-palette-selector");
        currentPalette.classList.add("current-palette");
        currentPalette.dataset.colors = JSON.stringify(currentPaletteData);
        currentPalette.setAttribute("checked", "");
        content.appendChild(currentPalette);

        const prospectivePaletteChoices = this.colorStyle.generatePaletteChoices();
        const prospectivePalettes = document.createElement("div");
        prospectivePalettes.classList.add("prospective-palettes");

        for (let pc of prospectivePaletteChoices) {
            const prospectivePalette = document.createElement("color-palette-selector");
            prospectivePalette.dataset.colors = JSON.stringify(pc);
            prospectivePalettes.appendChild(prospectivePalette);
        }

        content.appendChild(prospectivePalettes);

        return content;
    }
}
customElements.define("color-editor-modal", ColorEditorModal);

/* ================
   helpers
   ================ */
function safeJsonParseArray(str) {
    if (!str) return null;
    try {
        const v = JSON.parse(str);
        return Array.isArray(v) ? v : null;
    } catch {
        return null;
    }
}



// --- Autonomous custom element (Safari-friendly) ---
export class ColorStyle extends HTMLElement { // CHANGED: no built-in extension
    static observedAttributes = ["data-palette", "data-primary-color", "data-secondary-color", "data-dark-mode-default"];

    paletteSize = 4;
    colorValidationRegex = /^#[0-9A-Fa-f]{6}/g;
    defaultPrimaryColor = "#ffffff";
    defaultSecondaryColor = "#000000";
    defaultPalette = ["#ffffff", "#aaaaaa", "#555555", "#000000"];
    userErrorMessage = "Unable to set color palette.\nIf this persists, please contact support.";

    // we render CSS into this <style> element (lives in <head>)
    #styleId = "color-style-managed-style";
    #styleEl = null;

    constructor() {
        super();
        this.ensureDefaults();

        const other = getColorStyle();
        if (other != null && other !== this) {
            throw new Error(`There can only be ONE ${ColorStyleElementName} element!`);
        }

        document.addEventListener(EditColorsEvent, (e) => this.openColorEditor(e));
    }

    connectedCallback() {
        // Create/find the managed <style> tag once we're in the DOM.
        this.#styleEl = document.getElementById(this.#styleId);
        if (!this.#styleEl) {
            this.#styleEl = document.createElement("style");
            this.#styleEl.id = this.#styleId;
            document.head.appendChild(this.#styleEl);
        }
        this.render();
    }

    disconnectedCallback() {
        // Optional: keep the <style> around or remove it if this element is removed.
        // Comment out if you prefer persistence.
        // if (this.#styleEl && this.#styleEl.parentNode) {
        //   this.#styleEl.parentNode.removeChild(this.#styleEl);
        // }
    }

    openColorEditor() {
        // make sure the singleton exists before the modal reads from it
        ensureColorStyleSingleton();

        const modal = document.createElement("color-editor-modal");
        document.body.appendChild(modal);

        const actuallyShow = () => {
            if (typeof modal.showMe === "function") modal.showMe();
            else if (typeof modal.show === "function") modal.show();
            else modal.setAttribute("open", "");
        };

        // If the definition is already loaded, wait a frame so connectedCallback runs.
        if (customElements.get("color-editor-modal")) {
            requestAnimationFrame(actuallyShow);
        } else {
            // Ensure the element is defined, then wait a frame to let connectedCallback do its work
            customElements.whenDefined("color-editor-modal").then(() => {
                requestAnimationFrame(actuallyShow);
            });
        }
    }

    ensureDefaults() {
        if (this.dataset.palette == null) {
            this.dataset.palette = JSON.stringify(this.defaultPalette);
        }
        if (this.dataset.primaryColor == null) {
            this.dataset.primaryColor = this.defaultPrimaryColor;
        }
        if (this.dataset.secondaryColor == null) {
            this.dataset.secondaryColor = this.defaultSecondaryColor;
        }
        if (this.dataset.darkModeDefault == null) {
            this.dataset.darkModeDefault = "false";
        }
    }

    validateColors(colors) {
        let newColors;
        try {
            newColors = JSON.parse(colors);
        } catch (e) {
            console.error(e);
            MakeToast(this.userErrorMessage);
            return;
        }
        const errorString = `invalid color set: ${newColors}`;
        if (!Array.isArray(newColors)) {
            console.error(errorString);
            MakeToast(this.userErrorMessage);
            return;
        }
        for (let color of newColors) {
            if (typeof color !== "string") {
                console.error(errorString);
                MakeToast(this.userErrorMessage);
                return;
            }
            const passedRegex = this.colorValidationRegex.test(color);
            this.colorValidationRegex.lastIndex = 0;
            if (!passedRegex) {
                console.error(errorString);
                MakeToast(this.userErrorMessage);
                return;
            }
        }
        return newColors;
    }

    render() {
        if (!this.#styleEl) return; // connectedCallback will call render again
        const palette = JSON.parse(this.dataset.palette);
        const wContrast = contrast(parseHexColor(palette[0]), parseHexColor(this.dataset.primaryColor));
        const bContrast = contrast(parseHexColor(palette[3]), parseHexColor(this.dataset.primaryColor));
        const contrastColor = wContrast > bContrast ? palette[0] : palette[3];

        if (this.dataset.darkModeDefault === "true") {
            this.#styleEl.textContent = `
        :root {
          --light-color-one: ${palette[3]};
          --light-color-two: ${palette[2]};
          --light-color-three: ${palette[1]};
          --light-color-four: ${palette[0]};
          --dark-color-one: ${palette[3]};
          --dark-color-two: ${palette[2]};
          --dark-color-three: ${palette[1]};
          --dark-color-four: ${palette[0]};
          --palette-brand-contrast-color: ${contrastColor};
          --palette-brand-color: ${this.dataset.primaryColor};
        }
      `;
        } else {
            this.#styleEl.textContent = `
        :root {
          --light-color-one: ${palette[0]};
          --light-color-two: ${palette[1]};
          --light-color-three: ${palette[2]};
          --light-color-four: ${palette[3]};
          --dark-color-one: ${palette[3]};
          --dark-color-two: ${palette[2]};
          --dark-color-three: ${palette[1]};
          --dark-color-four: ${palette[0]};
          --palette-brand-contrast-color: ${contrastColor};
          --palette-brand-color: ${this.dataset.primaryColor};
        }
      `;
        }
        console.log("render complete");
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "data-palette") {
            const newColors = this.validateColors(newValue);
            if (newColors != null) {
                this.render();
            } else {
                // revert attribute on invalid input
                if (oldValue == null) {
                    this.removeAttribute(name);
                } else {
                    this.setAttribute(name, oldValue);
                }
            }
        } else {
            this.render();
        }
    }

    generatePaletteChoices() {
        const grayscale = ["#ffffff", "#aaaaaa", "#555555", "#000000"];
        const brownscale = ["#F6E4D5", "#D3C0AD", "#39332C", "#201A15"];
        const monochrome = genStraight(this.dataset.secondaryColor);
        return [
            grayscale,
            [grayscale[0], monochrome[1], monochrome[2], grayscale[3]],
            brownscale,
            [brownscale[0], monochrome[1], monochrome[2], brownscale[3]],
            monochrome,
        ];
    }
}

customElements.define(ColorStyleElementName, ColorStyle); // CHANGED: no {extends:"style"}

// --- helpers (unchanged) ---
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
    };
    let colorThree = {
        r: Math.floor((96 / largest) * base.r),
        g: Math.floor((96 / largest) * base.g),
        b: Math.floor((96 / largest) * base.b),
    };
    let black = {
        r: Math.floor((28 / largest) * base.r),
        g: Math.floor((28 / largest) * base.g),
        b: Math.floor((28 / largest) * base.b),
    };
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
    ];
    return palette;
}

function genWhite(base) {
    const smallest = getSmallest(base);
    return {
        r: base.r + genWhiteComponent(base.r, smallest),
        g: base.g + genWhiteComponent(base.g, smallest),
        b: base.b + genWhiteComponent(base.b, smallest),
    };
}

function genWhiteComponent(component, smallest) {
    const maxSize = 255;
    const stepSize = (maxSize - component) / (maxSize - smallest);
    const stepCount = 235 - smallest;
    return Math.floor(stepSize * stepCount);
}

function getLargest(base) {
    if (base.r >= base.g && base.r >= base.b) return base.r;
    if (base.g >= base.r && base.g >= base.b) return base.g;
    return base.b;
}

function getSmallest(base) {
    if (base.r <= base.g && base.r <= base.b) return base.r;
    if (base.g <= base.r && base.g <= base.b) return base.g;
    return base.b;
}

function parseHexColor(hex) {
    hex = hex.replace("#", "");
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return { r, g, b };
}

function componentToHex(c) {
    const hex = Math.floor(c).toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}



export const EditPaletteButtonName = "edit-palette-button";

export class EditPaletteButton extends HTMLElement {
    buttonText = "Colors";

    connectedCallback() {
        // Render once
        if (!this._initialized) {
            this._initialized = true;
            this.setAttribute("role", "button");
            this.tabIndex = 0;
            this.textContent = this.buttonText;

            const onActivate = () => {
                const palette = ensureColorStyleSingleton(); // creates+appends if missing
                palette.openColorEditor();
            };


            this.addEventListener("click", onActivate);
            this.addEventListener("keydown", (e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onActivate();
                }
            });
        }
    }
}

customElements.define(EditPaletteButtonName, EditPaletteButton);

