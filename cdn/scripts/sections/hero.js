import { LOG } from '../utils/logger.js';

import { EditableSection } from "./base.js";
import { register, ELEMENT_NAMES } from "../element_registry.js";


export class HeroSection extends EditableSection { // startfold
  static elementName = "hero-section";
  static sectionName = "hero";

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
    super();
    try {
      this.editor.ensureDefaults();
      LOG.info("Defaults ensured for HeroSection");
    } catch (error) {
      LOG.error("Failed to ensure defaults in HeroSection: " + error.message);
    }
  };
} // endfold

try {
  register(HeroSection);
  LOG.info("HeroSection registered successfully");
} catch (error) {
  LOG.error("Failed to register HeroSection: " + error.message);
}