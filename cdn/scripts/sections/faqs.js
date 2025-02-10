import { LOG } from '../utils/logger.js';

import { EditableSection } from "./base.js";
import { register, ELEMENT_NAMES } from "../element_registry.js";

export class FAQsSection extends EditableSection { // startfold
  static elementName = "faqs-section";
  static sectionName = "faqs";

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
    try {
      this.editor.ensureDefaults();
      LOG.info("Default values ensured for FAQsSection.");
    } catch (error) {
      LOG.error("Error ensuring default values in FAQsSection constructor: " + error.message);
    }
  }
}
try {
  register(FAQsSection);
  LOG.info("FAQsSection registered successfully.");
} catch (error) {
  LOG.error("Error registering FAQsSection: " + error.message);
}
// endfold