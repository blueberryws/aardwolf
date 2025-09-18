const SECTION_CONTROLLER_BUTTON_CLASS = "section-controller-button";

class NextSectionLayout extends HTMLElement { // startfold
  constructor(clickHandler) {
    super();
    this.textContent = "";
    this.classList.add(SECTION_CONTROLLER_BUTTON_CLASS);
    this.addEventListener("click", clickHandler);
  }
  focus(section) {
    // DOMRect { x: 8, y: 19.916671752929688, width: 1900, height: 151.8333282470703, top: 19.916671752929688, right: 1908, bottom: 171.75, left: 8 }
    const bounds = section.getBoundingClientRect();
    this.style = `top: ${bounds.top + window.scrollY + 50}px; left: ${bounds.right + window.scrollX - 50}px;`;
  }
}
customElements.define("next-section-layout", NextSectionLayout);
//endfold
class PrevSectionLayout extends HTMLElement { // startfold
  constructor(clickHandler) {
    super();
    this.textContent = "";
    this.classList.add(SECTION_CONTROLLER_BUTTON_CLASS);
    this.addEventListener("click", clickHandler);
  }
  focus(section) {
    // DOMRect { x: 8, y: 19.916671752929688, width: 1900, height: 151.8333282470703, top: 19.916671752929688, right: 1908, bottom: 171.75, left: 8 }
    const bounds = section.getBoundingClientRect();
    this.style = `top: ${bounds.top + window.scrollY + 50}px; left: ${bounds.left + window.scrollX +50}px;`;
  }
}
customElements.define("prev-section-layout", PrevSectionLayout);
// endfold
class MoveSectionUp extends HTMLElement { // startfold
  constructor(clickHandler) {
    super();
    this.textContent = "";
    this.classList.add(SECTION_CONTROLLER_BUTTON_CLASS);
    this.addEventListener("click", clickHandler);
  }
  focus(section) {
    // DOMRect { x: 8, y: 19.916671752929688, width: 1900, height: 151.8333282470703, top: 19.916671752929688, right: 1908, bottom: 171.75, left: 8 }
    const bounds = section.getBoundingClientRect();
    this.style = `top: ${bounds.top + window.scrollY + 10}px; left: ${bounds.right + window.scrollX - 50}px;`;
  }
}
customElements.define("move-section-up", MoveSectionUp);
//endfold
class MoveSectionDown extends HTMLElement { // startfold
  constructor(clickHandler) {
    super();
    this.textContent = "";
    this.classList.add(SECTION_CONTROLLER_BUTTON_CLASS);
    this.addEventListener("click", clickHandler);
  }
  focus(section) {
    // DOMRect { x: 8, y: 19.916671752929688, width: 1900, height: 151.8333282470703, top: 19.916671752929688, right: 1908, bottom: 171.75, left: 8 }
    const bounds = section.getBoundingClientRect();
    this.style = `top: ${bounds.bottom + window.scrollY - 10}px; left: ${bounds.right + window.scrollX - 50}px;`;
  }
}
customElements.define("move-section-down", MoveSectionDown);
//endfold
class RemoveSection extends HTMLElement { // startfold
  constructor(clickHandler) {
    super();
    this.textContent = "";
    this.classList.add(SECTION_CONTROLLER_BUTTON_CLASS);
    this.addEventListener("click", clickHandler);
  }
  focus(section) {
    // DOMRect { x: 8, y: 19.916671752929688, width: 1900, height: 151.8333282470703, top: 19.916671752929688, right: 1908, bottom: 171.75, left: 8 }
    const bounds = section.getBoundingClientRect();
    this.style = `top: ${bounds.bottom + window.scrollY - 10}px; left: ${((bounds.right - bounds.left) / 2) + window.scrollX - 50}px;`;
  }
}
customElements.define("remove-section", RemoveSection);
//endfold

class SectionController {
  // TODO:
  // - add section
  // - All the sub-todos
  // - trigger image optimization job
  constructor() {
      this.buttons = [
        new NextSectionLayout((e) => {this.nextLayout(e)}),
        new PrevSectionLayout((e) => {this.prevLayout(e)}),
        new MoveSectionUp((e) => {this.moveUp(e)}),
        new MoveSectionDown((e) => {this.moveDown(e)}),
        new RemoveSection((e) => {this.removeSection(e)}),
      ];
      this.resizeObserver = new ResizeObserver((entries) => {
          entries.forEach(entry => {
              this.focusButtons(entry.target);
          });
      });
      this.section = null;
  }
  register(section) { // startfold
      section.addEventListener("touchend", (e) => {
          document.activeElement.blur();
          this.takeFocus(section)
      });
      section.addEventListener("mouseenter", (e) => {this.takeFocus(section)});
      section.addEventListener("mouseleave", (e) => {this.removeFocus(section)});
  } // endfold
  focusButtons(section) { // startfold
     this.buttons.forEach(btn => btn.focus(section));
  } // endfold
  attachButtons(section) { // startfold
     this.buttons.forEach(btn => document.body.appendChild(btn));
     this.focusButtons(section);
  } // endfold
  removeButtons() { // startfold
    this.buttons.forEach(btn => btn.remove());
  } // endfold
  takeFocus(section) { // startfold
    const currentFocus = Array.from(document.querySelectorAll("section[data-focus='true']"));
    currentFocus.forEach(sctn => {if (sctn != section) {this.removeFocus(sctn)}});
    if (!currentFocus.includes(section)) {
      this.attachButtons(section);
      this.section = section;
      section.dataset.focus = "true";
      this.resizeObserver.observe(this.section);
    }
  } // endfold
  removeFocus(section) { // startfold
      delete section.dataset.focus;
      this.removeButtons();
      this.resizeObserver.unobserve(this.section);
      console.log("removing");
      const items = Array.from(section.querySelectorAll('[data-editor="item"][data-focus="true"]'));
      items.forEach(itm => itemController.removeFocus(itm)); 
  } // endfold
  prevLayout(event) { // startfold 
      if (this.section == null) {
          console.error("Next Section Clicked Without Focus!");
          return
      }
      // This leverages the global namespace extensively... which is uncomfy.
      // Need to figure out dependency injection.
      const address = getAddress(this.section);
      const node = getDataByAddress(address, pageData);
      const layoutOptions = themeData[pageData.theme][node.type].layouts;
      const curLayout = layoutOptions.find(n => {
        if (n.layout == node.layout && n.template == node.template) return n
      });
      const curLayoutIdx = layoutOptions.indexOf(curLayout);
      const nextLayoutIdx = _prevIndex(curLayoutIdx, layoutOptions);
      const newLayout = layoutOptions[nextLayoutIdx];
      // TODO: move this to an event, and have the handler elsewhere.
      node.layout = newLayout.layout;
      node.template = newLayout.template;
      renderDiff(this.section.dataset.id, pageData);
      attach();
      loadStyles();
      this.takeFocus(document.querySelector(`section[data-id='${this.section.dataset.id}']`));
  } // endfold
  nextLayout(event) { // startfold
      if (this.section == null) {
          console.error("Next Section Clicked Without Focus!");
          return
      }
      // This leverages the global namespace extensively... which is uncomfy.
      // Need to figure out dependency injection.
      const address = getAddress(this.section);
      const node = getDataByAddress(address, pageData);
      const layoutOptions = themeData[pageData.theme][node.type].layouts;
      const curLayout = layoutOptions.find(n => {
        if (n.layout == node.layout && n.template == node.template) return n
      });
      const curLayoutIdx = layoutOptions.indexOf(curLayout);
      const nextLayoutIdx = _nextIndex(curLayoutIdx, layoutOptions);
      const newLayout = layoutOptions[nextLayoutIdx];
      // TODO: move this to an event, and have the handler elsewhere.
      node.layout = newLayout.layout;
      node.template = newLayout.template;
      renderDiff(this.section.dataset.id, pageData);
      attach();
      loadStyles();
      this.takeFocus(document.querySelector(`section[data-id='${this.section.dataset.id}']`));
  } // endfold
  moveUp(event) { // startfold
      if (this.section == null) {
          console.error("Move Up Section Clicked Without Focus!");
          return
      }
      // This leverages the global namespace extensively... which is uncomfy.
      // Need to figure out dependency injection.
      const address = getAddress(this.section);
      const node = getDataByAddress(address, pageData);
      // TODO: This part has too much knowledge of the DOM.
      const mainAddress = getAddress(document.querySelector("main"));
      const main = getDataByAddress(mainAddress, pageData);
      const nodeIdx = main.sections.indexOf(node);
      if (nodeIdx > 0) {
          [main.sections[nodeIdx -1], main.sections[nodeIdx]] = [main.sections[nodeIdx], main.sections[nodeIdx -1]];
          render(pageData);
          attach();
          loadStyles();
          this.takeFocus(document.querySelector(`section[data-id='${this.section.dataset.id}']`));
      }
  } // endfold
  moveDown(event) { // startfold
      if (this.section == null) {
          console.error("Move Down Section Clicked Without Focus!");
          return
      }
      // This leverages the global namespace extensively... which is uncomfy.
      // Need to figure out dependency injection.
      const address = getAddress(this.section);
      const node = getDataByAddress(address, pageData);
      // TODO: This part has too much knowledge of the DOM.
      const mainAddress = getAddress(document.querySelector("main"));
      const main = getDataByAddress(mainAddress, pageData);
      const nodeIdx = main.sections.indexOf(node);
      if (nodeIdx < main.sections.length) {
          [main.sections[nodeIdx], main.sections[nodeIdx+1]] = [main.sections[nodeIdx+1], main.sections[nodeIdx]];
          render(pageData);
          attach();
          loadStyles();
          this.takeFocus(document.querySelector(`section[data-id='${this.section.dataset.id}']`));
      }
  } // endfold
  removeSection(event) { // startfold
      if (this.section == null) {
          console.error("Remove Section called on fake section?");
      }
      const address = getAddress(this.section);
      const node = getDataByAddress(address, pageData);
      // TODO: This part has too much knowledge of the DOM.
      const mainAddress = getAddress(document.querySelector("main"));
      const main = getDataByAddress(mainAddress, pageData);
      const nodeIdx = main.sections.indexOf(node);
      if (nodeIdx != -1 && main.sections.length > 1) {
          main.sections.splice(nodeIdx, 1);
          render(pageData);
          attach();
          loadStyles();
      }
  } // endfold
}
