class PageData {
  constructor(pageData, themeData) {
    this.raw = pageData;
    this.map = {};
    this.theme = themeData;
    this._buildTree(pageData, null);
  }
  _buildTree(data, parent) {
    this.map = {};
    const iterator = (data, parent) => {
      // walk the whole tree, and get the things.
      if (Array.isArray(data)) {
        data.forEach((value, index) => {
          iterator(value, data);
        });
      } else if (data !== null && typeof data === "object") {
        Object.entries(data).forEach(([key, value]) => {
          if (key == "id") {
            this.map[value] = new DataFragment(data, parent);
          }
          iterator(value, data);
        });
      } else {
        return
      }
    }
    iterator(data, parent);
  }
  byId(id) {
    return this.map[id];
  }
  nextId() {
      const keys = Object.keys(this.map);
      const largest = Math.max(...keys);
      return largest + 1;
  }
  makeNewIds(data) {
    let nextId = this.nextId();
    const iterator = (d) => {
      if (d.hasOwnProperty("id")) {
        d.id = nextId;
        nextId += 1;
      }
      if (Array.isArray(d)) {
        d.forEach((value, index) => {
          iterator(value);
        });
      } else if (d !== null && typeof d === "object") {
        Object.entries(d).forEach(([key, value]) => {
          iterator(value);
        });
      } else {
        return
      }
    }
    iterator(data);
  }
}

class DataFragment {
  constructor(data, parent) {
    this.parent = parent;
    this.data = data;
    this.id = data.id;
  }
}
