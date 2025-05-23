import { IS_LOCAL, GET_STORE } from "../globals.js";
import { dispatch, CleanDocument, SetDocumentEditable, UnsetDocumentEditable, SetLoading, UnsetLoading } from "../interfaces/events.js";
import { CLEANABLE_SELECTOR } from "../interfaces/selectors.js";
import { register, ELEMENT_NAMES } from "../element_registry.js";


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
        if (IS_LOCAL()) {
            console.log("saving to local");
            this.saveToLocal();
        } else {
            console.log("saving to cloud");
            this.saveToCloud();
        }
    }
    getContent() {
        // UnsetDocumentEditable.
        const main = document.querySelector("main");
        const head = document.querySelector("head");
        const content = {
            "main": main.outerHTML,
            "head": head.outerHTML,
        }
        return content
    }
    cleanDocument() {
        const cleanable = document.querySelectorAll(CLEANABLE_SELECTOR);
        for (const cleanableElement of cleanable) {
            cleanableElement.editor.clean();
        }
    }
    saveToLocal() {
        dispatch(UnsetDocumentEditable);
        const content = this.getContent();
        this.store.saveSrc("main", content.main);
        this.store.saveSrc("head", content.head);
        dispatch(SetDocumentEditable);
        dispatch(UnsetLoading);
        console.log("save complete");
    }
    saveToCloud() {
        dispatch(UnsetDocumentEditable);
        dispatch(SetLoading);
        this.cleanDocument();
        const main = document.querySelector("main").outerHTML;
        const head = document.querySelector("head").outerHTML;
        const lang = document.documentElement.lang || "en";
        const content = {
            "head": head,
            "main": main,
            "lang": lang,
            "site_json": "{}",
        }

        fetch("", {
            method: "PUT",    
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(content),
        })
        .then(resp => resp.json())
        .then(r => {
            console.log(r);
            window.location.reload(true);
        })
        .catch(e => {
            console.error(e);
            dispatch(SetDocumentEditable);
            dispatch(UnsetLoading);
        });
    }
}

customElements.define(SaveButtonName, SaveButton, {extends: "button"});
