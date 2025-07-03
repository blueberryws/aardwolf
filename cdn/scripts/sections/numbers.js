import { EditableSection } from "./base.js";
import { register, ELEMENT_NAMES } from "../element_registry.js";

export class NumbersSection extends EditableSection { // startfold
  static elementName = "numbers-section";
  static sectionName = "numbers";
  static description = "The numbers section on a website highlights key statistics that demonstrate the success, impact, or credibility of a business or service.";

  classes = [
      "default",
      "alternate-one",
  ];

  defaultContent = [
    {
      "element": ELEMENT_NAMES.editableH2,
      "text": "NUMBERS DON'T LIE",
    },
    {
      "element": ELEMENT_NAMES.unorderedList,
      "children": [
        {
          "element": ELEMENT_NAMES.listItem,
          "children": [
            {
              "element": ELEMENT_NAMES.editableH3,
              "text": "<2%",
            },
            {
              "element": ELEMENT_NAMES.editableH4,
              "text": "Return Rate",
            },
          ],
        },
        {
          "element": ELEMENT_NAMES.listItem,
          "children": [
            {
              "element": ELEMENT_NAMES.editableH3,
              "text": "500",
            },
            {
              "element": ELEMENT_NAMES.editableH4,
              "text": "Customers Served This Month",
            },
          ],
        },
        {
          "element": ELEMENT_NAMES.listItem,
          "children": [
            {
              "element": ELEMENT_NAMES.editableH3,
              "text": "$25,000",
            },
            {
              "element": ELEMENT_NAMES.editableH4,
              "text": "That we saved our customers this quarter.",
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
register(NumbersSection);
// endfold
