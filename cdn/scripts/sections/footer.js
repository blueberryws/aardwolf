import { EditableSection } from "./base.js";
import { register, ELEMENT_NAMES } from "../element_registry.js";

export class FooterSection extends EditableSection { // startfold
  static elementName = "footer-section";
  static sectionName = "footer";

  classes = [
      "default",
  ];

  defaultContent = [
    {
        "element": ELEMENT_NAMES.editablePicture,
    },
    {
        "element": ELEMENT_NAMES.editableParagraph,
        "text": "Follow Us On Social Media",
    },
    {
        "element": ELEMENT_NAMES.socialMediaLinks,
    },
    { // startfold Privacy Policy
      "element": ELEMENT_NAMES.editableLinkModal,
      "text": "Privacy Policy",
      "children": [
        {
          "element": ELEMENT_NAMES.dialogElement,
          "children": [
            {
                "element": ELEMENT_NAMES.editableH2,
                "text": "Privacy Policy",
            },
            {
                "element": ELEMENT_NAMES.editableParagraph,
                "text": "Privacy Policy",
            },
          ],
        },
      ],
    }, // endfold
    {  // startfold Terms of Service
      "element": ELEMENT_NAMES.editableLinkModal,
      "text": "Terms of Service",
      "children": [
        {
          "element": ELEMENT_NAMES.dialogElement,
          "children": [
            {
                "element": ELEMENT_NAMES.editableH2,
                "text": "Terms of Service",
            },
            {
                "element": ELEMENT_NAMES.editableParagraph,
                "text": "Terms of Service",
            },
          ],
        },
      ],
    }, // endfold
    { // startfold Accessibility Statement
      "element": ELEMENT_NAMES.editableLinkModal,
      "text": "Accessibility Statement",
      "children": [
        {
          "element": ELEMENT_NAMES.dialogElement,
          "children": [
            {
                "element": ELEMENT_NAMES.editableH2,
                "text": "Accessibility Statement",
            },
            {
                "element": ELEMENT_NAMES.editableParagraph,
                "text": "Accessibility Statement",
            },
          ],
        },
      ],
    }, // endfold
    {
      "element": ELEMENT_NAMES.imageAttributionSet,
    },
  ]
  constructor() {
    super();
    this.editor.ensureDefaults();
  }
}
register(FooterSection);
// endfold
