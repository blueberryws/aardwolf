import { EditableSection } from "./base.js";
import { register, ELEMENT_NAMES } from "../element_registry.js";

export class AboutSection extends EditableSection { // startfold
  static elementName = "about-section";
  static sectionName = "about";

  classes = [
      "default",
      "alternate-one",
      "alternate-two",
      "alternate-three",
      "alternate-four",
      "alternate-five",
      "alternate-six",
      "alternate-seven",
      "alternate-eight",
      "alternate-nine",
      "alternate-ten",
  ];
    
  defaultContent = [
    {
      "element": ELEMENT_NAMES.editableH2,
      "text": "About Us",
    },
    {
      "element": ELEMENT_NAMES.editableParagraph,
      "text": "Details About You, Your Staff, Your Business. Anything can go here. There are a lot of layout options as well, so you can re-use this section multiple times if you have different things 'about' your business that you want to highlight. Different layouts have different 'optimal' lengths for text, so be sure to pick the one that matches how much descriptive text you have!",
    },
    {
      "element": ELEMENT_NAMES.unorderedList,
      "children": [
        {
          "element": ELEMENT_NAMES.editableListItem,
          "children": [
            {
              "element": ELEMENT_NAMES.editablePicture,
            },
            {
              "element": ELEMENT_NAMES.editableH3,
              "text": "Caption for picture, or high-level details about this bullet point",
            },
            {
              "element": ELEMENT_NAMES.editableParagraph,
              "text": "Descriptive Text or bullet point for the about section. This can be any length you need, just be sure to pick a layout that works for the text in this box!",
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
register(AboutSection);
// endfold
