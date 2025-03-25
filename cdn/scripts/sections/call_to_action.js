import { EditableSection } from "./base.js";
import { register, ELEMENT_NAMES } from "../element_registry.js";

export class CallToActionSection extends EditableSection { // startfold
  classes = [
    "default",
//    "alternate-one",
    "alternate-two",
    "alternate-three",
    "alternate-four",
    "alternate-five",
    "alternate-six",
    "alternate-seven",
  ];

  static elementName = "call-to-action-section";
  static sectionName = "call-to-action";
  static description = "A call-to-action (CTA) section on a website prompts visitors to take a specific action, such as signing up, purchasing, or contacting the business. It features a clear, compelling message paired with a button or link that directs users toward the desired next step."

  defaultContent = [
    {
      "element": ELEMENT_NAMES.editableH2,
      "text": "Section Title Here",
    },
    {
      "element": ELEMENT_NAMES.editablePicture,
    },
    {
      "element": ELEMENT_NAMES.editableH3,
      "text": "Subsection Title Here",
    },
    {
      "element": ELEMENT_NAMES.editableParagraph,
      "text": "A one-or-two sentence blurb about your or your business",
    },
    {
      "element": ELEMENT_NAMES.editableLinkButton,
    },
    {
      "element": ELEMENT_NAMES.editablePicture,
    },
  ];
  constructor() {
    super()
    this.editor.ensureDefaults();
  };
}
register(CallToActionSection);
// endfold
