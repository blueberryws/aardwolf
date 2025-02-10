import { LOG } from '../utils/logger.js';

import { IS_LOCAL, GET_STORE } from "../globals.js";
import { dispatch, SetDocumentEditable, UnsetDocumentEditable } from "../interfaces/events.js";

export const SaveButtonName = "save-button";

export class SaveButton extends HTMLButtonElement {
    constructor() {
        super();
        this.innerText = "save";
        this.setAttribute("is", SaveButtonName);
        this.addEventListener("click", () => this.save());
        this.store = GET_STORE();
        this.getChildren = (node) => this.processChildren(node);
    }

    save() {
        try {
            if (IS_LOCAL()) {
                LOG.info("saving to local");
                this.saveToLocal();
            } else {
                LOG.info("saving to cloud");
                this.saveToCloud();
            }
        } catch (error) {
            LOG.error("Error in save method: " + error.message);
        }
    }

    getContent() {
        try {
            const main = document.querySelector("main");
            const head = document.querySelector("head");
            const content = {
                "main": main.outerHTML,
                "head": head.outerHTML,
            };
            return content;
        } catch (error) {
            LOG.error("Error in getContent method: " + error.message);
        }
    }

    saveToLocal() {
        try {
            dispatch(UnsetDocumentEditable);
            const content = this.getContent();
            this.store.saveSrc("main", content.main);
            this.store.saveSrc("head", content.head);
            dispatch(SetDocumentEditable);
            LOG.info("Local save complete");
        } catch (error) {
            LOG.error("Error in saveToLocal method: " + error.message);
            dispatch(SetDocumentEditable);
        }
    }

    saveToCloud() {
        dispatch(UnsetDocumentEditable);
        try {
            const main = document.querySelector("main").outerHTML;
            const head = document.querySelector("head").outerHTML;
            const lang = document.documentElement.lang || "en";
            const content = {
                "head": head,
                "main": main,
                "lang": lang,
                "site_json": "{}",
            };

            fetch("", {
                method: "PUT",    
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(content),
            })
            .then(resp => {
                if (!resp.ok) {
                    throw new Error("Network response was not ok");
                }
                return resp.json();
            })
            .then(r => {
                LOG.info("Cloud save response: " + JSON.stringify(r));
                window.location.reload(true);
            })
            .catch(e => {
                LOG.error("Error in saveToCloud method: " + e.message);
                dispatch(SetDocumentEditable);
            });
        } catch (error) {
            LOG.error("Error in saveToCloud method: " + error.message);
            dispatch(SetDocumentEditable);
        }
    }
}

customElements.define(SaveButtonName, SaveButton, {extends: "button"});