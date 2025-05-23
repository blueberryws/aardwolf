import { EditableSection } from "./base.js";
import { register, ELEMENT_NAMES } from "../element_registry.js";

export class HoursSection extends EditableSection { // startfold
  static elementName = "hours-section";
  static sectionName = "hours";
  static description = "The hours section displays the hours of operation when you are open and available to customers. It typically includes the days of the week and specific opening and closing times, making it easy for visitors to know when they can reach you."

  classes = [
      "default",
      "alternate",
  ];

  defaultContent = [
    {
      "element": ELEMENT_NAMES.editableH2,
      "classes": ["section-heading"],
      "text": "BUSINESS HOURS",
    },
    {
      "element": ELEMENT_NAMES.unorderedList,
      "children": [
        {
          "element": ELEMENT_NAMES.editableListItem,
          "children": [
            {
              "element": ELEMENT_NAMES.editableParagraph,
              "classes": ["day"],
              "text": "Monday-Friday",
            },
            {
              "element": ELEMENT_NAMES.editableParagraph,
              "classes": ["time"],
              "text": "9:00am-5:00pm",
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
register(HoursSection);
// endfold
