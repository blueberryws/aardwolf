import { EditableSection } from "./base.js";
import { EditableSectionEditor } from "../editors/section_editor.js";
import { 
    EditableH2,
    EditableH3,
} from "../elements/editable_heading.js";
import { EditableParagraph } from "../elements/editable_paragraph.js";
import { EditableListItem } from "../elements/editable_list_item.js";
import { EditableLinkButton } from "../elements/editable_link_button.js";
import { EditablePicture } from "../elements/editable_picture.js";

export function makeTestimonials() {
    const testimonials = new TestimonialsSection();
    testimonials.editor.setEditable();
    testimonials.classList.add(testimonials.classes[0]);
    return testimonials;
}

// Data Element
export const TestimonialsSectionName = "testimonials-section";

export class TestimonialsSection extends EditableSection { // startfold
    classes = ["default"];

    elementName = TestimonialsSectionName;
    elementType = "section";

    defaultSectionTitleText = "Section Title Here";
    defaultSubsectionTitleText = "Subsection Title Here";
    defaultParagraphText = "Lorem Ipsum";
    defaultButtonText = "GO!";

    constructor() { // startfold
        super();
        this.editor = new EditableSectionEditor(this);
        this.setAttribute("is", TestimonialsSectionName);
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
customElements.define(TestimonialsSectionName, TestimonialsSection, {extends: "section"});
// endfold
