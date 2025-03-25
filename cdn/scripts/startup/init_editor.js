import { AdminAside } from "../admin/admin_aside.js";
import { SaveButton } from "../save/save_button.js";
import { ResetButton } from "../save/reset_button.js";

import { dispatch, SetDocumentEditable, UnsetDocumentEditable, SetLoading, UnsetLoading } from "../interfaces/events.js";
import { IS_LOCAL, GET_STORE } from "../globals.js";
import { modalBuilder } from "../modals/base.js";

import { LOGGER } from "../utils/logger.js";

import { loadSectionsFromJSON } from "../utils/ai_integration.js";
import { showWelcomeModal } from "../modals/welcome.js";
import { showLoadingModal } from "../modals/loading.js";
import { showLoadSandboxModal } from "../modals/load_sandbox.js";

// check for section deletions.
// which sections/layouts/font-pairings are being used
// color palettes (maybe luminosity checks??)
// accessibility checks on live sites

function loadLocal() {
    LOGGER.info("Loading from local...");
    store.loadToDocument("head", () => dispatch(SetDocumentEditable));
    store.loadToDocument("main", () => dispatch(SetDocumentEditable));

    const resetBtn = new ResetButton();
    document.body.appendChild(resetBtn);
}


export async function loadEditor() { // startfold
  dispatch(SetLoading);

  const saveBtn = new SaveButton();
  const store = GET_STORE();
  if (IS_LOCAL()) {
      loadLocal();
      dispatch(UnsetLoading);
  } else {
    LOGGER.info("Loading from cloud...");
    const sections = document.querySelectorAll("section");
    if (sections.length < 2) {
      store.loadSrc("main", (res) => {
        if (res != null) {
          LOGGER.info("Single section found, offering to load from sandbox.");
          showLoadSandboxModal(store, showWelcomeModal);
        } else {
          showWelcomeModal();
          LOGGER.info("No sandbox info found.");
        }
      });
    } else {
      dispatch(SetDocumentEditable);
      dispatch(UnsetLoading);
    }
  }
  document.body.appendChild(saveBtn);

  const adminAside = new AdminAside();
  document.body.appendChild(adminAside);
  dispatch(UnsetLoading);
} // endfold

document.addEventListener(SetLoading, (e) => {
    showLoadingModal();
});
