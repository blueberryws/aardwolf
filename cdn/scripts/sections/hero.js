import { EditableSection } from "./base.js";
import { register, ELEMENT_NAMES } from "../element_registry.js";


export class HeroSection extends EditableSection { // startfold
  static elementName = "hero-section";
  static sectionName = "hero";
  static description = "The prominent area at the top of the page that features a large image, or graphic along with a headline and call-to-action. It's designed to grab attention, communicate the core message of the site, and encourage visitors to engage further with the content.";

  classes = [
      "default",
      "alternate-one",
      "alternate-two",
      "alternate-three",
      "alternate-four",
      "alternate-five",
  ];

  defaultContent = [
    {
      "element": ELEMENT_NAMES.editableH1,
      "text": "Page Title Here",
    },
    {
      "element": ELEMENT_NAMES.editableH2,
      "text": "Tagline or Callout Text",
    },
    {
      "element": ELEMENT_NAMES.editableParagraph,
      "text": "A one-or-two sentence blurb about your or your business",
    },
    {
      "element": ELEMENT_NAMES.editablePicture,
    },
    {
      "element": ELEMENT_NAMES.editableLinkButton,
    },
  ];
  constructor() {
    super()
    this.editor.ensureDefaults();
  };
} // endfold

register(HeroSection);
