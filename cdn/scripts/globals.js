import { DocumentStore } from "./utils/document_store.js";

export function IS_LOCAL() { return window.IS_LOCAL || false; }
export function GET_STORE() {
    if (window.store == null) {
        window.store = new DocumentStore();
    }
    return window.store;
}
