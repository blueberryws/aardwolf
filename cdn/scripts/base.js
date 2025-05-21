export class CustomElement extends HTMLElement { // startfold
    attachHTML(html) {
        this.innerHTML = html;
        const tags = this.querySelectorAll("[data-tag]");
        for (const el of tags) {
            if (!el.tagged) {
                this[el.dataset.tag] = el;
                el.tagged = true;
            }
        }
        const clickHandlers = this.querySelectorAll("[data-on-click]");
        for (const el of clickHandlers) {
            if (!el.onClicked) {
                el.addEventListener("click", (event) => this[el.dataset.onClick](event));
                el.onClicked = true;
            }
        }
        const inputHandlers = this.querySelectorAll("[data-on-input]");
        for (const el of inputHandlers) {
            if (!el.onInput) {
                el.addEventListener("input", (event) => this[el.dataset.onInput](event));
                el.onInput = true;
            }
        }
        const changeHandlers = this.querySelectorAll("[data-on-change]");
        for (const el of changeHandlers) {
            if (!el.onChange) {
                el.addEventListener("change", (event) => this[el.dataset.onChange](event));
                el.onChange = true;
            }
        }
        const submitHandlers = this.querySelectorAll("[data-on-submit]");
        for (const el of submitHandlers) {
            if (!el.onSubmitted) {
                el.addEventListener("submit", (event) => this[el.dataset.onSubmit](event));
                el.onSubmitted = true;
            }
        }
    }
} // endfold
