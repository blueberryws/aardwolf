import { LOG } from '../utils/logger.js';

import { EditableSection } from "./base.js";
import { register, ELEMENT_NAMES } from "../element_registry.js";

export class GallerySection extends EditableSection { // startfold
  static elementName = "gallery-section";
  static sectionName = "gallery";

  classes = [
      "default",
      "alternate-one",
  ];

  defaultContent = [
    {
      "element": ELEMENT_NAMES.editableH2,
      "text": "Image Gallery",
    },
    {
      "element": ELEMENT_NAMES.buttonElement,
      "classes": ["previous-button"],
      "onclick": "prevItem(this)",
      "children": [
        {
          "element": ELEMENT_NAMES.objectElement,
          "data": "/cdn/assets/testimonial-arrow-left.svg",
          "type": "image/svg+xml",
          "onload": "loadSVG(this)",
        },
      ],
    },
    {
      "element": ELEMENT_NAMES.buttonElement,
      "classes": ["next-button"],
      "onclick": "nextItem(this)",
      "children": [
        {
          "element": ELEMENT_NAMES.objectElement,
          "data": "/cdn/assets/testimonial-arrow-right.svg",
          "type": "image/svg+xml",
          "onload": "loadSVG(this)",
        },
      ],

    },
    {
      "element": ELEMENT_NAMES.buttonElement,
      "classes": ["show-all"],
      "text": "See More",
      "onclick": "showAllGalleryImages(this)",
    },
    {
      "element": ELEMENT_NAMES.unorderedList,
      "children": [
        {
          "element": ELEMENT_NAMES.editableListItem,
          "classes": ["focus"],
          "children": [
            {
              "element": ELEMENT_NAMES.editablePicture,
            },
          ],
        },
      ],
    }
  ]
  constructor() {
    super();
    try {
      this.editor.ensureDefaults();
    } catch (error) {
      LOG.error(`Failed to ensure defaults in GallerySection constructor: ${error.message}`);
    }
  }
}

try {
  register(GallerySection);
} catch (error) {
  LOG.error(`Failed to register GallerySection: ${error.message}`);
}
// endfold