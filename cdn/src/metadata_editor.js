// metadata_editor.js
// import { AdminModal } from "../scripts/modals/base.js";
import { fromHTML } from "../scripts/utils/html.js";
import { AutoResizeTextarea } from "../scripts/utils/interactions.js";

// Data Element
export const EditableHeadName = "editable-head";
export function getEditableHead() {
    let manager = document.querySelector(EditableHeadName);
    if (!manager) {
        manager = new EditableHead();
        // keep it in <head> (it doesn't render)
        document.head.appendChild(manager);
    }
    return manager;
}

export class EditableHead extends HTMLElement {
    userErrorMessage = "Unable to save metadata.\nIf this persists, please contact support.";
    supportedNames = ["rating", "google-site-verification", "robots", "google", "googlebot"];

    constructor() {
        super();
        [this.siteTitle, this.description] = this.ensureDefaults();
        // Avoid re-entrant construction by not calling getEditableHead() here.
        const other = document.querySelector(EditableHeadName);
        if (other != null && other !== this) {
            throw `There can only be ONE ${EditableHeadName} element!`;
        }
    }

    openHeaditor() {
        const modal = new HeadEditorModal();
        modal.showMe();
    }

    ensureDefaults() {
        const head = document.head;
        let title = head.querySelector("title");
        let description = head.querySelector(`meta[name="description"]`);
        if (!title) {
            title = document.createElement("title");
            head.appendChild(title);
        }
        if (!description) {
            description = document.createElement("meta");
            description.name = "description";
            head.appendChild(description);
        }
        return [title, description];
    }

    getEditableChildren() {
        const editableChildren = [];
        for (const child of document.head.children) {
            if (child.name != null && this.supportedNames.includes(child.name)) {
                editableChildren.push(child);
            }
        }
        return editableChildren;
    }
}
customElements.define(EditableHeadName, EditableHead);

// ===== Modal (autonomous) =====
export class HeadEditorModal extends AdminModal {
    actionText = "Update";
    headerText = "SEO and Metadata";
    contentClass = "modal-content";

    connectedCallback() {
        this.classList.add("metadata-modal");
        this.head = getEditableHead();
        this.document = document.documentElement;
        this.beforeAction = () => {
            this.head.siteTitle.innerText = this.titleText.value;
            this.head.description.content = this.descriptionText.value;
            this.document.lang = this.languageSelector.value;

            // Reset/replace supported meta tags
            this.head.getEditableChildren().forEach((child) => child.remove());
            for (let child of this.metaChildren.children) {
                const selector = child.querySelector("select");
                const content = child.querySelector("textarea, input");
                if (content.value != "" && content.value != null) {
                    const newMeta = document.createElement("meta");
                    newMeta.name = selector.value;
                    newMeta.content = content.value;
                    document.head.appendChild(newMeta);
                }
            }
        };
        this.metaChildren = null;
        this.render();
        AutoResizeTextarea(this.titleText);
        AutoResizeTextarea(this.descriptionText);
    }

    getInstructions() {
        const instructions = document.createElement("details");
        instructions.innerHTML = `
<summary>About Setting Metadata</summary>
<p>Your site title and description are used to tell search engines what your site is about. They are the bit of text that show up when your site is searched for on google. (Title in blue, description is the gray text.)</p>
<img src="/cdn/images/site_title_and_description.png" />
<p>Additionally, the title is what your users will see in their browser tab.</p>
<img src="/cdn/images/site_title_example.png" />
<p>Setting a good title and description is an important part of SEO. You can try different keywords here to try reach different audiences. This might be names of specific cities that you serve, or specific services that you offer. There isn't one-right-way to write a description. It's something that you have to try different things to find out what works.</p>
<p>If needed, you can add additional metadata. For most sites, this is not necessary unless you have a specific metadata to add (such as a google-site-verification tag).</p>
`;
        return instructions;
    }

    makeMetaSelector(name, content) {
        const container = document.createElement("div");

        const selector = document.createElement("select");
        for (let opt of this.head.supportedNames) {
            const option = document.createElement("option");
            option.value = opt;
            option.innerText = opt;
            selector.appendChild(option);
        }
        if (name != null) selector.value = name;
        container.appendChild(selector);

        const input = document.createElement("textarea");
        input.value = content ?? "";
        input.addEventListener("input", () => AutoResizeTextarea(input));
        AutoResizeTextarea(input);
        container.appendChild(input);

        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.innerText = "x";
        removeButton.addEventListener("click", () => container.remove());
        container.appendChild(removeButton);

        return container;
    }

    getContent() {
        const content = document.createElement("div");
        content.classList.add(this.contentClass, "metadata-modal");

        const titleLabel = document.createElement("label");
        titleLabel.innerText = "Title:";
        content.appendChild(titleLabel);

        this.titleText = document.createElement("textarea");
        this.titleText.setAttribute("type", "text");
        this.titleText.value = this.head.siteTitle.innerText || "";
        this.titleText.addEventListener("input", () => AutoResizeTextarea(this.titleText));
        content.appendChild(this.titleText);

        const descriptionLabel = document.createElement("label");
        descriptionLabel.innerText = "Site Description:";
        content.appendChild(descriptionLabel);

        this.descriptionText = document.createElement("textarea");
        this.descriptionText.setAttribute("onchange", "this.style.height = this.scrollHeight +'px'");
        this.descriptionText.value = this.head.description.content || "";
        this.descriptionText.addEventListener("input", () => AutoResizeTextarea(this.descriptionText));
        content.appendChild(this.descriptionText);
        AutoResizeTextarea(this.descriptionText);

        const languageLabel = document.createElement("label");
        languageLabel.innerText = "Language:";
        content.appendChild(languageLabel);

        this.languageSelector = document.createElement("select");
        this.languageSelector.appendChild(fromHTML("<option value='en'>English</option>"));
        this.languageSelector.appendChild(fromHTML("<option value='es'>Spanish</option>"));
        this.languageSelector.value = this.document.lang || "en";
        content.appendChild(this.languageSelector);

        this.metaChildren = document.createElement("div");
        for (let meta of this.head.getEditableChildren()) {
            const metaLine = this.makeMetaSelector(meta.name, meta.content);
            this.metaChildren.appendChild(metaLine);
        }
        content.appendChild(this.metaChildren);

        const addButton = document.createElement("button");
        addButton.type = "button";
        addButton.innerText = "Add Metadata";
        addButton.addEventListener("click", () => {
            const newMeta = this.makeMetaSelector(null, "");
            this.metaChildren.appendChild(newMeta);
        });
        content.appendChild(addButton);

        return content;
    }
}
customElements.define("head-editor-modal", HeadEditorModal);

// ===== Edit Button (autonomous) =====
export const EditHeadButtonName = "edit-head-button";
export class EditHeadButton extends HTMLElement {
    buttonText = "SEO and Metadata";
    connectedCallback() {
        if (this._initialized) return;
        this._initialized = true;
        this.setAttribute("role", "button");
        this.tabIndex = 0;
        this.textContent = this.buttonText;

        const head = getEditableHead();
        const onActivate = () => head?.openHeaditor?.();
        this.addEventListener("click", onActivate);
        this.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onActivate();
            }
        });
    }
}
customElements.define(EditHeadButtonName, EditHeadButton);
