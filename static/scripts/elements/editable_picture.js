import { PictureEditor } from "../editors/picture_editor.js";

// Data Element
export const EditablePictureName = "editable-picture";

export class EditablePicture extends HTMLPictureElement { // startfold
  static observedAttributes = ["data-alt-text", "data-attribution-text", "data-attribution-href", "data-img-src"]
  elementName = "editable-picture"
  elementType = "picture"

  defaultImgSrc = "/static/images/default.png"
  defaultAltText = "A mountain silhouette placeholder image"
  defaultAttributionText = "Photo Credit: Flanoz, CC0, via Wikimedia Commons"
  defaultAttributionHref = "https://commons.wikimedia.org/wiki/File:Placeholder_view_vector.svg"
  defaultBackgroundColor = "#888888"


  constructor() { // startfold
    super();

    // Set some defaults
    if (this.dataset.imgSrc == null) {this.dataset.imgSrc = this.defaultImgSrc}
    if (this.dataset.altText == null) {this.dataset.altText = this.defaultAltText}
    if (this.dataset.attributionText == null) {this.dataset.attributionText = this.defaultAttributionText }
    if (this.dataset.attributionHref== null) {this.dataset.attributionHref = this.defaultAttributionHref}
    if (this.id == null) {this.id = crypto.randomUUID()}
    this.editor = new PictureEditor(this);

  } // endfold
  connectedCallback() { // startfold
    this.render();
  } // endfold
  render() { // startfold
    this.innerHTML = `
  <source srcset="${this.dataset.imgSrc}" media="(min-width: 1400px)" class="xx-large-image">
  <source srcset="${this.dataset.imgSrc}" media="(min-width: 1200px)" class="x-large-image">
  <source srcset="${this.dataset.imgSrc}" media="(min-width: 992px)" class="large-image">
  <source srcset="${this.dataset.imgSrc}" media="(min-width: 768px)" class="medium-image">
  <source srcset="${this.dataset.imgSrc}" media="(min-width: 576px)" class="small-image">
  <source srcset="${this.dataset.imgSrc}" media="(max-width: 575px)" class="x-small-image">
  <img src="${this.dataset.imgSrc}" alt="${this.dataset.altText}" style="background-color: ${this.dataset.backgroundColor}">
  <a href="${this.dataset.attributionHref}">${this.dataset.attributionText}</a>`
  } // endfold
  attributeChangedCallback(name, oldValue, newValue) {
  // if the changed attr is imgSrc:
  // - bust the cache
    this.render()
  }

} // endfold

customElements.define(EditablePictureName, EditablePicture, {extends: "picture"});
