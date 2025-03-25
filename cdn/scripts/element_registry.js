import { LOGGER } from "./utils/logger.js";

export const REGISTRY = {};

// These are the keys to the REGISTRY for base elements.
// It acts as an interface for sections and their defaults to grab these.
export const ELEMENT_NAMES = {
    "unorderedList": "unordered-list",
    "listItem": "list-item",
    "detailsElement": "details-element",
    "summaryElement": "summary-element",
    "dialogElement": "dialog-element",
    "buttonElement": "button-element",
    "objectElement": "object-element",
    "figureElement": "figure-element",
    "blockquoteElement": "blockquote-element",
    "figcaptionElement": "figcaption-element",
    "image": "image-element",

    "editableH1": "editable-h1",
    "editableH2": "editable-h2",
    "editableH3": "editable-h3",
    "editableH4": "editable-h4",
    "editableH5": "editable-h5",
    "editableH6": "editable-h6",
    "editableLinkButton": "editable-link-button",
    "editableLinkModal": "editable-link-modal",
    "editableListItem": "editable-list-item",
    "editablePicture": "editable-picture",
    "editableParagraph": "editable-paragraph",
    "editableBlockquote": "editable-blockquote",
    "editableFigcaption": "editable-figcaption",
    "editableIframe": "editable-iframe",

    "imageAttributionSet": "image-attribution-set",
    "socialMediaLinks": "social-media-links",
}

export const SECTIONS = {};

export function register(ElementType) {
    LOGGER.debug(`Registering ${ElementType.elementName} as an extension of ElementType.elementType`); 
    REGISTRY[ElementType.elementName] = ElementType; 
    customElements.define(ElementType.elementName, ElementType, {extends: ElementType.elementType});
    LOGGER.debug(`${ElementType.elementName} registered successfully!`); 

    if (ElementType.sectionName != null) {
      LOGGER.debug(`Adding section ${ElementType.sectionName}`); 
      SECTIONS[ElementType.sectionName] = ElementType;
    }
}
