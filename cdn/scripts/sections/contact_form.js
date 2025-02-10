import { LOG } from '../utils/logger.js';

import { EditableSection } from "./base.js";
import { register, ELEMENT_NAMES } from "../element_registry.js";

export class ContactFormSection extends EditableSection { // startfold
  static elementName = "contact-form-section";
  static sectionName = "contact-form";

  classes = [
      "default",
      "alternate",
  ];

  defaultContent = [
    {
      "element": ELEMENT_NAMES.editableH2,
      "classes": ["section-heading"],
      "text": "CONTACT US",
    },
    {
      "element": ELEMENT_NAMES.editablePicture,
    },
    {
      "element": ELEMENT_NAMES.editableParagraph,
      "text": "Optional Text. Could be something about what to include in the message, or how long to wait for a response. Or it could just be a friendly sentence or two :)",
    },
    {
      "element": "raw",
      "content": `<form method="POST" action="/contact">
    <label for="name">Name</label>
    <input type="text" name="name" placeholder="Who am I speaking with?"></input>
    <label for="email">Email</label>
    <input type="email" name="email" placeholder="What's a good email to reach you at?"></input>
    <label for="message">Message</label>
    <textarea name="message" placeholder="What do you wanna talk about?"></textarea>
    <button type="submit">Send</button>
  </form>`
    },
  ]
  
  constructor() {
    super();
    try {
      this.editor.ensureDefaults();
      this.addSiteId();
    } catch (error) {
      LOG.error("Error in constructor of ContactFormSection: " + error.message);
    }
  }
  
  addSiteId() {
    try {
      const siteId = document.documentElement.dataset.siteId;
      const form = this.querySelector("form");
      const siteIdField = document.createElement("input");
      siteIdField.type = "hidden";
      siteIdField.name = "site-id";
      siteIdField.value = siteId;
      form.appendChild(siteIdField);
    } catch (error) {
      LOG.error("Error in addSiteId method of ContactFormSection: " + error.message);
    }
  }
}

try {
  register(ContactFormSection);
} catch (error) {
  LOG.error("Error registering ContactFormSection: " + error.message);
}
// endfold