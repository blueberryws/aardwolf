export const REGISTRY = {};

// These are the keys to the REGISTRY for base elements.
// It acts as an interface for sections and their defaults to grab these.
export const ELEMENT_NAMES = {
    "unorderedList": "unordered-list",
    "listItem": "list-item",
    "detailsElement": "details-element",
    "summaryElement": "summary-element",

    "editableH1": "editable-h1",
    "editableH2": "editable-h2",
    "editableH3": "editable-h3",
    "editableH4": "editable-h4",
    "editableH5": "editable-h5",
    "editableH6": "editable-h6",
    "editableLinkButton": "editable-link-button",
    "editableListItem": "editable-list-item",
    "editablePicture": "editable-picture",
    "editableParagraph": "editable-paragraph",
    "editableIframe": "editable-iframe",
}

export const SECTIONS = {};

export function register(ElementType) {
    REGISTRY[ElementType.elementName] = ElementType; 
    customElements.define(ElementType.elementName, ElementType, {extends: ElementType.elementType});
    if (ElementType.sectionName != null) {
      SECTIONS[ElementType.sectionName] = ElementType;
    }
}
