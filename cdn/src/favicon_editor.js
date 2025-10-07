// favicon_editor.js
// import { AdminModal } from "../scripts/modals/base.js";
import { CLEANABLE_ATTR } from "../scripts/interfaces/selectors.js";
import { LOGO_SAVE } from "../scripts/urls.js";

// Data Element
export const EditableFaviconName = "editable-favicon";

export function getEditableFavicon() {
    let manager = document.querySelector(EditableFaviconName);
    if (!manager) {
        manager = new EditableFavicon();
        // Keep this manager in <head> (non-rendering)
        document.head.appendChild(manager);
    }
    return manager;
}

export class FaviconEditor {
    constructor(element) {
        this.element = element;
    }
    clean() {
        if (this.element.tmpHref) {
            this.element.href = this.element.tmpHref;
        }
    }
    setHref(href) {
        const siteId = document.documentElement.dataset.siteId;
        fetch(LOGO_SAVE, {
            method: "POST",
            headers: { Accept: "application/json", "Content-Type": "application/json" },
            body: JSON.stringify({ siteId, logoSrc: href }),
        })
            .then((r) => r.json())
            .then((r) => {
                this.element.tmpHref = r.src;
            });

        this.element.href = href; // immediate preview
    }
}

// Manager element that proxies to the real <link rel="icon">
export class EditableFavicon extends HTMLElement {
    constructor() {
        super();
        // Ensure a real <link rel="icon"> exists
        let link = document.head.querySelector(`link[rel="icon"]`);
        if (!link) {
            link = document.createElement("link");
            link.setAttribute("rel", "icon");
            document.head.appendChild(link);
        }
        this._link = link;
        this.editor = new FaviconEditor(this);
        this.setAttribute(`data-${CLEANABLE_ATTR}`, "true");
    }

    // Proxy href so existing code works
    get href() {
        return this._link.href;
    }
    set href(v) {
        this._link.href = v;
    }
}
customElements.define(EditableFaviconName, EditableFavicon);

// ===== Modal (autonomous) =====
export class FaviconEditorModal extends AdminModal {
    actionText = "Update";
    headerText = "Edit Favicon";
    contentClass = "modal-content";

    connectedCallback() {
        this.classList.add("favicon-modal");
        this.favicon = getEditableFavicon();
        this.href = this.favicon.href;

        this.imgPreview = document.createElement("img");
        this.imgPreview.src = this.href;
        this.beforeAction = () => {
            this.favicon.editor.setHref(this.href);
        };
        this.render();
    }

    getInstructions() {
        const instructions = document.createElement("details");
        instructions.innerHTML = `
<summary>What is a favicon?</summary>
<p>The favicon is a little round image is the "site icon" for your website. Your browser will put it in your tab, and search engines will also display it in search results.</p>
<img src="/cdn/images/favicon_example.png" />
<img src="/cdn/images/favicon_example_2.png" />
<p>Make sure that the image you upload is a square. The system will optimize it to a 16x16 .ico file.</p>
`;
        return instructions;
    }

    getContent() {
        const content = document.createElement("div");

        content.appendChild(this.imgPreview);

        const form = document.createElement("form");
        const iconInput = document.createElement("input");
        iconInput.type = "file";
        iconInput.addEventListener("change", (e) => {
            const file = e.target.files?.[0];
            const reader = new FileReader();

            reader.addEventListener("loadend", () => {
                this.href = reader.result;
                this.imgPreview.src = this.href;
            });

            if (file) reader.readAsDataURL(file);
        });
        form.appendChild(iconInput);
        content.appendChild(form);
        return content;
    }
}
customElements.define("favicon-editor-modal", FaviconEditorModal);

// ===== Edit Button (autonomous) =====
export const EditFaviconButtonName = "edit-favicon-button";
export class EditFaviconButton extends HTMLElement {
    buttonText = "Site Icon";
    connectedCallback() {
        if (this._initialized) return;
        this._initialized = true;
        this.setAttribute("role", "button");
        this.tabIndex = 0;
        this.textContent = this.buttonText;

        const onActivate = () => {
            const modal = new FaviconEditorModal();
            modal.showMe();
        };
        this.addEventListener("click", onActivate);
        this.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onActivate();
            }
        });
    }
}
customElements.define(EditFaviconButtonName, EditFaviconButton);
