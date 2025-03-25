import { AdminModal } from "../modals/base.js";
import { getColorStyle } from "./color_style.js";

  class ColorPaletteSelector extends HTMLLabelElement { // startfold
    static observedAttributes = ["data-colors", "checked"];
    groupName = "selected-palette";

    constructor() {
      super()
      this.addEventListener("click", () => this.handleClick());
      this.classList.add("color-palette");
    }

    handleClick() {
      const colorStyle = getColorStyle();
      colorStyle.dataset.palette = this.dataset.colors;
    }

    render() {
      const checked = this.hasAttribute("checked") ? "checked" : "";
      let html = `<input type="radio" name="${this.groupName}" value='${this.dataset.colors}' ${checked}></input>`;
      const colors = JSON.parse(this.dataset.colors);
      for (let color of colors) {
        html += `
<div style="background-color: ${color}"></div>
`
      }
      this.innerHTML = html;
    }

    connectedCallback() { 
      this.render();
    }

    attributeChangedCallback(name, oldValue, newValue) {
      this.render();
    }
  } // endfold
  customElements.define("color-palette-selector", ColorPaletteSelector, {extends: "label"});


export class ColorEditorModal extends AdminModal { // startfold
  actionText = "Update";
  headerText = "Set Colors";
  contentClass = "modal-content";
  connectedCallback() { // startfold
    this.classList.add("colors-modal");
    this.colorStyle = getColorStyle();
    this.currentPalette = JSON.parse(this.colorStyle.dataset.palette);
    this.curPrimaryColor = this.colorStyle.dataset.primaryColor;
    this.curSecondaryColor = this.colorStyle.dataset.secondaryColor;
    this.beforeCancel = () => {
        this.colorStyle.dataset.palette = JSON.stringify(this.currentPalette);
        this.colorStyle.dataset.primaryColor= this.curPrimaryColor;
        this.colorStyle.dataset.secondaryColor = this.curSecondaryColor;
    };
    this.render();
  } // endfold
  makeSelectors() { // startfold
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
    secondaryInput.value = this.colorStyle.dataset.secondaryColor;
    secondaryInput.type = "color";
    secondaryInput.addEventListener("change", (e) => {
        this.colorStyle.dataset.secondaryColor = e.target.value;
        this.render();
    });
    selectors.appendChild(secondaryInput);

    return selectors
  } // endfold
  getInstructions() { // startfold
    const instructions = document.createElement("details");
    instructions.innerHTML = `
    <summary>How To Set Colors</summary>
    <ol>
        <li>Click the Color Selector for "Primary Color" To Pick Your Primary Color</li>
        <li>Click the Color Selector for "Secondary Color" To Pick Your Secondary Color</li>
        <li>Pick from one of the generated color palettes.</li>
    </ol>
    <p>Note: The color palettes are generated using the secondary color. The primary color is used directly across the site.
`
    return instructions;
  } // endfold
  getContent() { // startfold
    const content = document.createElement("div");
    content.classList.add(this.contentClass);
    
    content.appendChild(this.makeSelectors());

    const currentPaletteData = JSON.parse(this.colorStyle.dataset.palette);
    const currentPalette = new ColorPaletteSelector();
    currentPalette.classList.add("current-palette");
    currentPalette.dataset.colors = JSON.stringify(currentPaletteData);
    currentPalette.setAttribute("checked", true);
    content.appendChild(currentPalette);

    const prospectivePaletteChoices = this.colorStyle.generatePaletteChoices();
    const prospectivePalettes = document.createElement("div");
    prospectivePalettes.classList.add("prospective-palettes");
    for (let pc of prospectivePaletteChoices) {
        let prospectivePalette = new ColorPaletteSelector();
        prospectivePalette.dataset.colors = JSON.stringify(pc);
        prospectivePalettes.appendChild(prospectivePalette);
    }
    content.appendChild(prospectivePalettes);

    return content
  } // endfold
} // endfold
customElements.define("color-editor-modal", ColorEditorModal, {extends: "dialog"});
