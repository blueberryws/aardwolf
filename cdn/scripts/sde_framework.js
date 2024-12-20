import { ColorStyle } from "./colors/color_style.js";
import { FontStyle } from "./fonts/font_style.js";
import { EditableHead } from "./metadata/metadata_editor.js";
import { FaviconEditorModal } from "./favicon/favicon_editor.js";
import { EditPaletteButton } from "./colors/edit_palette_button.js";

import { SaveButton } from "./save/save_button.js";
import { ResetButton } from "./save/reset_button.js";

import { HeroSection } from "./sections/hero.js";
import { CallToActionSection } from "./sections/call_to_action.js";
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
