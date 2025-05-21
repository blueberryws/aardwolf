import { AdminAside } from "../admin/admin_aside.js";
import { SaveMenu } from "../save/save_menu.js";

import { dispatch, SetDocumentEditable, UnsetDocumentEditable, SetLoading, UnsetLoading } from "../interfaces/events.js";
import { IS_LOCAL, GET_STORE } from "../globals.js";
import { modalBuilder } from "../modals/base.js";

import { LOGGER } from "../utils/logger.js";

import { loadSectionsFromJSON } from "../utils/ai_integration.js";
import { StartupWizard } from "../wizards/welcome.js";
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
}


export async function loadEditor() { // startfold
  dispatch(SetLoading);

  const saveMenu = new SaveMenu();
  const store = GET_STORE();
  if (IS_LOCAL()) {
      loadLocal();
      dispatch(UnsetLoading);
  } else {
    LOGGER.info("Loading from cloud...");
    const sections = document.querySelectorAll("section");
    if (sections.length < 2) {
      new StartupWizard();
    } else {
      dispatch(SetDocumentEditable);
      dispatch(UnsetLoading);
    }
  }
//    if (sections.length < 2) {
//      store.loadSrc("main", (res) => {
//        if (res != null) {
//          LOGGER.info("Single section found, offering to load from sandbox.");
//          // TODO, this passes a "next modal" as a second arg.
//          showLoadSandboxModal(store);
//        } else {
//          LOGGER.info("No sandbox info found.");
//        }
//      });
//    } else {
//      dispatch(SetDocumentEditable);
//      dispatch(UnsetLoading);
//    }
//  }
  document.body.appendChild(saveMenu);

  const adminAside = new AdminAside();
  document.body.appendChild(adminAside);
  dispatch(UnsetLoading);
} // endfold

document.addEventListener(SetLoading, (e) => {
    showLoadingModal();
});
