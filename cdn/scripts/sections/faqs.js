import { EditableSection } from "./base.js";
import { register, ELEMENT_NAMES } from "../element_registry.js";

export class FAQsSection extends EditableSection { // startfold
  static elementName = "faqs-section";
  static sectionName = "faqs";
  static description = "This section provides answers to common queries that visitors may have about the business, products, or services. It helps to address potential concerns, clarify information, and improve the user experience by offering quick, accessible solutions."

  classes = [
      "default",
      "alternate",
  ];
    
  defaultContent = [
    {
      "element": ELEMENT_NAMES.editableH2,
      "classes": ["faqs-section-heading"],
      "text": "Frequently Asked Questions",
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
