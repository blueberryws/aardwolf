// admin_modal.classic.js  (load with a plain <script src="...">)

export class AdminModal extends HTMLElement {
    constructor() {
        super();
        // public config fields (same names as before)
        this.actionText = "save";
        this.cancelText = "cancel";
        this.headerText = "Modal";
        this.classes = ["admin-modal"];

        // callbacks
        this.beforeCancel = () => { };
        this.beforeAction = () => { };

        // internal structure: compose a <dialog> instead of extending it
        this._dialog = document.createElement("dialog");
        this._dialog.setAttribute("data-name", "modal");

        // public nodes (keep same surface API)
        this.instructions = document.createElement("div");
        this.content = document.createElement("div");
    }

    connectedCallback() {
        this.render();
    }

    render() {
        // Rebuild the dialog contents from current state
        this.innerHTML = "";
        this._dialog.className = ""; // reset classes
        this.classes.forEach(cl => this._dialog.classList.add(cl));

        // Header
        this.header = document.createElement("h2");
        this.header.innerText = this.headerText;
        this._dialog.appendChild(this.header);

        // Instructions
        this._dialog.appendChild(this.getInstructions());

        // Content
        this._dialog.appendChild(this.getContent());

        // Buttons
        this.createCancelBtn();
        this.createActionBtn();

        // Mount dialog into this custom element
        this.appendChild(this._dialog);
    }

    // --- public helpers (unchanged surface) ---
    getContent() {
        return this.content;
    }

    getInstructionSummary() {
        const summary = document.createElement("summary");
        summary.innerText = "Instructions";
        return summary;
    }

    getInstructions() {
        if (this.instructions.innerHTML === "") {
            return this.instructions;
        }
        const details = document.createElement("details");
        details.appendChild(this.getInstructionSummary());
        details.appendChild(this.instructions);
        return details;
    }

    createActionBtn() {
        this.actionBtn = document.createElement("button");
        this.actionBtn.classList.add("admin-modal-action-btn");
        this.actionBtn.innerText = this.actionText;
        this.actionBtn.addEventListener("click", (e) => {
            try { this.beforeAction(e); } catch (err) { console.error(err); }
            this.close();
            this.remove();
        });
        this._dialog.appendChild(this.actionBtn);
    }

    createCancelBtn() {
        this.cancelBtn = document.createElement("button");
        this.cancelBtn.classList.add("admin-modal-cancel-btn");
        this.cancelBtn.innerText = this.cancelText;
        this.cancelBtn.addEventListener("click", (e) => {
            try { this.beforeCancel(e); } catch (err) { console.error(err); }
            this.close();
            this.remove();
        });
        this._dialog.appendChild(this.cancelBtn);
    }

    contentHTML(html) { this.content.innerHTML = html; return this; }
    contentNode(node) { this.content.innerHTML = ""; this.content.appendChild(node); return this; }
    instructionsHTML(html) { this.instructions.innerHTML = html; return this; }
    instructionsNode(node) { this.instructions.innerHTML = ""; this.instructions.appendChild(node); return this; }
    addClass(className) { this._dialog.classList.add(className); return this; }
    setHeaderText(text) { this.headerText = text; this._rerenderIfAttached(); return this; }
    setActionText(text) { this.actionText = text; this._rerenderIfAttached(); return this; }
    setCancelText(text) { this.cancelText = text; this._rerenderIfAttached(); return this; }
    actionFunc(func) { this.beforeAction = func; return this; }
    cancelFunc(func) { this.beforeCancel = func; return this; }

    showMe() {
        // Append and show (with <dialog> support fallback)
        if (!this.isConnected) document.body.appendChild(this);
        if (typeof this._dialog.showModal === "function") {
            this._dialog.showModal();
        } else {
            // very small fallback for browsers without <dialog>
            this._fallbackOpen();
        }
    }

    close() {
        if (typeof this._dialog.close === "function") {
            this._dialog.close();
        }
        this._fallbackClose();
    }

    // --- internals ---
    _rerenderIfAttached() {
        if (this.isConnected) this.render();
    }

    _fallbackOpen() {
        // Simulate modal behavior if <dialog> is missing
        this._dialog.setAttribute("open", "");
        this.style.position = "fixed";
        this.style.inset = "0";
        this.style.display = "flex";
        this.style.alignItems = "center";
        this.style.justifyContent = "center";
        this.style.background = "rgba(0,0,0,0.4)";
    }

    _fallbackClose() {
        this._dialog.removeAttribute("open");
        this.removeAttribute("style");
    }
}
