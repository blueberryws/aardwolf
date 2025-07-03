import { IS_LOCAL, GET_STORE } from "../globals.js";


export const ResetButtonName = "reset-button";

export class ResetButton extends HTMLButtonElement {
    constructor() {
        super();
        this.innerText = "reset";
        this.setAttribute("is", ResetButtonName);
        this.store = GET_STORE();
        this.addEventListener("click", () => {
            this.store.deleteSrc("head");
            this.store.deleteSrc("main");
            window.location.reload();
        });
    }
}

customElements.define(ResetButtonName, ResetButton, {extends: "button"});
