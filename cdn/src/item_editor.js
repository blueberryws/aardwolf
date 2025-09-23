const ITEM_CONTROLLER_BUTTON_CLASS = "item-controller-button";

class MoveItemUp extends HTMLElement { // startfold
  constructor(clickHandler) {
    super();
    this.textContent = "";
    this.classList.add(ITEM_CONTROLLER_BUTTON_CLASS);
    this.addEventListener("click", clickHandler);
  }
  focus(item) {
    // DOMRect { x: 8, y: 19.916671752929688, width: 1900, height: 151.8333282470703, top: 19.916671752929688, right: 1908, bottom: 171.75, left: 8 }
    const bounds = item.getBoundingClientRect();
    this.style = `top: ${bounds.top + window.scrollY + 10}px; left: ${bounds.right + window.scrollX - 50}px;`;
  }
}
customElements.define("move-item-up", MoveItemUp);
//endfold
class MoveItemDown extends HTMLElement { // startfold
  constructor(clickHandler) {
    super();
    this.textContent = "";
    this.classList.add(ITEM_CONTROLLER_BUTTON_CLASS);
    this.addEventListener("click", clickHandler);
  }
  focus(item) {
    // DOMRect { x: 8, y: 19.916671752929688, width: 1900, height: 151.8333282470703, top: 19.916671752929688, right: 1908, bottom: 171.75, left: 8 }
    const bounds = item.getBoundingClientRect();
    this.style = `top: ${bounds.bottom + window.scrollY - 10}px; left: ${bounds.right + window.scrollX - 50}px;`;
  }
}
customElements.define("move-item-down", MoveItemDown);
//endfold
class RemoveItem extends HTMLElement { // startfold
  constructor(clickHandler) {
    super();
    this.textContent = "";
    this.classList.add(ITEM_CONTROLLER_BUTTON_CLASS);
    this.addEventListener("click", clickHandler);
  }
  focus(item) {
    // DOMRect { x: 8, y: 19.916671752929688, width: 1900, height: 151.8333282470703, top: 19.916671752929688, right: 1908, bottom: 171.75, left: 8 }
    const bounds = item.getBoundingClientRect();
    this.style = `top: ${bounds.bottom + window.scrollY - 10}px; left: ${((bounds.right - bounds.left) / 2) + window.scrollX - 50}px;`;
  }
}
customElements.define("remove-item", RemoveItem);
//endfold
class DuplicateItem extends HTMLElement { // startfold
  constructor(clickHandler) {
    super();
    this.textContent = "";
    this.classList.add(ITEM_CONTROLLER_BUTTON_CLASS);
    this.addEventListener("click", clickHandler);
  }
  focus(item) {
    // DOMRect { x: 8, y: 19.916671752929688, width: 1900, height: 151.8333282470703, top: 19.916671752929688, right: 1908, bottom: 171.75, left: 8 }
    const bounds = item.getBoundingClientRect();
    this.style = `top: ${bounds.bottom + window.scrollY - 10}px; left: ${((bounds.right - bounds.left) / 2) + window.scrollX + 50}px;`;
  }
}
customElements.define("duplicate-item", DuplicateItem);
//endfold

class ItemController {
  constructor() {
      this.buttons = [
        new MoveItemUp((e) => {this.moveItemUp(e)}),
        new MoveItemDown((e) => {this.moveItemDown(e)}),
        new RemoveItem((e) => {this.removeItem(e)}),
        new DuplicateItem((e) => {this.duplicateItem(e)}),
      ];
      this.resizeObserver = new ResizeObserver((entries) => {
          entries.forEach(entry => {
              this.focusButtons(entry.target);
          });
      });
      this.item = null;
  }
  register(item) { // startfold
      item.addEventListener("touchend", (e) => {
          document.activeElement.blur();
          this.takeFocus(item)
      });
      item.addEventListener("mouseenter", (e) => {this.takeFocus(item)});
      item.addEventListener("mouseleave", (e) => {this.removeFocus(item)});
  } // endfold
  focusButtons(item) { // startfold
     this.buttons.forEach(btn => btn.focus(item));
  } // endfold
  attachButtons(item) { // startfold
     this.buttons.forEach(btn => document.body.appendChild(btn));
     this.focusButtons(item);
  } // endfold
  removeButtons() { // startfold
    this.buttons.forEach(btn => btn.remove());
  } // endfold
  takeFocus(item) { // startfold
    const parentSection = item.closest("section[data-editor='section']");
    if (parentSection.dataset.focus != "true") {
      return
    }
    const currentFocus = Array.from(document.querySelectorAll("[data-editor='item'][data-focus='true']"));
    currentFocus.forEach(itm => {this.removeFocus(itm)});
    this.attachButtons(item);
    this.item = item;
    item.dataset.focus = "true";
    this.resizeObserver.observe(this.item);
  } // endfold
  removeFocus(item) { // startfold
      delete item.dataset.focus;
      this.removeButtons();
      this.resizeObserver.unobserve(item);
      this.item = null;
  } // endfold
  moveItemUp(event) { // startfold
      if (this.item == null) {
          console.error("Move Up Item Clicked Without Focus!");
          return
      }
      // This leverages the global namespace extensively... which is uncomfy.
      // Need to figure out dependency injection.
      const dataId = this.item.dataset.id;
      const address = getAddress(this.item);
      const node = getDataByAddress(address, pageData);
      // TODO: This part has too much knowledge of the DOM.
      const section = this.item.closest("section");
      const sectionAddress = getAddress(section);
      const sectionNode = getDataByAddress(sectionAddress, pageData);
      const nodeItems = sectionNode.content.items;
      const nodeIdx = nodeItems.indexOf(node);
      if (nodeIdx > 0) {
          [nodeItems[nodeIdx -1], nodeItems[nodeIdx]] = [nodeItems[nodeIdx], nodeItems[nodeIdx -1]];
          //renderDiff(sectionAddress, pageData);
          render(pageData);
          attach();
          loadStyles();
      }
  } // endfold
  moveItemDown(event) { // startfold
      if (this.item == null) {
          console.error("Move Down Item Clicked Without Focus!");
          return
      }
      // This leverages the global namespace extensively... which is uncomfy.
      // Need to figure out dependency injection.
      const dataId = this.item.dataset.id;
      const address = getAddress(this.item);
      const node = getDataByAddress(address, pageData);
      // TODO: This part has too much knowledge of the DOM.
      const section = this.item.closest("section");
      const sectionAddress = getAddress(section);
      const sectionNode = getDataByAddress(sectionAddress, pageData);
      const nodeItems = sectionNode.content.items;
      const nodeIdx = nodeItems.indexOf(node);
      if (nodeIdx < nodeItems.length) {
          [nodeItems[nodeIdx], nodeItems[nodeIdx+1]] = [nodeItems[nodeIdx+1], nodeItems[nodeIdx]];
          // renderDiff(sectionAddress, pageData);
          render(pageData);
          attach();
          loadStyles();
      }
  } // endfold
  removeItem(event) { // startfold
      if (this.item == null) {
          console.error("Remove Section called on fake section?");
      }
      const address = getAddress(this.item);
      const node = getDataByAddress(address, pageData);
      // TODO: This part has too much knowledge of the DOM.
      const section = this.item.closest("section");
      const sectionAddress = getAddress(section);
      const sectionNode = getDataByAddress(sectionAddress, pageData);
      const nodeItems = sectionNode.content.items;
      const nodeIdx = nodeItems.indexOf(node);
      if (nodeIdx != -1 && nodeItems.length > 1) {
          nodeItems.splice(nodeIdx, 1);
          //renderDiff(sectionAddress, pageData);
          render(pageData);
          attach();
          loadStyles();
      }
  } // endfold
  duplicateItem(e) { // startfold
        const node = dataController.byId(this.item.dataset.id);
        const parent = node.parent;
        const nodeIdx = parent.indexOf(node.data);
        let newNode = JSON.parse(JSON.stringify(node.data));
        dataController.makeNewIds(newNode);
        parent.splice(nodeIdx + 1, 0, newNode);
        render(pageData);
        attach();
        loadStyles();
        dataController._buildTree(pageData);
  } //
}
