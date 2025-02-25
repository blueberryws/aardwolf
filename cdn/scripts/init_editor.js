import { AdminAside } from "./admin/admin_aside.js";
import { SaveButton } from "./save/save_button.js";
import { ResetButton } from "./save/reset_button.js";

import { dispatch, SetDocumentEditable, UnsetDocumentEditable, SetLoading, UnsetLoading } from "./interfaces/events.js";
import { IS_LOCAL, GET_STORE } from "./globals.js";
import { modalBuilder } from "./modals/base.js";

import { LOGGER } from "./utils/logger.js";

// check for section deletions.
// which sections/layouts/font-pairings are being used
// color palettes (maybe luminosity checks??)
// accessibility checks on live sites


export async function loadEditor() {
  dispatch(SetLoading);

  const saveBtn = new SaveButton();
  const store = GET_STORE();
  if (IS_LOCAL()) {
    LOGGER.info("Loading from local...");
    store.loadToDocument("head", () => dispatch(SetDocumentEditable));
    store.loadToDocument("main", () => dispatch(SetDocumentEditable));

    const resetBtn = new ResetButton();
    document.body.appendChild(resetBtn);
  } else {
    LOGGER.info("Loading from cloud...");
    const sections = document.querySelectorAll("section");
    if (sections.length < 2) {
      store.loadSrc("main", (res) => {
        if (res != null) {
          LOGGER.info("Single section found, offering to load from sandbox.");
          const modal = modalBuilder()
              .setHeaderText("Load From Sandbox?")
              .contentHTML("<p>A sandbox site has been detected. Do you want to load the site from your sandbox?</p>")
              .setActionText("Load")
              .cancelFunc(() => {
                LOGGER.info("Skipped sandbox content");
                dispatch(SetDocumentEditable);
              })
              .actionFunc(() => {
                store.loadToDocument("head", () => {
                  store.loadToDocument("main", () => {
                    LOGGER.info("Loaded sandbox content");
                    saveBtn.save();
                  });
                });
              })
              .showMe();
        } else {
          LOGGER.info("No sandbox info found.");
        }
      });
    } else {
      dispatch(SetDocumentEditable);
    }
  }
  document.body.appendChild(saveBtn);

  const adminAside = new AdminAside();
  document.body.appendChild(adminAside);
}
