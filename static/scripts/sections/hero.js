import { EditableSection } from "./base.js";
import { 
    EditableH1,
    EditableH1Name,
    EditableH2,
    EditableH2Name
} from "../elements/editable_heading.js";
import { EditableParagraph } from "../elements/editable_paragraph.js";
import { EditableLinkButton } from "../elements/editable_link_button.js";
import { EditablePicture } from "../elements/editable_picture.js";

// Data Element
export const HeroSectionName = "hero-section";

export class HeroSection extends EditableSection { // startfold
  elementName = HeroSectionName;
  elementType = "section";

  defaultPageTitleText = "Page Title";
  defaultPageSubtitleText = "Page Subtitle";
  defaultPageDescriptionText = "Description of My Site";
  defaultButtonText = "BUTTON";

  constructor() { // startfold
    super();
    this.heirs = [
        this.getOrDefaultText(EditableH1, this.defaultPageTitleText),
        this.getOrDefaultText(EditableH2, this.defaultPageSubtitleText),
        this.getOrDefaultText(EditableParagraph, this.defaultPageDescriptionText),
        this.getOrDefault(EditableLinkButton),
        this.getOrDefault(EditablePicture),
    ]
    this.clean();
  } // endfold
}
customElements.define(HeroSectionName, HeroSection, {extends: "section"});
// endfold
