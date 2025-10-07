import { getColorStyle } from "./color_style.js";
import { AdminModal } from "./admin_modal_import.js";

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
