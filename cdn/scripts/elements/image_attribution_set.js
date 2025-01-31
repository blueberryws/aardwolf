import { TextEditor } from "../editors/text_editor.js";
import { register, ELEMENT_NAMES } from "../element_registry.js";
import { ImageSetChanged } from "../interfaces/events.js";

export class ImageAttributionSet extends HTMLUListElement { // startfold
  // TODO
  static elementName = ELEMENT_NAMES.imageAttributionSet;
  static elementType = "ul"

  constructor() { // startfold
    super();
    this.setAttribute("is", ImageAttributionSet.elementName);

    document.addEventListener(ImageSetChanged, () => this.render());

    this.render();
  } // endfold
  render() {
    const pictures = document.querySelectorAll("picture");
    this.innerHTML = "";
    const li = document.createElement("li");
    li.innerHTML = "<p>Photos via Pexels.com and</p>";
    this.appendChild(li);
    for (const pic of pictures) {
      const li = document.createElement("li");
      const attr = document.createElement("a");
      attr.href = pic.dataset.attributionHref;
      attr.innerText = pic.dataset.attributionText;
      attr.target = "_blank";
      attr.rel = "noopener noreferrer";
      li.appendChild(attr);
      this.appendChild(li);
    }
  }
} // endfold

register(ImageAttributionSet);
