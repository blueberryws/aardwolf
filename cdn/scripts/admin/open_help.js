import { showWelcomeModal } from "../modals/welcome.js";

export const OpenHelpButtonName = "open-help-button";
export class OpenHelpButton extends HTMLButtonElement {
    buttonText = "Open Help";
    constructor() {
        super();
        this.innerText = this.buttonText;
        this.addEventListener("click", showWelcomeModal);
    }
}

customElements.define(OpenHelpButtonName, OpenHelpButton, {extends: "button"});
