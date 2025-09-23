// NOTE: `getAddress`, `getDataByAddress`, `renderDiff`, `attach`, `loadStyles`,
// // and global `pageData` are assumed to exist (same pattern as LinkController).


function AutoResizeTextarea(textarea) {
    // Temporarily set height to 'auto' to get the true scrollHeight
    textarea.style.height = 'auto';
    // Set the height to the scrollHeight
    if (textarea.scrollHeight < 10) {
        textarea.style.height = "20px";
    } else {
        textarea.style.height = textarea.scrollHeight + 'px';
    }
}


const BASE_URL = "";
const IMAGE_SEARCH = `${BASE_URL}/image/search`;
const IMAGE_SAVE = `${BASE_URL}/image`;

const ColorStyleElementName = "color-style";
function getColorStyle() {
    return document.querySelector(`style[is='${ColorStyleElementName}']`)
}


const CLEANABLE_ATTR = "cleanable"

// ---------------------------------------------------------------------------
// // EditPictureModal (keeps the same visual components as before by using AdminModal)
// // ---------------------------------------------------------------------------
class EditPictureModal extends HTMLElement {
    constructor({ currentPreviewSrc, currentAlt, currentAttrText, currentAttrHref, onSave }) {
        super();
        this.onSave = onSave;
        // Build identical UI content that PictureEditor used to render inside AdminModal
        const m = new AdminModal();
        m.headerText = "Edit Image";

        const content = document.createElement("div");
        content.id = "edit-image-modal-content";
        content.classList.add("modal-content");

        // Preview
        this.imgPreview = document.createElement("img");
        this.imgPreview.classList.add("image-preview");
        this.imgPreview.src = currentPreviewSrc || "";
        content.appendChild(this.imgPreview);

        // Upload input
        const uploadInput = document.createElement("input");
        uploadInput.type = "file";
        uploadInput.setAttribute("accept", ".jpg, .jpeg, .png");
        uploadInput.addEventListener("change", (e) => {
            this.altTextInput.value = "";
            this.attributionTextInput.value = "";
            this.attributionHrefInput.value = "";
            AutoResizeTextarea(this.altTextInput);
            AutoResizeTextarea(this.attributionTextInput);
            AutoResizeTextarea(this.attributionHrefInput);
            const file = e.target.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onloadend = () => { this.imgPreview.src = reader.result; this.imgPreview.originalSrc = reader.result; };
            reader.readAsDataURL(file);
        });
        content.appendChild(uploadInput);

        // Pexels search (same controls)
        this.pexelsPreviews = document.createElement("ul");
        const pexelsSearchForm = document.createElement("div");
        this.pexelsQuery = document.createElement("input");
        this.pexelsQuery.placeholder = "Search for stock photos...";
        this.pexelsQuery.addEventListener("keyup", (e) => {
            if (e.key?.toLowerCase() === "enter") this.searchPexels();
        });
        pexelsSearchForm.appendChild(this.pexelsQuery);
        const searchButton = document.createElement("button");
        searchButton.innerText = "search";
        searchButton.addEventListener("click", () => this.searchPexels());
        pexelsSearchForm.appendChild(searchButton);
        content.appendChild(pexelsSearchForm);
        content.appendChild(this.pexelsPreviews);

        // Metadata form (same labels/placeholders)
        this.altTextInput = document.createElement("textarea");
        this.altTextInput.value = currentAlt || "";
        this.altTextInput.placeholder = "Description for screen readers and the visually impaired.";
        this.altTextInput.addEventListener("change", () => AutoResizeTextarea(this.altTextInput));
        this.altTextInput.addEventListener("input", () => AutoResizeTextarea(this.altTextInput));

        this.attributionTextInput = document.createElement("textarea");
        this.attributionTextInput.value = currentAttrText || "";
        this.attributionTextInput.placeholder = "Photo Credit: Photographer's Name Here";
        this.attributionTextInput.addEventListener("change", () => AutoResizeTextarea(this.attributionTextInput));
        this.attributionTextInput.addEventListener("input", () => AutoResizeTextarea(this.attributionTextInput));

        this.attributionHrefInput = document.createElement("textarea");
        this.attributionHrefInput.value = currentAttrHref || "";
        this.attributionHrefInput.placeholder = "https://example.com/optional/photographer/link";
        this.attributionHrefInput.addEventListener("change", () => AutoResizeTextarea(this.attributionHrefInput));
        this.attributionHrefInput.addEventListener("input", () => AutoResizeTextarea(this.attributionHrefInput));

        const form = document.createElement("form");
        form.insertAdjacentHTML("beforeend", "<label>Picture Description: </label>");
        form.appendChild(this.altTextInput);
        form.insertAdjacentHTML("beforeend", "<label>Photo Credit (Optional): </label>");
        form.appendChild(this.attributionTextInput);
        form.insertAdjacentHTML("beforeend", "<label>Photographer Link (Optional): </label>");
        form.appendChild(this.attributionHrefInput);
        content.appendChild(form);

        // Wire AdminModal lifecycle to our save callback
        m.content = content;
        m.beforeAction = () => {
            const payload = {
                alt_text: this.altTextInput.value,
                attribution_text: this.attributionTextInput.value,
                attribution_href: this.attributionHrefInput.value,
                // Use originalSrc (full) if present (from Pexels select / upload),
                //         // else whatever is displayed.
                selectedSrc: this.imgPreview.originalSrc || this.imgPreview.src || ""
            };
            this.onSave?.(payload);
        };

        // Store for later
        this._modal = m;
        document.body.appendChild(this);
        m.showMe();
    }

    // —— helpers reused from legacy editor ——
    selectImg = (selected) => {
        const others = document.querySelectorAll(".selected-preview-image") || [];
        for (const el of others) el.classList.remove("selected-preview-image");
        selected.classList.add("selected-preview-image");
        this.altTextInput.value = selected.dataset.altText || "";
        this.attributionTextInput.value = selected.dataset.attributionText || "";
        this.attributionHrefInput.value = selected.dataset.attributionHref || "";
        AutoResizeTextarea(this.altTextInput);
        AutoResizeTextarea(this.attributionTextInput);
        AutoResizeTextarea(this.attributionHrefInput);
        this.imgPreview.originalSrc = selected.originalSrc;
        this.imgPreview.src = selected.src;
    }

    searchPexels = () => {
        const colorStyle = getColorStyle();
        const palette = [
            colorStyle.dataset.primaryColor,
            colorStyle.dataset.secondaryColor,
        ];
        const searchParams = new URLSearchParams(palette.map(c => ["color", c]));
        searchParams.append("query", this.pexelsQuery.value || "");
        fetch(IMAGE_SEARCH + "?" + String(searchParams))
            .then(resp => resp.json())
            .then(results => this.loadPreviewImages(results));
    }

    loadPreviewImages = (results) => {
        this.pexelsPreviews.innerHTML = "";
        for (const result of results || []) {
            const img = document.createElement("img");
            img.originalSrc = result.src?.original;
            img.src = result.src?.small || result.src?.original || "";
            img.dataset.altText = result.alt || "";
            img.dataset.attributionText = `Photo Credit ${result.photographer || ""}`.trim();
            img.dataset.attributionHref = result.photographer_url || "";
            img.addEventListener("click", () => this.selectImg(img));
            this.pexelsPreviews.appendChild(img);
        }
    }
}
customElements.define("edit-picture-modal", EditPictureModal);
// ---------------------------------------------------------------------------
// // PictureController (controller that attaches to normal elements and edits pageData)
// // ---------------------------------------------------------------------------
class PictureController {
    constructor() {
        this._boundClick = (e) => this.handleClick(e);
        this._boundMouseDown = (e) => this.blockWhenNotFocused(e);
        this._boundTouchStart = (e) => this.blockWhenNotFocused(e);
        this._boundTouchMove = () => { this._scrolled = true; };
        this._scrolled = false;
    }

    register(el) {
        el.addEventListener("click", this._boundClick);
        el.addEventListener("mousedown", this._boundMouseDown);
        el.addEventListener("touchstart", this._boundTouchStart);
        el.addEventListener("touchmove", this._boundTouchMove);
    }

    blockWhenNotFocused(e) {
        const section = e.currentTarget.closest("section, li[is='editable-list-item']");
        if (!section) return;
        if (section.dataset.focus != "true") {
            e.preventDefault();
            section.editor?.takeFocus?.();
        }
    }

    handleClick(e) {
        e.preventDefault(); // never navigate/open in edit mode
        if (this._scrolled) { this._scrolled = false; return; }
        const target = e.currentTarget || e.target;
        const address = getAddress(target);
        const node = getDataByAddress(address, pageData); // { picture: {...} } or the picture node directly
        const pic = node.picture || node; // support either shape
        if (!pic.uuid) {
            try {
                pic.uuid = crypto.randomUUID();
            }
            catch {
                pic.uuid = String(Date.now()) + "-" + Math.random().toString(36).slice(2);
            }
        }

        // Ensure temp object exists (not persisted on publish)
        pic.temp = pic.temp || {};

        // Choose a preview src: temp preview first (fast), otherwise whatever is rendered
        const currentPreviewSrc =
            pic.temp.src ||
            target.getAttribute("src") ||
            target.querySelector?.("img")?.getAttribute("src") ||
            "";

        // Open modal with current values
        new EditPictureModal({
            currentPreviewSrc,
            currentAlt: pic.alt_text || "",
            currentAttrText: pic.attribution_text || "",
            currentAttrHref: pic.attribution_href || "",
            onSave: async ({ alt_text, attribution_text, attribution_href, selectedSrc }) => {
                // Update data layer
                pic.alt_text = alt_text;
                pic.attribution_text = attribution_text;
                pic.attribution_href = attribution_href;
                // Store the selected image URL (local data URL or remote) in temp for fast editing
                pic.temp.src = selectedSrc || pic.temp.src || "";

                // Re-render UI from data
                renderDiff(target.dataset.id, pageData);
                attach();
                loadStyles();

                // Kick off server job using uuid + temp src (no element HTML; we’re in data-layer world)
                try {
                    await this.uploadToCloud({
                        jobType: "source",
                        picUuid: pic.uuid,
                        tempSrc: pic.temp.src,
                    });
                } catch (err) {
                    console.error(err);
                }
            }
        });
    }

    async uploadToCloud({ jobType, picUuid, tempSrc }) {
        // TODO: this should probably also send an array of sizes to optimize for...
        const siteId = document.documentElement.dataset.siteId;
        const resp = await fetch(IMAGE_SAVE, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                siteId,
                jobType,        // "source" | "layout"
                picUuid,        // folder name on server
                tempSrc,        // temporary image url/data for optimization pipeline
            }),
        });
        if (!resp.ok) throw new Error(`IMAGE_SAVE failed: ${resp.status}`);
        return resp.json();
    }
}

// ---------------------------------------------------------------------------
// // Utility: clear all picture temps prior to persistence (publish/save)
// // ---------------------------------------------------------------------------
function clearPictureTemps(data = pageData) {
    // Walk the tree and remove any .picture.temp (or node.temp on picture nodes)
    const visit = (obj) => {
        if (!obj || typeof obj !== "object") return;
        if (obj.picture && obj.picture.temp) delete obj.picture.temp;
        if (obj.temp && (obj.alt_text !== undefined || obj.attribution_text !== undefined)) {
            // looks like a picture node itself
            delete obj.temp;
        }
        for (const k of Object.keys(obj)) visit(obj[k]);
    };
    visit(data);
}

// document.addEventListener("submit", (e) => {
//   const form = e.target;
//   if (form?.dataset?.[CLEANABLE_ATTR] === "true") {
//     clearPictureTemps(pageData);
//   }
// }, true);