import { EditableSection } from "./base.js";
import { register, ELEMENT_NAMES } from "../element_registry.js";

export class TestimonialsSection extends EditableSection { // startfold
  static elementName = "testimonials-section";
  static sectionName = "testimonials";
  static description = "This section showcases feedback from satisfied customers or clients, highlighting their positive experiences. It includes quotes, names, and optionally photos, aiming to build trust and credibility with potential customers."

  classes = [
      "default",
      "alternate-one",
      "alternate-two",
      "alternate-four",
  ];

  defaultContent = [
    {
      "element": ELEMENT_NAMES.editableH2,
      "text": "REVIEWS",
    },
    {
      "element": ELEMENT_NAMES.unorderedList,
      "classes": ["testimonials"],
      "children": [
        {
          "element": ELEMENT_NAMES.editableListItem,
          "classes": ["testimonials-content", "focus"],
          "children": [
            {
              "element": ELEMENT_NAMES.editablePicture,
              "classes": ["testimonials-attribution-picture"],
            },
            { // figure
              "element": ELEMENT_NAMES.figureElement,
              "children": [
                {
                  "element": ELEMENT_NAMES.editableBlockquote,
                  "classes": ["testimonial-text"],
                  "text": "A review or testimonials about how wonderful your products and services are from a happy customer.",
                },
                {
                  "element": ELEMENT_NAMES.editableFigcaption,
                  "classes": ["testimonial-attribution"],
                  "text": "Name of Reviewer",
                },
              ],
            },
            {
              "element": ELEMENT_NAMES.objectElement,
              "type": "image/svg+xml",
              "onload": "loadSVG(this)",
              "data": "/cdn/assets/five-stars.svg",
            },
          ],
        },
      ],
    },
    {
      "element": ELEMENT_NAMES.buttonElement,
      "classes": ["previous-button"],
      "aria-label": "Show previous testimonial",
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
      "aria-label": "Show next testimonial",
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
  ]
  constructor() {
    super();
    this.editor.ensureDefaults();
  }
}
register(TestimonialsSection);
// endfold
