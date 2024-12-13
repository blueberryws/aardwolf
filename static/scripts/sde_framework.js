import { ColorStyle } from "./colors/color_style.js";
import { EditPaletteButton } from "./colors/edit_palette_button.js";
import { SaveButton } from "./save/save_button.js";
import { ResetButton } from "./save/reset_button.js";
import { dispatch, SetDocumentEditable, UnsetDocumentEditable } from "./interfaces/events.js";
import { IS_LOCAL, GET_STORE } from "./globals.js";

const saveBtn = new SaveButton();
const resetBtn = new ResetButton();
if (IS_LOCAL) {
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
