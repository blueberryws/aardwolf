import { PictureEditor } from "../editors/picture_editor.js";
import { fromHTML } from "../utils/html.js";
import { register, ELEMENT_NAMES } from "../element_registry.js";
import { breakpoints } from "../interfaces/breakpoints.js";

import { dispatch, ImageSetChanged } from "../interfaces/events.js";
import { CLEANABLE_ATTR } from "../interfaces/selectors.js";

export class EditablePicture extends HTMLPictureElement { // startfold
  static observedAttributes = ["data-attribution-text", "data-attribution-href"]
  static elementName = ELEMENT_NAMES.editablePicture;
  static elementType = "picture"

  defaultImgSrc = "/cdn/images/default.png"
  defaultAltText = "A mountain silhouette placeholder image"
  defaultAttributionText = "Photo Credit: Flanoz, CC0, via Wikimedia Commons"
  defaultAttributionHref = "https://commons.wikimedia.org/wiki/File:Placeholder_view_vector.svg"


  constructor() { // startfold
    super();
    this.setAttribute("is", EditablePicture.elementName);
    this.setAttribute(`data-${CLEANABLE_ATTR}`, true);

    // Set some defaults
    if (this.dataset.attributionText == null) {this.dataset.attributionText = this.defaultAttributionText }
    if (this.dataset.attributionHref== null) {this.dataset.attributionHref = this.defaultAttributionHref}
    this.handleSrcChange = () => this.clearSources();
    this.img = this.querySelector("img");
    if (this.img == null) {
        this.img = fromHTML(`<img src="${this.defaultImgSrc}" alt="${this.defaultAltText}">`);
        this.appendChild(this.img);
    }
    if (this.id == null) {this.id = crypto.randomUUID()}
    this.editor = new PictureEditor(this);
  } // endfold
  setSrc(src) { // startfold
    this.innerHTML = "";
    const originalSrc = this.img.src;


    for (const [key, val] of Object.entries(breakpoints)) {
      const sourceElement = document.createElement("source");
      sourceElement.classList.add(key);
      this.appendChild(sourceElement);
      sourceElement.setAttribute("media", `(min-width: ${val})`);
    
      const computedStyle = window.getComputedStyle(sourceElement);
      const calculatedWidth = parseInt(computedStyle.getPropertyValue("max-width")) || 0;;
      const calculatedHeight = parseInt(computedStyle.getPropertyValue("max-height")) || 0;
    
      sourceElement.setAttribute("data-max-width", calculatedWidth);
      sourceElement.setAttribute("data-max-height", calculatedHeight);
    }
    this.img.src = src;
    this.appendChild(this.img);
    if (originalSrc != src) { 
        this.editor.newId();
        console.log(this.dataset.uuid);
        this.editor.uploadSrc();
    } else {
        this.editor.uploadLayout();
    }
  } // endfold

  attributeChangedCallback(name, oldValue, newValue) {
    dispatch(ImageSetChanged);
  }

} // endfold
register(EditablePicture);
