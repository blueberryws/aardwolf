import { LOG } from './utils/logger.js';

import { DocumentStore } from "./utils/document_store.js";

export function IS_LOCAL() { 
    return window.IS_LOCAL || false; 
}

export function GET_STORE() {
    try {
        if (window.store == null) {
            window.store = new DocumentStore();
            LOG.info("DocumentStore instance created and assigned to window.store");
        }
        return window.store;
    } catch (error) {
        LOG.error("Failed to get or create DocumentStore instance: " + error.message);
        throw error; // Rethrowing the error after logging
    }
}