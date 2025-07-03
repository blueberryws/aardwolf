import { modalBuilder } from "./base.js";
import { LOGGER } from "../utils/logger.js";

const CONTENT = `
<p>A sandbox site has been detected. Do you want to load the site from your sandbox?</p>
`

export function showLoadSandboxModal(store, nextModal) {
    const modal = modalBuilder()
        .setHeaderText("Load From Sandbox?")
        .contentHTML(CONTENT)
        .setActionText("Yes")
        .setCancelText("No")
        .cancelFunc(() => {
          LOGGER.info("Skipped sandbox content");
          nextModal();
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
}
