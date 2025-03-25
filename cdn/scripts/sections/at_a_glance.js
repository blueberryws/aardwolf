import { EditableSection } from "./base.js";
import { register, ELEMENT_NAMES } from "../element_registry.js";

export class AtAGlanceSection extends EditableSection { // startfold
  static elementName = "at-a-glance-section";
  static sectionName = "at-a-glance";
  static description = "An at-a-glance section on a website provides a quick, easy-to-scan summary of key information, such as features, benefits, or services. It's designed to give visitors an overview without overwhelming them."

  classes = [
      "default",
      "alternate-one",
      "alternate-two",
  ];

  defaultContent = [
    {
      "element": ELEMENT_NAMES.editableH2,
      "text": "AT A GLANCE",
    },
    {
      "element": ELEMENT_NAMES.unorderedList,
      "children": [
        {
          "element": ELEMENT_NAMES.listItem,
          "children": [
            {
              "element": ELEMENT_NAMES.editablePicture,
            },
            {
              "element": ELEMENT_NAMES.editableH3,
              "text": "Great Customer Service",
            },
          ],
        },
        {
          "element": ELEMENT_NAMES.listItem,
          "children": [
            {
              "element": ELEMENT_NAMES.editablePicture,
            },
            {
              "element": ELEMENT_NAMES.editableH3,
              "text": "Unmatched Value",
            },
          ],
        },
        {
          "element": ELEMENT_NAMES.listItem,
          "children": [
            {
              "element": ELEMENT_NAMES.editablePicture,
            },
            {
              "element": ELEMENT_NAMES.editableH3,
              "text": "Satisfaction Guarantee",
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
register(AtAGlanceSection);
// endfold
