import { PictureEditor } from "../editors/picture_editor.js";
import { fromHTML } from "../utils/html.js";
import { register, ELEMENT_NAMES } from "../element_registry.js";

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
    this.img.src = src;
    this.appendChild(this.img);
  } // endfold

} // endfold
register(EditablePicture);
