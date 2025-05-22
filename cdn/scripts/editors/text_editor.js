import { ElementEditor } from "./element_editor.js";
import { modalBuilder } from "../modals/base.js";


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
      for (const curNode of this.childNodes) {
        const nextNode = curNode.nextSibling;
        if (
          curNode.nodeType != Node.TEXT_NODE &&
          !["BR", "A"].includes(curNode.nodeName)
        ) {
          const textNode = document.createTextNode(curNode.textContent);
          textNode.appendData(" ");
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
      }
    }
  } // endfold
  compareStyle(other) { // startfold
    if (other == null || other.nodeName != "TEXT-FRAGMENT") {
      return false;
    }
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
        this.dataset.selected="false";

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

        const linkButton = document.createElement("button");
        linkButton.classList.add("linked-button");
        linkButton.classList.add("rich-text-option");
        linkButton.textContent = "🔗";
        linkButton.addEventListener("mousedown", (e) => e.preventDefault());
        linkButton.addEventListener("click", (e) => {
          e.preventDefault();
          const selection = this.getSelection();
          const [finalAnchorOffset, finalFocusOffset] = this.extractSelection(selection);
          if (linkButton.dataset.currentlyOn == "true") {
              this.applyStyle(selection, (element) => {
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
                  this.applyStyle(selection, (element) => {
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
            const selection = this.getSelection();
            this.applyStyle(selection, (element) => {
                  element.removeHref();
                  element.classList = [];
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

        this._stateCalculator = (event) => {this.calculateSelectionState(event)};
    }

    getSelection() { // startfold
        let selection = window.getSelection();
        if (selection.type == "Caret") {
            return selection;
        }
        let anchorParent = selection.anchorNode.nodeName == "TEXT-FRAGMENT" ? selection.anchorNode : selection.anchorNode.parentElement.closest("text-fragment");
        let focusParent = selection.focusNode.nodeName == "TEXT-FRAGMENT" ? selection.focusNode : selection.focusNode.parentElement.closest("text-fragment");

        if (anchorParent == null || focusParent == null) {
            const allFragments = this.element.querySelectorAll("text-fragment");
            const start = this.element.querySelector("text-fragment");
            const endNode = allFragments[allFragments.length-1];
            const end = (endNode.querySelector("a") || endNode).childNodes[0];
            let range = document.createRange();
            range.setStart(start, 0);
            if (end != null) {
                range.setEnd(end, end.textContent.length);
            } else {
                range.setEnd(endNode, 0);
            }
            selection.removeAllRanges();
            selection.addRange(range);
        }
        return selection;
    } // endfold
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
          const selection = this.getSelection();
          // If has bold, remove
          if (button.dataset.currentlyOn == "true") {
              this.applyStyle(selection, (element) => element.classList.remove(styleClass));
          } else {
              this.applyStyle(selection, (element) => element.classList.add(styleClass));
          }
        });
        this.stateRegistry[styleClass] = button;
        return button;
    } // endfold
    addRichTextOptions() { // startfold
        this.richTextOptions.forEach(el => {
            this.element.appendChild(el);
        });
    } // endfold
    removeRichTextOptions() { // startfold
        this.richTextOptions.forEach(el => {
            el.remove();
        });
    } // endfold
    getFocus(event) { // startfold
        this.addRichTextOptions();
        this.clean();
        document.addEventListener("selectionchange", this._stateCalculator);
    } // endfold
    removeFocus(event) { // startfold
        this.removeRichTextOptions();
        this.clean();
        document.removeEventListener("selectionchange", this._stateCalculator);
    } // endfold
    calculateSelectionState(event) { // startfold
        const selection = this.getSelection();
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
            const newFragment = new TextFragment(curNode.textContent);
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
  } // endfold
  applyStyle(selection, callback) { // startfold
    let {anchorNode, anchorOffset, focusNode, focusOffset} = selection;
    if (selection.direction == "caret") {
        return
    }
    if (selection.direction == "backward") {
        [anchorNode, focusNode] = [focusNode, anchorNode];
        [anchorOffset, focusOffset] = [focusOffset, anchorOffset];
    }
    let anchorParent = selection.anchorNode.nodeName == "TEXT-FRAGMENT" ? selection.anchorNode : selection.anchorNode.parentElement.closest("text-fragment");
    let focusParent = selection.focusNode.nodeName == "TEXT-FRAGMENT" ? selection.focusNode : selection.focusNode.parentElement.closest("text-fragment");
    const [finalAnchorOffset, finalFocusOffset] = this.extractSelection(selection);

    let inMiddle = false;
    if (anchorNode === focusNode) {
      const second = anchorParent.splitAt(anchorOffset);
      const third = second.splitAt(focusOffset-anchorOffset);
      anchorParent.after(second);
      second.after(third);
      callback(second);
    } else {
        for (const child of this.element.children) {
            if (child === anchorParent) {
              inMiddle = true;
              const newNode = child.splitAt(anchorOffset);
              child.after(newNode);
            } else if (child === focusParent) {
              inMiddle = false;
              const newNode = child.splitAt(focusOffset);
              child.after(newNode);
              callback(child);
            } else if (inMiddle) {
              callback(child);
            }
        }
    }
    this.clean();
    this.setSelection(selection, finalAnchorOffset, finalFocusOffset);
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
      return [finalAnchorOffset, finalFocusOffset];
  } // endfold
  setSelection(selection, anchorOffset, focusOffset) { // startfold
      let range = document.createRange();
      let setAnchor = false;
      let setFocus = false;
      let currentLength = 0;
      for (const child of this.element.children) {
        const nodeLength = child.textContent.length;
        const nodeEnd = currentLength + nodeLength;
        const textNode = (child.querySelector("a") || child).childNodes[0];
        if (!setAnchor && nodeEnd > anchorOffset) {
            const localAnchorOffset = anchorOffset - currentLength;
            range.setStart(textNode, localAnchorOffset);
            setAnchor = true;
        }
        if (!setFocus && nodeEnd >= focusOffset) {
            const localFocusOffset = focusOffset - currentLength;
            range.setEnd(textNode, localFocusOffset);
            setFocus = true;
        }
        currentLength = nodeEnd;
      }
      selection.removeAllRanges();
      selection.addRange(range);
  } // endfold
  getHTMLContent() { // startfold
    this.clean();
    return `<${this.element.elementType} is="${this.element.elementName}">${this.element.innerText}</${this.element.elementType}>`;
  } // endfold
  getJSONContent() { // startfold
    this.clean();
    return {
        elementType: this.element.ElementType,
        attributes: {is: this.element.elementName},
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
