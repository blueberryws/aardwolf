export const OpenHelpButtonName = "open-help-button";

export class OpenHelpButton extends HTMLElement {
    static formAssociated = true; // optional — if you ever want form behavior

    buttonText = "Open Help";
    internals;

    constructor() {
        super();
        // enable proper button semantics for accessibility
        this.setAttribute("role", "button");
        this.tabIndex = 0; // make focusable
        this.internals = this.attachInternals?.();

        // default text
        if (!this.textContent.trim()) {
            this.textContent = this.buttonText;
        }

        // optional: emulate native button click behavior via keyboard
        this.addEventListener("keydown", (e) => {
            if (e.key === " " || e.key === "Enter") {
                e.preventDefault();
                this.click();
            }
        });
    }

    connectedCallback() {
        // style hook
        this.classList.add("open-help-button");
    }

    // If you ever re-enable your handler:
    // connectedCallback() {
    //   this.addEventListener("click", showWelcomeModal);
    // }
}

customElements.define(OpenHelpButtonName, OpenHelpButton);
