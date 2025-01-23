import { ColorStyle } from "./colors/color_style.js";
import { FontStyle } from "./fonts/font_style.js";
import { EditableHead } from "./metadata/metadata_editor.js";
import { FaviconEditorModal } from "./favicon/favicon_editor.js";
import { EditPaletteButton } from "./colors/edit_palette_button.js";

import { SaveButton } from "./save/save_button.js";
import { ResetButton } from "./save/reset_button.js";

import { UnorderedList, ListItem, DialogElement, ButtonElement, ObjectElement, FigureElement, BlockquoteElement, FigcaptionElement } from "./elements/generics.js";
import { EditableH1, EditableH2, EditableH3, EditableH4, EditableH5, EditableH6 } from "./elements/editable_heading.js";
import { EditableLinkButton } from "./elements/editable_link_button.js";
import { EditableLinkModal } from "./elements/editable_link_modal.js";
import { EditableListItem } from "./elements/editable_list_item.js";
import { EditablePicture } from "./elements/editable_picture.js";
import { EditableParagraph, EditableBlockquote, EditableFigcaption } from "./elements/editable_paragraph.js";
import { EditableIframe } from "./elements/editable_iframe.js"; 
import { ImageAttributionSet } from "./elements/image_attribution_set.js"; 

import { HeroSection } from "./sections/hero.js";
import { AboutSection } from "./sections/about.js";
import { CallToActionSection } from "./sections/call_to_action.js";
import { GallerySection } from "./sections/gallery.js";
import { EmbedSection } from "./sections/embed.js";
import { NumbersSection } from "./sections/numbers.js";
import { MoreInformationSection } from "./sections/more_information.js";
import { HoursSection } from "./sections/hours.js";
import { AtAGlanceSection } from "./sections/at_a_glance.js";
import { FAQsSection } from "./sections/faqs.js";
import { ContactFormSection } from "./sections/contact_form.js";
import { FooterSection } from "./sections/footer.js";
import { TestimonialsSection } from "./sections/testimonials.js";

import { AdminAside } from "./admin/admin_aside.js";

import { EditableSectionEditor } from "./editors/section_editor.js";

import { dispatch, SetDocumentEditable, UnsetDocumentEditable } from "./interfaces/events.js";
import { IS_LOCAL, GET_STORE } from "./globals.js";


const saveBtn = new SaveButton();
const resetBtn = new ResetButton();
const adminAside = new AdminAside();
if (IS_LOCAL()) {
  const store = GET_STORE();
  store.loadSrc("main", (res) => {
    if (res != null) {
        const main = document.querySelector("main");
        dispatch(UnsetDocumentEditable);
        main.outerHTML = res.src;
        dispatch(SetDocumentEditable);
    }
  });
  store.loadSrc("head", (res) => {
    if (res != null) {
        const head = document.querySelector("head");
        dispatch(UnsetDocumentEditable);
        head.outerHTML = res.src;
        dispatch(SetDocumentEditable);
    }
  });
  document.body.appendChild(resetBtn);
}
dispatch(SetDocumentEditable);

document.body.appendChild(saveBtn);
document.body.appendChild(adminAside);
