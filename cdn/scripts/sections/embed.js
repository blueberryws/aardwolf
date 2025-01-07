import { EditableSection } from "./base.js";
import { register, ELEMENT_NAMES } from "../element_registry.js";

export class EmbedSection extends EditableSection { // startfold
  static elementName = "embed-section";
  static sectionName = "embed";

  classes = [
      "default",
      "alternate-one",
      "alternate-two",
      "alternate-three",
  ];

  defaultContent = [
    {
      "element": ELEMENT_NAMES.editableH2,
      "text": "Embedded Section Title",
    },
    {
      "element": ELEMENT_NAMES.editableParagraph,
      "text": "A one or two sentence bit (or maybe a whole paragraph) about what you're embedding. Maybe it's a calendar, and you need to call people to action and sign-up. Or maybe it's a YouTube video, and it's a moving speech about your process making the video.",
    },
    {
      "element": ELEMENT_NAMES.editableIframe,
    },
  ];
  constructor() {
    super()
    this.editor.ensureDefaults();
  };
} // endfold
register(EmbedSection);
