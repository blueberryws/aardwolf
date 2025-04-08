import { AdminModal } from "../modals/base.js";
// Data Element
export const FontStyleElementName = "font-style";
export function getFontStyle() {
    return document.querySelector(`style[is='${FontStyleElementName}']`)
}
const STANDARD_HEADER_STYLE = {
  "x-large": {
    size: "64px",
    weight: 400,
  },
  large: {
    size: "48px",
    weight: 400,
  },
  medium: {
    size: "32px",
    weight: 400,
  },
  small: {
    size: "20px",
    weight: 400,
  },
}
const STANDARD_BODY_STYLE = {
  large: {
    size: "24px",
    weight: 400,
  },
  medium: {
    size: "16px",
    weight: 400,
  },
  small: {
    size: "14px",
    weight: 400,
  },
}


export class FontStyle extends HTMLStyleElement { // startfold
  // This is how the component communicates with itself between edits.
  static observedAttributes = ["data-header-font", "data-body-font"];
  defaultHeaderFont = "Open Sans Condensed";
  defaultBodyFont = "Lora"

  userErrorMessage = "Unable to set fonts.\nIf this persists, please contact support."
  fonts = [  // startfold
    {
      header: {
          name: "Great Vibes",
          url: "/cdn/fonts/GreatVibes/GreatVibes-Regular.ttf",
          style: STANDARD_HEADER_STYLE,
      },
      body: {
          name: "Montserrat",
          url: "/cdn/fonts/Montserrat/Montserrat-VariableFont_wght.ttf",
          style: STANDARD_BODY_STYLE,
      },
      description: "Elegant, Inviting, Contemporary",
    },
    {
      header: {
          name: "Fjalla One",
          url: "/cdn/fonts/Fjalla_One/FjallaOne-Regular.ttf",
          style: STANDARD_HEADER_STYLE,
      },
      body: {
          name: "Nunito",
          url: "/cdn/fonts/Nunito/Nunito-VariableFont_wght.ttf",
          style: STANDARD_BODY_STYLE,
      },
      description: "Clean, Modern, Friendly",
    },
    {
      header: {
          name: "Raleway",
          url: "/cdn/fonts/Raleway/Raleway-VariableFont_wght.ttf",
          style: STANDARD_HEADER_STYLE,
      },
      body: {
          name: "Libre Baskerville",
          url: "/cdn/fonts/Libre_Baskerville/LibreBaskerville-Regular.ttf",
          style: STANDARD_BODY_STYLE,
      },
      description: "Bold, Elegant, Timeless",
    },
    {
      header: {
          name: "Quicksand",
          url: "/cdn/fonts/Quicksand/Quicksand-VariableFont_wght.ttf",
          style: STANDARD_HEADER_STYLE,
      },
      body: {
          name: "Source Sans",
          url: "/cdn/fonts/SourceSans/SourceSans3-VariableFont_wght.ttf",
          style: STANDARD_BODY_STYLE,
      },
      description: "Friendly, Modern, Approachable",
    },
    {
      header: {
          name: "Kalnia",
          url: "/cdn/fonts/Kalnia/Kalnia-VariableFont_wdth,wght.ttf",
          style: STANDARD_HEADER_STYLE,
      },
      body: {
          name: "Montserrat",
          url: "/cdn/fonts/Montserrat/Montserrat-VariableFont_wght.ttf",
          style: STANDARD_BODY_STYLE,
      },
      description: "Whimsical, Warm, Versitile",
    },
    {
      header: {
          name: "Oswald",
          url: "/cdn/fonts/Oswald/Oswald-VariableFont_wght.ttf",
          style: STANDARD_HEADER_STYLE,
      },
      body: {
          name: "Noto Serif",
          url: "/cdn/fonts/Noto_Serif/NotoSerif-VariableFont_wdth,wght.ttf",
          style: STANDARD_BODY_STYLE,
      },
      description: "Strong, Minimal, Classic",
    },
    {
      header: {
          name: "Playfair Display",
          url: "/cdn/fonts/Playfair_Display/PlayfairDisplay-VariableFont_wght.ttf",
          style: STANDARD_HEADER_STYLE,
      },
      body: {
          name: "Quattrocento Sans",
          url: "/cdn/fonts/Quattrocento_Sans/QuattrocentoSans-Regular.ttf",
          style: STANDARD_BODY_STYLE,
      },
      description: "Dramatic, Refined, Confident",
    },
    {
      header: {
          name: "Yellowtail",
          url: "/cdn/fonts/Yellowtail/Yellowtail-Regular.ttf",
          style: STANDARD_HEADER_STYLE,
      },
      body: {
          name: "Lato",
          url: "/cdn/fonts/Lato/Lato-Regular.ttf",
          style: STANDARD_BODY_STYLE,
      },
      description: "Dramatic, Refined, Confident",
    },
    {
      header: {
          name: "Bangers",
          url: "/cdn/fonts/Bangers/Bangers-Regular.ttf",
          style: STANDARD_HEADER_STYLE,
      },
      body: {
          name: "Montserrat",
          url: "/cdn/fonts/Montserrat/Montserrat-VariableFont_wght.ttf",
          style: STANDARD_BODY_STYLE,
      },
      description: "Bold, Energetic, Fun",
    },
    {
      header: {
          name: "Lora",
          url: "/cdn/fonts/Lora/Lora-VariableFont_wght.ttf",
          style: STANDARD_HEADER_STYLE,
      },
      body: {
          name: "Poppins",
          url: "/cdn/fonts/Poppins/Poppins-Regular.ttf",
          style: STANDARD_BODY_STYLE,
      },
      description: "Creative, Stylish, Balanced",
    },
    {
      header: {
          name: "Merriweather Sans",
          url: "/cdn/fonts/Merriweather_Sans/MerriweatherSans-VariableFont_wght.ttf",
          style: STANDARD_HEADER_STYLE,
      },
      body: {
          name: "Merriweather Italic",
          url: "/cdn/fonts/Merriweather/Merriweather-Italic.ttf",
          style: STANDARD_BODY_STYLE,
      },
      description: "Trustworthy, Professional, Thoughtful",
    },
    {
      header: {
          name: "Open Sans Condensed",
          url: "/cdn/fonts/Open_Sans/OpenSans-VariableFont_wdth,wght.ttf",
          style: STANDARD_HEADER_STYLE,
      },
      body: {
          name: "Lora",
          url: "/cdn/fonts/Lora/Lora-VariableFont_wght.ttf",
          style: STANDARD_BODY_STYLE,
      },
      description: "Sleek, Sophisticated, Versatile",
    },
  ] // endfold
  constructor() { // startfold
    super();
    this.ensureDefaults();
    this.render();
    const other = getFontStyle();
    if (other != null && other !== this) {
        throw(`There can only be ONE ${FontStyleElementName} element!`);
    }
  } // endfold
  openFontEditor() { // startfold
    const modal = new FontEditorModal();
    modal.showMe();
  } //endfold
  ensureDefaults() { // startfold
    // Create a default color palette, if one doesn't exist.
    if (this.dataset.headerFont == null) {
        this.dataset.headerFont = this.defaultHeaderFont;
    }
    if (this.dataset.bodyFont == null) {
        this.dataset.bodyFont = this.defaultBodyFont;
    }
  } // endfold
  render() { // startfold
    let fontPair = this.fonts.find((fp) => fp.header.name == this.dataset.headerFont && fp.body.name == this.dataset.bodyFont);
    if (fontPair == null) {
        console.error("Unable to set fonts!");
        return
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
    this.innerHTML = `
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
`
  } // endfold
  attributeChangedCallback(name, oldValue, newValue) { // startfold
    // Body font change comes second.
    if (name == "data-body-font") {
      this.render();
    }
  } // endfold
}
customElements.define(FontStyleElementName, FontStyle, {extends: "style"});
// endfold

export class FontEditorModal extends AdminModal { // startfold
  actionText = "Update";
  headerText = "Pick Font Pairing";
  contentClass = "modal-content";
  connectedCallback() { // startfold
    this.fontStyle = getFontStyle();
    this.curHeaderFont = this.fontStyle.dataset.headerFont;
    this.curBodyFont = this.fontStyle.dataset.bodyFont;
    this.beforeCancel = () => {
        this.fontStyle.dataset.headerFont = this.curHeaderFont;
        this.fontStyle.dataset.bodyFont = this.curBodyFont;
    };
    this.render();
  } // endfold
  getContent() { // startfold
    const content = document.createElement("div");
    content.classList.add("modal-content");
    content.classList.add("font-modal");

    for (let fontPair of this.fontStyle.fonts) {
        const card = document.createElement("div");
        const headerFont = fontPair.header.name;
        const bodyFont = fontPair.body.name;
        const selectedClass = "selected-font-pair";
        if (headerFont == this.fontStyle.dataset.headerFont && bodyFont == this.fontStyle.dataset.bodyFont) {
            card.classList.add(selectedClass);
        }
        card.classList.add("font-card");
        card.addEventListener("click", (e) => {
            this.fontStyle.dataset.headerFont = headerFont;
            this.fontStyle.dataset.bodyFont = bodyFont;
            for (const el of document.getElementsByClassName(selectedClass)) {
                el.classList.remove(selectedClass);
            };
            card.classList.add(selectedClass);
        });
        card.innerHTML = `<h3 style="font-family: '${headerFont}';font-weight: ${fontPair.header.style.medium.weight};">${headerFont}</h3>
  <p style="font-family: '${bodyFont}'; font-weight: ${fontPair.body.style.medium.weight};">${bodyFont}</p>
  <p style="font-family: '${bodyFont}'; font-weight: ${fontPair.body.style.medium.weight};">${fontPair.description}</p>
`
        if (this.fontStyle.dataset.headerFont == headerFont && this.fontStyle.dataset.bodyFont == bodyFont) {
          // Add selected class here.
        }
        content.appendChild(card);
    }

    return content
  } // endfold
} // endfold
customElements.define("font-editor-modal", FontEditorModal, {extends: "dialog"});

// Edit Button startfold
export const EditFontButtonName = "edit-fonts-button";
export class EditFontButton extends HTMLButtonElement {
    buttonText = "Fonts";
    constructor() {
        super();
        this.innerText = this.buttonText;
        const fonts = getFontStyle();
        this.addEventListener("click", fonts.openFontEditor);
    }
}

customElements.define(EditFontButtonName, EditFontButton, {extends: "button"});
// endfold
