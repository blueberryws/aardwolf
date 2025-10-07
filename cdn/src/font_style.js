// font_style.js
import { AdminModal } from "./admin_modal_import.js";

// Data Element
export const FontStyleElementName = "font-style";
export function getFontStyle() {
    return document.querySelector(FontStyleElementName);
}

// NEW: use this everywhere you need to guarantee one exists
function ensureFontStyleSingleton() {
    let el = document.querySelector(FontStyleElementName);
    if (!el) {
        el = new FontStyle(); // <font-style>
        document.body.appendChild(el);
    }
    return el;
}

const STANDARD_HEADER_STYLE = {
    "x-large": { size: "64px", weight: 400 },
    large: { size: "48px", weight: 400 },
    medium: { size: "32px", weight: 400 },
    small: { size: "20px", weight: 400 },
};
const STANDARD_BODY_STYLE = {
    large: { size: "24px", weight: 400 },
    medium: { size: "20px", weight: 400 },
    small: { size: "16px", weight: 400 },
};

export class FontStyle extends HTMLElement {
    static observedAttributes = ["data-header-font", "data-body-font"];

    defaultHeaderFont = "Open Sans Condensed";
    defaultBodyFont = "Lora";

    userErrorMessage = "Unable to set fonts.\nIf this persists, please contact support.";

    fonts = [
        {
            header: { name: "Great Vibes", url: "/cdn/fonts/GreatVibes/GreatVibes-Regular.ttf", style: STANDARD_HEADER_STYLE },
            body: { name: "Montserrat", url: "/cdn/fonts/Montserrat/Montserrat-VariableFont_wght.ttf", style: STANDARD_BODY_STYLE },
            description: "Elegant, Inviting, Contemporary",
        },
        {
            header: { name: "Fjalla One", url: "/cdn/fonts/Fjalla_One/FjallaOne-Regular.ttf", style: STANDARD_HEADER_STYLE },
            body: { name: "Nunito", url: "/cdn/fonts/Nunito/Nunito-VariableFont_wght.ttf", style: STANDARD_BODY_STYLE },
            description: "Clean, Modern, Friendly",
        },
        {
            header: { name: "Raleway", url: "/cdn/fonts/Raleway/Raleway-VariableFont_wght.ttf", style: STANDARD_HEADER_STYLE },
            body: { name: "Libre Baskerville", url: "/cdn/fonts/Libre_Baskerville/LibreBaskerville-Regular.ttf", style: STANDARD_BODY_STYLE },
            description: "Bold, Elegant, Timeless",
        },
        {
            header: { name: "Quicksand", url: "/cdn/fonts/Quicksand/Quicksand-VariableFont_wght.ttf", style: STANDARD_HEADER_STYLE },
            body: { name: "Source Sans", url: "/cdn/fonts/SourceSans/SourceSans3-VariableFont_wght.ttf", style: STANDARD_BODY_STYLE },
            description: "Friendly, Modern, Approachable",
        },
        {
            header: { name: "Kalnia", url: "/cdn/fonts/Kalnia/Kalnia-VariableFont_wdth,wght.ttf", style: STANDARD_HEADER_STYLE },
            body: { name: "Montserrat", url: "/cdn/fonts/Montserrat/Montserrat-VariableFont_wght.ttf", style: STANDARD_BODY_STYLE },
            description: "Whimsical, Warm, Versitile",
        },
        {
            header: { name: "Oswald", url: "/cdn/fonts/Oswald/Oswald-VariableFont_wght.ttf", style: STANDARD_HEADER_STYLE },
            body: { name: "Noto Serif", url: "/cdn/fonts/Noto_Serif/NotoSerif-VariableFont_wdth,wght.ttf", style: STANDARD_BODY_STYLE },
            description: "Strong, Minimal, Classic",
        },
        {
            header: { name: "Playfair Display", url: "/cdn/fonts/Playfair_Display/PlayfairDisplay-VariableFont_wght.ttf", style: STANDARD_HEADER_STYLE },
            body: { name: "Quattrocento Sans", url: "/cdn/fonts/Quattrocento_Sans/QuattrocentoSans-Regular.ttf", style: STANDARD_BODY_STYLE },
            description: "Dramatic, Refined, Confident",
        },
        {
            header: { name: "Yellowtail", url: "/cdn/fonts/Yellowtail/Yellowtail-Regular.ttf", style: STANDARD_HEADER_STYLE },
            body: { name: "Lato", url: "/cdn/fonts/Lato/Lato-Regular.ttf", style: STANDARD_BODY_STYLE },
            description: "Dramatic, Refined, Confident",
        },
        {
            header: { name: "Bangers", url: "/cdn/fonts/Bangers/Bangers-Regular.ttf", style: STANDARD_HEADER_STYLE },
            body: { name: "Montserrat", url: "/cdn/fonts/Montserrat/Montserrat-VariableFont_wght.ttf", style: STANDARD_BODY_STYLE },
            description: "Bold, Energetic, Fun",
        },
        {
            header: { name: "Lora", url: "/cdn/fonts/Lora/Lora-VariableFont_wght.ttf", style: STANDARD_HEADER_STYLE },
            body: { name: "Poppins", url: "/cdn/fonts/Poppins/Poppins-Regular.ttf", style: STANDARD_BODY_STYLE },
            description: "Creative, Stylish, Balanced",
        },
        {
            header: { name: "Merriweather Sans", url: "/cdn/fonts/Merriweather_Sans/MerriweatherSans-VariableFont_wght.ttf", style: STANDARD_HEADER_STYLE },
            body: { name: "Merriweather Italic", url: "/cdn/fonts/Merriweather/Merriweather-Italic.ttf", style: STANDARD_BODY_STYLE },
            description: "Trustworthy, Professional, Thoughtful",
        },
        {
            header: { name: "Open Sans Condensed", url: "/cdn/fonts/Open_Sans/OpenSans-VariableFont_wdth,wght.ttf", style: STANDARD_HEADER_STYLE },
            body: { name: "Lora", url: "/cdn/fonts/Lora/Lora-VariableFont_wght.ttf", style: STANDARD_BODY_STYLE },
            description: "Sleek, Sophisticated, Versatile",
        },
    ];

    constructor() {
        super();
        // Dedicated <style> that we manage (lives in <head> so CSS applies as before)
        this._styleEl = document.createElement("style");
        this._styleEl.setAttribute("data-managed-by", FontStyleElementName);
        document.head.appendChild(this._styleEl);

        this.ensureDefaults();
        this.render();

        // IMPORTANT: no calls to getFontStyle() here
        const other = document.querySelector(FontStyleElementName);
        if (other && other !== this) {
            throw `There can only be ONE ${FontStyleElementName} element!`;
        }
    }


    connectedCallback() {
        // no-op; constructor sets things up
    }

    openFontEditor() {
        // make sure the singleton exists before the modal reads from it
        ensureFontStyleSingleton();

        const modal = document.createElement("font-editor-modal");
        document.body.appendChild(modal);

        // Be tolerant of different AdminModal APIs
        if (typeof modal.showMe === "function") modal.showMe();
        else if (typeof modal.show === "function") modal.show();
        else modal.setAttribute("open", "");
    }


    ensureDefaults() {
        if (this.dataset.headerFont == null) {
            this.dataset.headerFont = this.defaultHeaderFont;
        }
        if (this.dataset.bodyFont == null) {
            this.dataset.bodyFont = this.defaultBodyFont;
        }
    }

    render() {
        const fontPair = this.fonts.find(
            (fp) => fp.header.name === this.dataset.headerFont && fp.body.name === this.dataset.bodyFont
        );
        if (fontPair == null) {
            console.error("Unable to set fonts!");
            return;
        }

        let headerFontVars = "";
        for (const size in fontPair.header.style) {
            for (const prop in fontPair.header.style[size]) {
                headerFontVars += `\n--header-font-${prop}-${size}: ${fontPair.header.style[size][prop]};`;
            }
        }

        let bodyFontVars = "";
        for (const size in fontPair.body.style) {
            for (const prop in fontPair.body.style[size]) {
                bodyFontVars += `\n--body-font-${prop}-${size}: ${fontPair.body.style[size][prop]};`;
            }
        }

        this._styleEl.textContent = `
@font-face {
  font-family: '${fontPair.header.name}';
  src: url('${fontPair.header.url}');
  font-display: swap;
}
@font-face {
  font-family: '${fontPair.body.name}';
  src: url('${fontPair.body.url}');
  font-display: swap;
}
:root {
  --header-font-family: '${fontPair.header.name}';
  ${headerFontVars}
  --body-font-family: '${fontPair.body.name}';
  ${bodyFontVars}
}
`;
    }

    attributeChangedCallback(name, _oldValue, _newValue) {
        if (name === "data-header-font" || name === "data-body-font") {
            this.render();
        }
    }
}
customElements.define(FontStyleElementName, FontStyle);

// ===== Modal (autonomous) =====
export class FontEditorModal extends AdminModal {
    actionText = "Update";
    headerText = "Pick Font Pairing";
    contentClass = "modal-content";

    connectedCallback() {
        this.fontStyle = getFontStyle();
        this.curHeaderFont = this.fontStyle?.dataset.headerFont;
        this.curBodyFont = this.fontStyle?.dataset.bodyFont;
        this.beforeCancel = () => {
            if (!this.fontStyle) return;
            this.fontStyle.dataset.headerFont = this.curHeaderFont;
            this.fontStyle.dataset.bodyFont = this.curBodyFont;
        };
        this.render();
    }

    getContent() {
        const content = document.createElement("div");
        content.classList.add("modal-content", "font-modal");

        for (let fontPair of this.fontStyle.fonts) {
            const card = document.createElement("div");
            const headerFont = fontPair.header.name;
            const bodyFont = fontPair.body.name;
            const selectedClass = "selected-font-pair";
            if (headerFont === this.fontStyle.dataset.headerFont && bodyFont === this.fontStyle.dataset.bodyFont) {
                card.classList.add(selectedClass);
            }
            card.classList.add("font-card");
            card.addEventListener("click", () => {
                this.fontStyle.dataset.headerFont = headerFont;
                this.fontStyle.dataset.bodyFont = bodyFont;
                for (const el of document.getElementsByClassName(selectedClass)) {
                    el.classList.remove(selectedClass);
                }
                card.classList.add(selectedClass);
            });
            card.innerHTML = `<h3 style="font-family: '${headerFont}';font-weight: ${fontPair.header.style.medium.weight};">${headerFont}</h3>
<p style="font-family: '${bodyFont}'; font-weight: ${fontPair.body.style.medium.weight};">${bodyFont}</p>
<p style="font-family: '${bodyFont}'; font-weight: ${fontPair.body.style.medium.weight};">${fontPair.description}</p>`;
            content.appendChild(card);
        }

        return content;
    }
}
customElements.define("font-editor-modal", FontEditorModal);

// ===== Edit Button (autonomous) =====
export const EditFontButtonName = "edit-fonts-button";
export class EditFontButton extends HTMLElement {
    buttonText = "Fonts";
    connectedCallback() {
        if (this._initialized) return;
        this._initialized = true;
        this.setAttribute("role", "button");
        this.tabIndex = 0;
        this.textContent = this.buttonText;

        const onActivate = () => {
            const fonts = ensureFontStyleSingleton(); // creates+appends if missing
            fonts.openFontEditor();
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

customElements.define(EditFontButtonName, EditFontButton);
