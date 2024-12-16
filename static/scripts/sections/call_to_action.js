import { EditableSection } from "./base.js";
import { EditableSectionEditor } from "../editors/section_editor.js";
import { 
    EditableH2,
    EditableH3,
} from "../elements/editable_heading.js";
import { EditableParagraph } from "../elements/editable_paragraph.js";
import { EditableLinkButton } from "../elements/editable_link_button.js";
import { EditablePicture } from "../elements/editable_picture.js";

export function makeCallToAction() {
    const callToAction = new CallToActionSection();
    callToAction.editor.setEditable();
    callToAction.classList.add(callToAction.classes[0]);
    return callToAction;
}

// Data Element
export const CallToActionSectionName = "call-to-action-section";

export class CallToActionSection extends EditableSection { // startfold
  classes = ["default"];

  elementName = CallToActionSectionName;
  elementType = "section";

  defaultSectionTitleText = "Section Title Here";
  defaultSubsectionTitleText = "Subsection Title Here";
  defaultParagraphText = "Lorem Ipsum";
  defaultButtonText = "GO!";

  constructor() { // startfold
    super();
    this.editor = new EditableSectionEditor(this);
    this.setAttribute("is", CallToActionSectionName);
    this.heirs = [
        this.getOrDefaultText(EditableH2, this.defaultSectionTitleText),
        this.getOrDefaultText(EditableH3, this.defaultSubsectionTitleText),
        this.getOrDefaultText(EditableParagraph, this.defaultParagraphText),
        this.getOrDefault(EditableLinkButton),
        this.getOrDefault(EditablePicture),
    ]
    this.clean();
  } // endfold
}
customElements.define(CallToActionSectionName, CallToActionSection, {extends: "section"});
// endfold
