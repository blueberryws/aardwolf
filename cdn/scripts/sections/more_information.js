import { LOG } from '../utils/logger.js';

import { EditableSection } from "./base.js";
import { register, ELEMENT_NAMES } from "../element_registry.js";


export class MoreInformationSection extends EditableSection { // startfold
  static elementName = "more-information-section";
  static sectionName = "more-information";

  classes = [
      "default",
      "alternate-one",
      "alternate-two",
      "alternate-three",
  ];

  defaultContent = [
    {
      "element": ELEMENT_NAMES.editableH2,
      "text": "More Information",
    },
    {
      "element": ELEMENT_NAMES.editablePicture,
    },
    {
      "element": ELEMENT_NAMES.editableParagraph,
      "text": "A paragraph or two of additional information that you'd like your users/customers/clients to know. This could be anything from refund information to a personal bio or manifesto. Maybe you could put your personal philosophy about how your approach your business.",
    },
  ];
  constructor() {
    super();
    try {
      this.editor.ensureDefaults();
      LOG.info("Ensure defaults executed successfully in MoreInformationSection constructor.");
    } catch (error) {
      LOG.error("Failed to ensure defaults in MoreInformationSection constructor: " + error.message);
    }
  };
} // endfold

try {
  register(MoreInformationSection);
  LOG.info("MoreInformationSection registered successfully.");
} catch (error) {
  LOG.error("Failed to register MoreInformationSection: " + error.message);
}