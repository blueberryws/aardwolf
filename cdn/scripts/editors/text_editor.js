import { ElementEditor } from "./element_editor.js";
import { modalBuilder } from "../modals/base.js";
import { CLEANABLE_ATTR } from "../interfaces/selectors.js";


class TextFragment extends HTMLElement { // startfold
  constructor(textContent) {
    super();
    if (textContent) { this.textContent = textContent };
  }
  clean() { // startfold
    if (this.childNodes == null) {
      return
    }
    let needsCleaning = true;
    while (needsCleaning) {
      needsCleaning = false;
      let curNode = this.firstChild;
      while (curNode) {
        const nextNode = curNode.nextSibling;
        if (
          curNode.nodeType != Node.TEXT_NODE &&
          !["BR", "A"].includes(curNode.nodeName)
        ) {
          const textNode = document.createTextNode(curNode.textContent);
          curNode.replaceWith(textNode);
          curNode = textNode;
          needsCleaning = true;
          break;
        }
        if (nextNode != null && curNode.nodeType == Node.TEXT_NODE && nextNode.nodeType == Node.TEXT_NODE) {
          curNode.appendData(nextNode.textContent);
          nextNode.remove();
          needsCleaning = true;
          break;
        }
        curNode = curNode.nextSibling;
      }
    }
  } // endfold
  compareStyle(other) { // startfold
    if (other == null || other.nodeName != "TEXT-FRAGMENT") {
      return false;
    }
    if (this.dataset.break === "true" || other.dataset.break === "true") return false;
    const otherClassList = Array.from(other.classList).sort();
    const thisClassList = Array.from(this.classList).sort();
    const classMatch = thisClassList.toString() == otherClassList.toString()
    const hrefMatch = this.href == other.href;
    return classMatch && hrefMatch
  } // endfold
  mergeWith(other) { // startfold
    if (this.classList.contains("linked-text")) {
      const otherLink = other.querySelector("a");
      const thisLink = this.querySelector("a");
      for (const child of otherLink.childNodes) {
        thisLink.appendChild(child);
      }
    } else {
      for (const child of other.childNodes) {
        this.appendChild(child);
      }
    }
  } // endfold
  splitAt(idx) { // startfold
    const newNode = this.cloneNode(true);
    const textContent = this.textContent;
    if (this.classList.contains("linked-text")) {
      const thisLink = this.querySelector("a");
      thisLink.textContent = textContent.substring(0, idx);
      const newLink = newNode.querySelector("a");
      newLink.textContent = textContent.substring(idx);
    } else {
      this.textContent = this.textContent.substring(0, idx);
      newNode.textContent = newNode.textContent.substring(idx);
    }
    return newNode;
  } // endfold
  addHref(href) { // startfold
    const newA = document.createElement("a");
    const textContent = this.textContent;
    newA.href = href;
    newA.textContent = textContent;
    this.innerHTML = "";
    this.appendChild(newA);
  } // endfold
  removeHref() { // startfold
    const textContent = this.textContent;
    this.innerHTML = "";
    this.textContent = textContent;
  } // endfold
}
customElements.define("text-fragment", TextFragment);
// endfold

// TODO:
// - clear formating
// - wrap with Link
// - pick font type
// - fix selection after application bug
// - ~~pick size~~
//   - "esc" should close menu, so should changing selection or typing.
//   - need classes for the various sizes

export class SizeSelector extends HTMLElement { // startfold
  constructor(textEditor) {
    super();
    this.dataset.currentlyOn = "false";

    this.editor = textEditor;

    this.classList.add("rich-text-option");
    this.dataset.selected = "false";

    this.label = document.createElement("label");
    const curSize = this.editor.element.dataset.fontSize || "default";
    this.label.innerText = curSize;
    this.appendChild(this.label);

    this.large = this.makeSizeButton("large");
    this.medium = this.makeSizeButton("medium");
    this.small = this.makeSizeButton("small");

    this.defaultSize = document.createElement("button");
    this.defaultSize.innerText = "default";
    this.defaultSize.addEventListener("mousedown", (e) => {
      e.preventDefault();
    });
    this.defaultSize.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.editor.element.classList.remove("sized-text");
      delete this.editor.element.dataset.fontSize;
      this.label.innerText = "default";
      this.dataset.selected = "false";
    });
    this.appendChild(this.defaultSize);
    this.appendChild(this.large);
    this.appendChild(this.medium);
    this.appendChild(this.small);

    this.addEventListener("mousedown", (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
    this.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.dataset.selected = this.dataset.selected == "true" ? "false" : "true";
    });
  }
  makeSizeButton(size) {
    const button = document.createElement("button");
    button.innerText = size;
    button.addEventListener("mousedown", (e) => {
      e.preventDefault();
    });
    button.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.dataset.selected = "false";
      this.editor.element.classList.add("sized-text");
      this.editor.element.dataset.fontSize = size;
      this.label.innerText = size;
    });
    return button;
  }
}
customElements.define("size-selector", SizeSelector);
// endfold

export class TextEditor extends ElementEditor {
  constructor(element) {
    super();
    this.element = element;
    this.element.addEventListener("input", (event) => this.clean(event));
    this.element.addEventListener("focusout", (event) => this.removeFocus(event));
    this.element.addEventListener("focusin", (event) => this.getFocus(event));
    this.element.setAttribute(`data-${CLEANABLE_ATTR}`, true);
    this.element.addEventListener("beforeinput", (e) => {
      if (e.inputType === "insertParagraph" || e.inputType === "insertLineBreak") {
        e.preventDefault();
        this._insertNewlineAtCaret();
      }
    });
    // Fallback for environments that don't reliably fire beforeinput.
    this.element.addEventListener("keydown", (e) => {
      if ((e.key === "Enter" || e.keyCode === 13) && !e.isComposing) {
        e.preventDefault();
        this._insertNewlineAtCaret();
      }
    });
    this.element.style.whiteSpace = "pre-wrap";


    const linkButton = document.createElement("button");
    linkButton.classList.add("linked-button");
    linkButton.classList.add("rich-text-option");
    linkButton.textContent = "🔗";
    linkButton.addEventListener("mousedown", (e) => e.preventDefault());
    linkButton.addEventListener("click", (e) => {
      e.preventDefault();
      const selectionObj = this.getSelection();
      const selection = selectionObj.selectionEvent;
      const [finalAnchorOffset, finalFocusOffset] = this.extractSelection(selection);
      if (linkButton.dataset.currentlyOn == "true") {
        this.toggleStyle("linked-text", selectionObj, (element) => {
          console.log(element);
          element.removeHref();
          element.classList.remove("linked-text");
        });
      } else {
        modalBuilder()
          .setHeaderText("Set Link Destination")
          .contentHTML(`
                <label>Link Destination</link>
                <input id="set-link-destination-input"></input>
                `)
          .actionFunc(() => {
            this.setSelection(selection, finalAnchorOffset, finalFocusOffset);
            this.toggleStyle('linked-text', selectionObj, (element) => {
              const destination = document.getElementById("set-link-destination-input").value;
              element.addHref(destination);
              element.classList.add("linked-text");
            });
          })
          .showMe()
      }
    });
    const clearButton = document.createElement("button");
    clearButton.classList.add("clear-button");
    clearButton.classList.add("rich-text-option");
    clearButton.textContent = "⌫";
    clearButton.addEventListener("mousedown", (e) => e.preventDefault());
    clearButton.addEventListener("click", (e) => {
      e.preventDefault();
      this.toggleStyle("clear", this.getSelection(), (element) => {
        element.removeHref();
      });
    });
    this.stateRegistry = {};
    this.stateRegistry["linked-text"] = linkButton;
    this.sizeSelector = new SizeSelector(this);

    this.richTextOptions = [
      this.makeRichTextButton("bold", "𝐁"),
      this.makeRichTextButton("italic", "𝐼"),
      this.makeRichTextButton("underline", "U"),
      linkButton,
      clearButton,
      this.sizeSelector,
    ]

    this._stateCalculator = (event) => { this.calculateSelectionState(event) };
  }

  calculateSelectionState(event) { // startfold
    const selectionObj = this.getSelection();
    const selection = selectionObj.selectionEvent;

    if (selection.rangeCount != 1) {
      return
    }
    let anchorNode = selection.direction == "forward" ? selection.anchorNode : selection.focusNode;
    const anchorParent = anchorNode.parentElement.closest("text-fragment");
    for (const className in this.stateRegistry) {
      let inRange = false;
      let hasClass = [];
      for (const child of this.element.childNodes) {
        if (child.isSameNode(anchorParent)) {
          inRange = true;
        }
        if (inRange) {
          hasClass.push(child.classList.contains(className));
        }
        if (child.isSameNode(anchorParent)) {
          inRange = false
        };
      }
      this.stateRegistry[className].dataset.currentlyOn = hasClass.every(Boolean) && hasClass.length > 0;
    }
  } // endfold

  setSelection(selection, anchorOffset, focusOffset) {
    const range = document.createRange();
    let current = 0;

    for (const frag of this.element.children) {
      const len = frag.textContent.length;
      const textNode = (frag.querySelector('a') || frag).childNodes[0];

      if (anchorOffset >= current && anchorOffset <= current + len) {
        range.setStart(textNode, anchorOffset - current);
      }
      if (focusOffset >= current && focusOffset <= current + len) {
        range.setEnd(textNode, focusOffset - current);
        break;
      }
      current += len;
    }

    selection.removeAllRanges();
    selection.addRange(range);
  } // endfold

  getSelection() {
    let selection = window.getSelection();
    let selectionText = selection.toString();
    let textFgmts = this.element.querySelectorAll('text-fragment');
    if (textFgmts.length === 0) {
      textFgmts = [new TextFragment(this.element.childNodes[0].nodeValue)];
    }

    let selectionObj = { 'selection-text': selectionText, 'current-setup': [], 'data-ref': {}, };
    for (let textFgmt of textFgmts) {
      let txt = textFgmt.textContent ?? "";
      const classes = new Set(textFgmt.classList);
      let href = null;
      const a = textFgmt.querySelector('a');
      if (a) {
        href = a.getAttribute('href');
      }
      selectionObj["current-setup"].push({ text: txt, classes, href });
    }
    selectionObj.selectionEvent = selection;
    return selectionObj;
  }

  makeRichTextButton(name, text) { // startfold
    const styleClass = `${name}-text`;
    const buttonClass = `${name}-button`;
    const button = document.createElement("button");
    button.classList.add(buttonClass);
    button.classList.add("rich-text-option");
    button.textContent = text;
    button.addEventListener("mousedown", (e) => e.preventDefault());
    button.addEventListener("click", (e) => {
      e.preventDefault();
      this.toggleStyle(styleClass)
    });
    this.stateRegistry[styleClass] = button;
    return button;
  } // endfold

  toggleStyle(styleClass, selectionObj = null, callback = null) {

    // FIXME: you can't select a fontstyle without selecting text first
    // FIXME: does this work with ctrl u/b/i?

    const selection = selectionObj ?? this.getSelection();
    const selectionText = selection['selection-text'];
    if (!selectionText) {
      return;
    }
    const { selectionEvent } = selection;
    const currentSetup = selection['current-setup']; // ordered array [{text, classes(Set), href}]

    // 2. Reconstruct the full text (preserve order; keep "\n")
    const fullString = currentSetup.map(p => p.text).join('');

    // Map absolute offsets → {classes, href}
    const newSetup = {};
    let offset = 0;
    for (const part of currentSetup) {
      const txt = part.text;
      if (txt !== "") {
        newSetup[offset] = {
          classes: new Set(Array.from(part.classes)),
          href: part.href ?? null
        };
        offset += txt.length;
      }
    }
    newSetup[fullString.length] = { classes: new Set(), href: null };

    const [newIdx, end] = this.extractSelection(selectionEvent);

    // Force cut points at every newline
    for (let i = 0; i < fullString.length; i++) {
      if (fullString[i] === "\n") {
        if (!(i in newSetup)) {
          const prevKey = Object.keys(newSetup).map(Number).filter(k => k <= i).sort((a, b) => b - a)[0];
          const prev = newSetup[prevKey] || { classes: new Set(), href: null };
          newSetup[i] = { classes: new Set(prev.classes), href: prev.href, isBreak: true };
        } else {
          newSetup[i].isBreak = true;
        }
        if (!((i + 1) in newSetup)) {
          const prev = newSetup[i];
          newSetup[i + 1] = { classes: new Set(prev.classes), href: prev.href };
        }
      }
    }
    const sorted = Object.keys(newSetup).map(Number).sort((a, b) => a - b);
    let found = false;
    let prev = -1;
    let affected = [];
    for (const index of sorted) {
      if (!found) {
        if (index < newIdx) {
          prev = index;
          continue;
        }
        found = true;
        if (index != newIdx) {
          newSetup[newIdx] = { classes: new Set(), href: null };
          if (prev != -1) {
            for (const c of newSetup[prev].classes) newSetup[newIdx].classes.add(c);
            newSetup[newIdx].href = newSetup[prev].href;
          }
        }
      }

      if (index == end) {
        break
      }
      else if (index > end) {
        newSetup[end] = { classes: new Set(), href: null };
        if (prev != -1) {
          for (const c of newSetup[prev].classes) newSetup[end].classes.add(c);
          newSetup[end].href = newSetup[prev].href;
        }
        break;
      }
      affected.push(index);
      prev = index;
    }
    if (!affected.includes(newIdx)) {
      affected.push(newIdx);
    }
    affected = affected.filter(idx => !newSetup[idx].isBreak);

    if (!Object.prototype.hasOwnProperty.call(newSetup, end)) {
      newSetup[end] = { classes: new Set(), href: null };
    }

    let turnOff = true;
    for (let idx of affected) {
      if (!Object.prototype.hasOwnProperty.call(newSetup, end)) {
        newSetup[idx] = { classes: new Set(), href: null };
      }
      if (!newSetup[idx].classes.has(styleClass)) {
        turnOff = false;
      }
    }
    for (let idx of affected) {
      if (styleClass === "clear") {
        newSetup[idx] = { classes: new Set(), href: null };
      }
      else if (turnOff) {
        newSetup[idx].classes.delete(styleClass);
      } else {
        newSetup[idx].classes.add(styleClass);
      }
    }
    this.applyStyle(newSetup, fullString, selection.selectionEvent, affected, callback);
  }


  triggerFocus(element) {
    let eventType = "onfocusin" in element ? "focusin" : "focus";
    let bubbles = "onfocusin" in element;
    let event;

    if ("createEvent" in document) {
      event = document.createEvent("Event");
      event.initEvent(eventType, bubbles, true);
    }
    else if ("Event" in window) {
      event = new Event(eventType, { bubbles: bubbles, cancelable: true });
    }

    element.focus();
    element.dispatchEvent(event);
  }

  getFocus(event) { // startfold
    event.preventDefault();
    if (this._isWrapped) return;

    const wrapper = document.createElement("div");
    wrapper.style.position = "relative";
    wrapper.classList.add("text-editor-wrapper");
    this.element.parentNode.insertBefore(wrapper, this.element);
    wrapper.appendChild(this.element);
    this._wrapper = wrapper;
    this._isWrapped = true;

    const toolbar = document.createElement("div");
    toolbar.classList.add("rich-text-toolbar");
    this._toolbar = toolbar;

    this.richTextOptions.forEach(btn => toolbar.appendChild(btn));
    wrapper.appendChild(toolbar);

    document.addEventListener("selectionchange", this._stateCalculator);
    this.triggerFocus(this.element)
  } // endfold

  removeFocus(event) { // startfold
    event.preventDefault();
    if (!this._isWrapped) return;

    document.removeEventListener("selectionchange", this._stateCalculator);

    this._toolbar.remove();
    this._toolbar = null;

    this._wrapper.parentNode.insertBefore(this.element, this._wrapper);
    this._wrapper.remove();
    this._wrapper = null;
    this._isWrapped = false;

    this.clean();
  } // endfold

  applyStyle(setup, fullString, selectionEvent, affected, callback = null) { // startfold
    const [anchorOffset, focusOffset] = this.extractSelection(selectionEvent);

    let prevItems = this.element.querySelectorAll('text-fragment');
    if (prevItems.length === 0) {
      this.element.childNodes[0].remove();
    }
    else {
      for (let i of prevItems) {
        i.remove();
      }
    }
    const endpoint = this.element.querySelector('*:first-child');

    let indices = Object.keys(setup).map(n => Number(n)).sort((a, b) => a - b);
    for (let i = 0; i < indices.length; i++) {
      const start = indices[i];
      const stop = (i < indices.length - 1) ? indices[i + 1] : fullString.length;
      const textContent = fullString.substring(start, stop);
      let fgmt = document.createElement("text-fragment");
      if (textContent === "\n") {
        fgmt.appendChild(document.createTextNode("\n"));
        fgmt.dataset.break = "true";
      } else if (setup[start].href) {
        const a = document.createElement("a");
        a.setAttribute("href", setup[start].href);
        a.appendChild(document.createTextNode(textContent));
        fgmt.appendChild(a);
      } else {
        fgmt.appendChild(document.createTextNode(textContent));
      }
      fgmt.classList.add(...Array.from(setup[start].classes));

      if (affected.includes(start) && callback != null) {
        callback(fgmt)
      }
      this.element.insertBefore(fgmt, endpoint);
    }
    this.clean();
    this.setSelection(selectionEvent, anchorOffset, focusOffset);
    this.calculateSelectionState();
  } // endfold

  extractSelection(selection) { // startfold
    let anchorParent = selection.anchorNode.nodeName == "TEXT-FRAGMENT" ? selection.anchorNode : selection.anchorNode.parentElement.closest("text-fragment");
    let focusParent = selection.focusNode.nodeName == "TEXT-FRAGMENT" ? selection.focusNode : selection.focusNode.parentElement.closest("text-fragment");
    let anchorOffset = selection.anchorOffset;
    let focusOffset = selection.focusOffset;
    if (selection.direction == "backward") {
      [anchorParent, focusParent] = [focusParent, anchorParent];
      [anchorOffset, focusOffset] = [focusOffset, anchorOffset];
    }
    let finalAnchorOffset = 0;
    let finalFocusOffset = 0;
    let currentOffset = 0;
    if (anchorParent == null && focusParent == null) {
      finalAnchorOffset = anchorOffset;
      finalFocusOffset = focusOffset;
    }
    else {
      for (const child of this.element.childNodes) {
        const nodeLength = child.textContent.length;
        if (child.isSameNode(anchorParent)) {
          finalAnchorOffset = currentOffset + anchorOffset;
        }
        if (child.isSameNode(focusParent)) {
          finalFocusOffset = currentOffset + focusOffset;
        }
        currentOffset += nodeLength;
      }

    }

    return [finalAnchorOffset, finalFocusOffset];
  } // endfold

  _insertNewlineAtCaret() { // startfold
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    let range = sel.getRangeAt(0);

    // Capture absolute start BEFORE we mutate DOM so we can restore caret by index.
    const [absStart] = this.extractSelection(sel);

    // If selection is a range, delete it first so we're collapsed.
    if (!sel.isCollapsed) {
      range.deleteContents();
      range = sel.getRangeAt(0);
    }

    // Insert a plain text node containing "\n" at the caret.
    const nlText = document.createTextNode("\n");
    range.insertNode(nlText);

    // Move caret immediately after the inserted newline in the live DOM.
    range.setStartAfter(nlText);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);

    // Normalize DOM to your canonical model; selection will be rebuilt by absolute index.
    this.clean();
    const newCaret = absStart + 1; // count the inserted "\n"
    this.setSelection(window.getSelection(), newCaret, newCaret);
    this.calculateSelectionState();
  } // endfold

  clean(e) { // startfold
    if (this.element.childNodes == null) {
      return
    }
    let needsCleaning = true;
    while (needsCleaning) {
      needsCleaning = false;
      for (const curNode of this.element.childNodes) {
        let nextNode = curNode.nextSibling;
        if (curNode.nodeType != Node.TEXT_NODE && curNode.classList.contains("rich-text-option")) {
          continue
        }
        if (curNode.nodeType == Node.TEXT_NODE || curNode.nodeName != "TEXT-FRAGMENT") {
          let newFragment;
          if (curNode.nodeName === "DIV" || curNode.nodeName === "BR") {
            newFragment = new TextFragment("\n");
            newFragment.dataset.break = "true";
          }
          else {
            newFragment = new TextFragment(curNode.textContent);
          }
          curNode.replaceWith(newFragment);
          needsCleaning = true;
          break;
        }
        if (curNode.compareStyle(nextNode)) {
          let mergeNode = nextNode;
          nextNode = nextNode.nextSibling;
          curNode.mergeWith(mergeNode);
          mergeNode.remove();
          needsCleaning = true;
          break;
        }
        curNode.clean();
      }
    }
    if (this.element.textContent === "") {
      const sel = window.getSelection();
      const range = document.createRange();
      // select the (empty) contents of your editor…
      range.selectNodeContents(this.element);
      // …and collapse it to its end
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }

  getHTMLContent() { // startfold
    this.clean();
    return `<${this.element.elementType} is="${this.element.elementName}">${this.element.innerText}</${this.element.elementType}>`;
  } // endfold
  getJSONContent() { // startfold
    this.clean();
    return {
      elementType: this.element.ElementType,
      attributes: { is: this.element.elementName },
      content: this.element.innerText
    }
  } // endfold

  setEditable() { // startfold
    this.element.contentEditable = true
  } // endfold

  unsetEditable() { // startfold
    console.log("unset editable called");
    this.element.removeAttribute("contentEditable");
    this.removeRichTextOptions();
  } // endfold
}
