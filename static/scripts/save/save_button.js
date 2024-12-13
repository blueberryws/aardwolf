import { IS_LOCAL, GET_STORE } from "../globals.js";


export const SaveButtonName = "save-button";

export class SaveButton extends HTMLButtonElement {
    constructor() {
        super();
        this.innerText = "save";
        this.addEventListener("click", () => this.save());
        this.store = GET_STORE();
        this.getChildren = (node) => this.processChildren(node);
    }
    save() {
        console.log("Hi");
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
    saveToLocal() {
        const content = this.getContent();
        this.store.saveSrc("main", content.main);
        this.store.saveSrc("head", content.head);
    }
    saveToCloud() {
        console.log("saving to cloud");
        const main = document.querySelector("main").outerHTML;
        const head = document.querySelector("head").outerHTML;
        const content = {
            "head": head,
            "main": main,
            "site_json": "{}",
        }

        fetch("", {
            method: "PUT",    
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(content),
        })
        .then(resp => resp.json())
        .then(r => console.log(r))
        .catch(e => console.error(e));
    }
}

customElements.define(SaveButtonName, SaveButton, {extends: "button"});
