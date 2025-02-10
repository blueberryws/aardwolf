import { LOG } from '../utils/logger.js';

import { IS_LOCAL, GET_STORE } from "../globals.js";


export const ResetButtonName = "reset-button";

export class ResetButton extends HTMLButtonElement {
    constructor() {
        super();
        this.innerText = "reset";
        this.setAttribute("is", ResetButtonName);
        try {
            this.store = GET_STORE();
        } catch (error) {
            LOG.error("Failed to get store: " + error.message);
            this.store = null; // Fallback to null if store is not available
        }
        this.addEventListener("click", () => {
            if (this.store) {
                try {
                    this.store.deleteSrc("head");
                    this.store.deleteSrc("main");
                    window.location.reload();
                } catch (error) {
                    LOG.error("Failed to delete sources or reload: " + error.message);
                }
            } else {
                LOG.warn("Store is not available, cannot delete sources.");
            }
        });
    }
}

customElements.define(ResetButtonName, ResetButton, {extends: "button"});