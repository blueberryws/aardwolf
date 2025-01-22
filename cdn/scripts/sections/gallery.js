import { EditableSection } from "./base.js";
import { register, ELEMENT_NAMES } from "../element_registry.js";

export class GallerySection extends EditableSection { // startfold
  static elementName = "gallery-section";
  static sectionName = "gallery";

  classes = [
      "default",
      "alternate-one",
  ];

  <h2 is="editable-h2" class="section-heading">Image Gallery</h2>
  <button class="previous-button" onclick="prevItem(this)">
    <object data="/cdn/assets/testimonial-arrow-left.svg" type="image/svg+xml" onload="loadSVG(this)"></object>
  </button>
  <button class="next-button" onclick="nextItem(this)">
    <object data="/cdn/assets/testimonial-arrow-right.svg" type="image/svg+xml" onload="loadSVG(this)"></object>
  </button>
  <button class="show-all" onclick="showAllGalleryImages(this)">See More</button>

  <ul>
    <li class="focus">
      <picture is="editable-picture">
        <img src="/cdn/images/default.png">
      </picture>
    </li>

    
  defaultContent = [
    {
      "element": ELEMENT_NAMES.editableH2,
      "text": "Image Gallery",
    },
    {
      "element": ELEMENT_NAMES.unorderedList,
      "classes": ["faqs"],
      "children": [
        {
          "element": ELEMENT_NAMES.editableListItem,
          "classes": ["faq-list-item"],
          "children": [
            {
              "element": ELEMENT_NAMES.detailsElement,
              "classes": ["faq-container"],
              "children": [
                {
                  "element": ELEMENT_NAMES.summaryElement,
                  "classes": ["question"],
                  "children": [
                    {
                      "element": ELEMENT_NAMES.editableH3,
                      "classes": ["question-text"],
                      "text": "Question Number One",
                    },
                  ],
                },
                {
                  "element": ELEMENT_NAMES.editableParagraph,
                  "classes": ["answer"],
                  "text": "The answer to the question. This could be as long or short as you need.",
                },
              ],
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
register(FAQsSection);
// endfold
