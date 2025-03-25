import { EditableSection } from "./base.js";
import { register, ELEMENT_NAMES } from "../element_registry.js";

export class GallerySection extends EditableSection { // startfold
  static elementName = "gallery-section";
  static sectionName = "gallery";
  static description = "This section displays a collection of images to showcasing products, services, past work, or events. It allows visitors to visually explore your offerings or portfolio."

  classes = [
      "default",
      "alternate-one",
      "alternate-two",
  ];

  defaultContent = [
    {
      "element": ELEMENT_NAMES.editableH2,
      "text": "Image Gallery",
    },
    {
      "element": ELEMENT_NAMES.buttonElement,
      "classes": ["previous-button"],
      "aria-label": "Show previous image",
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
      "aria-label": "Show next image",
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
    this.editor.ensureDefaults();
  }
}
register(GallerySection);
// endfold
