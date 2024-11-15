import { IS_LOCAL, GET_STORE } from "../globals.js";


export const SaveButtonName = "save-button";

export class SaveButton extends HTMLButtonElement {
    constructor() {
        super();
        this.innerText = "save";
        this.addEventListener("click", () => this.save());
        this.store = GET_STORE();
    }
    save() {
        if (IS_LOCAL()) {
            this.saveToLocal();
        } else {
            this.saveToCloud();
        }
    }
    saveToLocal() {
        // UnsetDocumentEditable.
        const main = document.querySelector("main");
        this.store.saveSrc("main", main.outerHTML);
        const head = document.querySelector("head");
        this.store.saveSrc("head", head.outerHTML);
    }
    saveToCloud() {
        console.error("not implemented!");
    }
}

customElements.define(SaveButtonName, SaveButton, {extends: "button"});
