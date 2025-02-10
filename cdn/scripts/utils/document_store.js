import { LOG } from './logger.js';

export class DocumentStore { // startfold
    dbName = "twodollarwebsite";
    storeName = "sandbox";
    dbVersion = 1;
    keyPath = "id";

    constructor() { // startfold
        const request = indexedDB.open(this.dbName, this.dbVersion);
        request.onerror = (event) => {
            LOG.error(`Error opening database: ${event.target.error}`); // Log the error
        };
        request.onsuccess = (event) => {
            this.db = event.target.result;
            LOG.info(`Successfully opened database: ${this.dbName}`); // Log success
        };
        request.onupgradeneeded = (event) => {
          this.db = event.target.result;
          this.db.createObjectStore(
            this.storeName,
            { keyPath: this.keyPath }
          );
          LOG.info(`Object store created: ${this.storeName}`); // Log creation of object store
        };
    } // endfold
    saveSrc(key, src) { // startfold
        const objectStore = this.db
          .transaction(this.storeName, "readwrite")
          .objectStore(this.storeName);
        const request = objectStore.get(key);
        request.onsuccess = (event) => {
            const data = event.target.result;
            if (data != undefined) {
                data.src = src;
                const putRequest = objectStore.put(data);
                putRequest.onerror = (event) => {
                    LOG.error(`Error updating data for key ${key}: ${event.target.error}`); // Log error on put
                };
            } else {
                const data = {"id": key, "src": src};
                const addRequest = objectStore.add(data);
                addRequest.onerror = (event) => {
                    LOG.error(`Error adding data for key ${key}: ${event.target.error}`); // Log error on add
                };
            }
        };
        request.onerror = (event) => {
            LOG.error(`Error retrieving data for key ${key}: ${event.target.error}`); // Log error on get
        };
    }  // endfold
    loadSrc(key, callback) { // startfold
        if (this.db == null) {
            LOG.warn(`Database not initialized, retrying loadSrc for key ${key}`); // Log warning for retry
            setTimeout(() => this.loadSrc(key, callback), 1000);
        } else {
            const transaction = this.db.transaction(this.storeName);
            const objectStore = transaction.objectStore(this.storeName);
            const getRequest = objectStore.get(key);
            getRequest.onsuccess = (event) => {
                LOG.info(`Successfully loaded data for key ${key}`); // Log success
                callback(event.target.result);
            };
            getRequest.onerror = (event) => {
                LOG.error(`Error loading data for key ${key}: ${event.target.error}`); // Log error on load
            };
        }
    } // endfold
    deleteSrc(key) { // startfold
      const request = this.db
         .transaction(this.storeName, "readwrite")
         .objectStore(this.storeName)
         .delete(key);
      request.onsuccess = () => {
          LOG.info(`Successfully deleted data for key ${key}`); // Log success on delete
      };
      request.onerror = (event) => {
          LOG.error(`Error deleting data for key ${key}: ${event.target.error}`); // Log error on delete
      };
    } // endfold
    loadToDocument(selector, callback) {
      this.loadSrc(selector, (res) => {
        if (res != null) {
            const docSection = document.querySelector(selector);
            docSection.outerHTML = res.src;
            LOG.info(`Successfully loaded content into document for selector ${selector}`); // Log success
        } else {
            LOG.warn(`No content found for selector ${selector}`); // Log warning for no content
        }
        callback();
      });
    }
} // endfold
