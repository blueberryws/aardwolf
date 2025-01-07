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
      "content": `<form>
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
    this.editor.ensureDefaults();
  }
}
register(ContactFormSection);
// endfold
