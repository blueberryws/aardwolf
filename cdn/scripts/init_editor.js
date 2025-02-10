import { LOG } from './utils/logger.js';

import { AdminAside } from "./admin/admin_aside.js";
import { SaveButton } from "./save/save_button.js";
import { ResetButton } from "./save/reset_button.js";

import { dispatch, SetDocumentEditable, UnsetDocumentEditable, SetLoading, UnsetLoading } from "./interfaces/events.js";
import { IS_LOCAL, GET_STORE } from "./globals.js";
import { modalBuilder } from "./modals/base.js";

export async function loadEditor() {
  try {
    dispatch(SetLoading);
    LOG.info("Loading editor...");

    const saveBtn = new SaveButton();
    const store = GET_STORE();
    
    if (IS_LOCAL()) {
      LOG.info("Running in local mode.");
      store.loadToDocument("head", () => dispatch(SetDocumentEditable));
      store.loadToDocument("main", () => dispatch(SetDocumentEditable));

      const resetBtn = new ResetButton();
      document.body.appendChild(resetBtn);
    } else {
      LOG.info("Running in cloud mode.");
      const sections = document.querySelectorAll("section");
      if (sections.length < 2) {
        store.loadSrc("main", (res) => {
          if (res != null) {
            const modal = modalBuilder()
              .setHeaderText("Load From Sandbox?")
              .contentHTML("<p>A sandbox site has been detected. Do you want to load the site from your sandbox?</p>")
              .setActionText("Load")
              .cancelFunc(() => {
                dispatch(SetDocumentEditable);
              })
              .actionFunc(() => {
                store.loadToDocument("head", () => {
                  store.loadToDocument("main", () => {
                    saveBtn.save();
                  });
                });
              })
              .showMe();
          } else {
            LOG.error("Failed to load from sandbox: response is null.");
          }
        });
      } else {
        dispatch(SetDocumentEditable);
      }
    }
    document.body.appendChild(saveBtn);

    const adminAside = new AdminAside();
    document.body.appendChild(adminAside);
    LOG.info("Editor loaded successfully.");
  } catch (error) {
    LOG.fatal("An error occurred while loading the editor: " + error.message);
  } finally {
    dispatch(UnsetLoading);
  }
}
