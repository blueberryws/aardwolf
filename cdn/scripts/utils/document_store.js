export class DocumentStore { // startfold
    dbName = "twodollarwebsite";
    storeName = "sandbox";
    dbVersion = 1;
    keyPath = "id";

    constructor() { // startfold
        const queue = [];
        const request = indexedDB.open(this.dbName, this.dbVersion);
        request.onerror = (event) => {
            console.error(event);
        };
        request.onsuccess = (event) => {
            this.db = event.target.result;
        };
        request.onupgradeneeded = (event) => {
          this.db = event.target.result;
          this.createStore();
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
                objectStore.put(data);
            } else {
                const data = {"id": key, "src": src};
                objectStore.add(data);
            }
        }
    }  // endfold
    createStore() { // startfold
      this.db.createObjectStore(
        this.storeName,
        { keyPath: this.keyPath }
      );
    } // endfold
    loadSrc(key, callback) { // startfold
        if (this.db == null) {
            setTimeout(() => this.loadSrc(key, callback), 1000);
        } else {
            this.db
                .transaction(this.storeName)
                .objectStore(this.storeName)
                .get(key).onsuccess = (event) => callback(event.target.result);
        }
    } // endfold
    deleteSrc(key) { // startfold
      this.db
         .transaction(this.storeName, "readwrite")
         .objectStore(this.storeName)
         .delete(key);
    } // endfold
} // endfold
