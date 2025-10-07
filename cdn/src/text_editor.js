const TEXT_STYLE = "text-style-button";
class BoldButton extends HTMLElement { // startfold
    constructor(clickHandler) {
      super();
      this.classList.add(TEXT_STYLE);
      this.textContent = "B";
      this.addEventListener("mousedown", clickHandler);
    }
    focus(text) {
      const bounds = text.getBoundingClientRect();
      this.style = `top: ${bounds.top + window.scrollY - 10}px; left: ${bounds.left + window.scrollX + 10}px;`;
    }
}
customElements.define('bold-button', BoldButton);
// endfold
class ItalicButton extends HTMLElement { // startfold
    constructor(clickHandler) {
      super();
      this.classList.add(TEXT_STYLE);
      this.textContent = "i";
      this.addEventListener("mousedown", clickHandler);
    }
    focus(text) {
      const bounds = text.getBoundingClientRect();
      this.style = `top: ${bounds.top + window.scrollY - 10}px; left: ${bounds.left + window.scrollX + 30}px;`;
    }
}
customElements.define('italic-button', ItalicButton);
// endfold
class UnderlineButton extends HTMLElement { // startfold
    constructor(clickHandler) {
      super();
      this.classList.add(TEXT_STYLE);
      this.textContent = "U";
      this.addEventListener("mousedown", clickHandler);
    }
    focus(text) {
      const bounds = text.getBoundingClientRect();
      this.style = `top: ${bounds.top + window.scrollY - 10}px; left: ${bounds.left + window.scrollX + 50}px;`;
    }
}
customElements.define('unerline-button', UnderlineButton);
// endfold
class LinkButton extends HTMLElement { // startfold
    constructor(saveHandler) {
      super();
      this.classList.add(TEXT_STYLE);
      this.textContent = "+";
      this.addEventListener("mousedown", (e) => {
        new EditTextLinkModal(currentDestination, saveFunc);
      });
    }
    focus(text) {
      const bounds = text.getBoundingClientRect();
      this.style = `top: ${bounds.top + window.scrollY - 10}px; left: ${bounds.left + window.scrollX + 70}px;`;
    }
}
customElements.define('link-button', LinkButton);
// endfold
class EditTextLinkModal extends HTMLElement { // startfold
    constructor(currentDestination, saveFunc) {
        super();
        this.saveFunc = saveFunc;
        attachHTML(this, `
            <dialog data-name="modal">
              <h2>Edit Link</h2>
              <label>Destination:</label>
              <input data-name="link" value="${currentDestination}"></input>
              <button data-name="cancel">Cancel</button>
              <button data-name="save">Save</button>
            </dialog>
        `);
        document.body.appendChild(this);
        this.addEventListener("click", (e) => {this.handleClick(e)});
        this.modal.showModal();
    }
    handleClick(e) {
      if (e.target == this.cancel) {
        this.remove();
      }
      if (e.target == this.save) {
        this.saveFunc(this.link.value);
        this.remove();
      }
    }
}
customElements.define("edit-text-link-modal", EditTextLinkModal);
// endfold


// TODO:
// - links
// - clear styles
// - set font size

function* textWalker(root) { // startfold
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
  while (walker.nextNode()) yield walker.currentNode;
} // endfold
function rangeToOffsets(root, range) { // startfold
  let start = null, end = null, pos = 0;

  for (const node of textWalker(root)) {
    const len = node.nodeValue.length;

    if (node === range.startContainer) {
      start = pos + range.startOffset;
    }
    if (node === range.endContainer) {
      end = pos + range.endOffset;
    }

    pos += len;
  }

  return { start, end };
} // endfold
function offsetsToRange(root, { start, end }) { // startfold
  const range = document.createRange();
  let pos = 0, startNode = null, endNode = null;
  let startOffset, endOffset;

  for (const node of textWalker(root)) {
    const len = node.nodeValue.length;

    if (start != null && !startNode && pos + len >= start) {
      startNode = node;
      startOffset = start - pos;
    }
    if (end != null && !endNode && pos + len >= end) {
      endNode = node;
      endOffset = end - pos;
    }
    pos += len;

    if (startNode && endNode) break;
  }

  if (startNode && endNode) {
    range.setStart(startNode, startOffset);
    range.setEnd(endNode, endOffset);
    return range;
  }
  return null; // failed
} // endfold
function duplicateFragment(frag) {
  let newFrag = JSON.parse(JSON.stringify(frag));
  dataController.makeNewIds(newFrag); 
  return newFrag
}

class TextController {
  constructor() {
      this.richTextButtons = [
        new BoldButton((e) => this.boldSelection(e)),
        new ItalicButton((e) => this.italicizeSelection(e)),
        new UnderlineButton((e) => this.underlineSelection(e)),
      ];
      this.text = null;
  }
  addButtons(e) { // startfold
    this.richTextButtons.forEach(btn => {
        document.body.appendChild(btn);
        btn.focus(e.target);
    });
  } // endfold
  removeButtons() { // startfold
     this.richTextButtons.forEach(btn => {
         btn.remove();
     });
  } // endfold
  getSelection() { // startfold
    const selection = window.getSelection();
    const anchor = selection.anchorNode;
    const span = anchor.nodeType == Node.TEXT_NODE ? anchor.parentElement : anchor;
    const textNode = span.closest(`[data-editor='text']`);
    const nodeId = textNode.dataset.id;
    const range = selection.getRangeAt(0);
    const offsets = rangeToOffsets(textNode, range);
    offsets['nodeId'] = nodeId;
    return offsets;
  } // endfold
  setSelection(selection) { // startfold
    const sel = window.getSelection();
    const newRange = offsetsToRange(document.querySelector(`[data-id='${selection.nodeId}']`), selection);
    sel.removeAllRanges();
    sel.addRange(newRange);
  } // endfold
  italicizeSelection(e) { // startfold
    e.preventDefault();
    this.applyStyle("italic");
  } // endfold
  underlineSelection(e) { // startfold
    e.preventDefault();
    this.applyStyle("underline");
  } // endfold
  boldSelection(e) { // startfold
    e.preventDefault();
    this.applyStyle("bold");
  } // endfold
  applyStyle(styleName) { // startfold
    const selection = this.getSelection();
    this.updateData(document.querySelector(`[data-id='${selection.nodeId}']`));
    const node = dataController.byId(selection.nodeId);
    const fragments = node.data.fragments;

    // Get the list of classes for ALL nodes with some part in the affected area.
    let fPos = 0;
    const allContain = fragments.reduce(
      (acc, frag) => {
        const textStart = fPos;
        const textEnd = frag.text.length + fPos;
        fPos = textEnd;
        if (
          (selection.start >= textStart && selection.start < textEnd) ||
          (selection.end > textStart && selection.end <= textEnd) ||
          (selection.start <= textStart && selection.end >= textEnd)
        ) {
          return (frag.styles || []).includes(styleName) && acc
        } else {
          return acc && true
        }
      },
      true
    );

    // op == "bold" if all(classes.contain('bold') : "unbold"
    let apply;
    if (allContain) {
      apply = (frag) => {frag.styles = frag.styles.filter(style => style != styleName)};
    } else {
      apply = (frag) => {
        if (frag.styles == null) {
          frag.styles = [];
        }
        if (!frag.styles.includes(styleName)) {
          frag.styles.push(styleName);
        }
      }
    };

    let pos = 0;
    let idx = 0;
    while (idx < fragments.length) {
      const frag = fragments[idx];
      const fragEnd = pos + frag.text.length;
      const nextPos = pos + frag.text.length;
      const matches = {
        noSpan: selection.start == selection.end,
        fullNode: selection.start <= pos && selection.end >= fragEnd,
        midStart: selection.start > pos && selection.end >= fragEnd,
        midEnd: selection.start <= pos && selection.end > pos && selection.end < fragEnd,
        partial: selection.start > pos && selection.end < fragEnd,
      }
      // if caret: to nothing for now
      if (matches.noSpan) {

      // if full-node: apply
      } else if (matches.fullNode) {
        apply(frag);
      // if mid-start: split and apply to end
      } else if (matches.midStart) {
        let newFrag = duplicateFragment(frag);
        const cutPoint = selection.start - pos;
        newFrag.text = frag.text.slice(cutPoint);
        frag.text = frag.text.slice(0, cutPoint);
        apply(newFrag);
        fragments.splice(idx + 1, 0, newFrag);
        idx += 1;
        dataController._buildTree(dataController.raw, null);
      // if mid-end: split and apply to start
      } else if (matches.midEnd) {
        let newFrag = duplicateFragment(frag);
        const cutPoint = selection.end - pos;
        newFrag.text = frag.text.slice(cutPoint);
        frag.text = frag.text.slice(0, cutPoint);
        apply(frag);
        fragments.splice(idx + 1, 0, newFrag);
        idx += 1;
        dataController._buildTree(dataController.raw, null);
      // if partial-of-single-node: split twice, and apply to middle
      }  else if (matches.partial) {
        const firstCut = selection.start - pos;
        const secondCut = selection.end - pos;

        const firstText = frag.text.slice(0, firstCut);
        const secondText = frag.text.slice(firstCut, secondCut);
        const thirdText = frag.text.slice(secondCut);

        frag.text = firstText;

        let secondFrag = duplicateFragment(frag);
        secondFrag.text = secondText;
        fragments.splice(idx + 1, 0, secondFrag);
        apply(secondFrag);
        dataController._buildTree(dataController.raw, null);

        let thirdFrag = duplicateFragment(frag);
        thirdFrag.text = thirdText;
        fragments.splice(idx + 2, 0, thirdFrag);
        dataController._buildTree(dataController.raw, null);
        idx += 2;
      }
      pos = nextPos;
      idx += 1;
    };

    let cleanIdx = 0;
    while (cleanIdx < fragments.length) {
      const frag = fragments[cleanIdx];
      const fragStyles = JSON.stringify((frag.styles || []).sort());
      const next = fragments[cleanIdx + 1];
      const nextStyles = next == null ? "" : JSON.stringify((next.styles || []).sort());
      if (frag.text == null || frag.text == "") {
        fragments.splice(cleanIdx, 1);
      } else if (fragStyles == nextStyles && (frag.link || "") == (next.link || "")) {
        frag.text += next.text;
        fragments.splice(cleanIdx + 1, 1);
      } else {
        cleanIdx += 1; 
      }
    }
    dataController._buildTree(dataController.raw, null);
    renderDiff(node.id, pageData);
    attach();
    this.setSelection(selection);
  } // endfold
  updateData(text) { // startfold
    const fragNodes = Array.from(text.children);
    const fragments = fragNodes.map(f => {
        return {
        id: f.dataset.id,
        text: f.textContent,
        styles: Array.from(f.classList),
        link: f.href,
    }});
    const address = getAddress(text);
    // TODO: move this to an event, and have the handler elsewhere.
    const node = getDataByAddress(address, pageData);
    node.fragments = fragments;
  } // endfold
  register(el) { // startfold
      // TODO: Handle Newlines. Right now, they just munged into a single line.
      el.addEventListener("mousedown", (e) => {
          const section = el.closest("section");
          if (section.dataset.focus != "true") {
            e.preventDefault();
          }
          this.text = el;
      });
      el.addEventListener("touchstart", (e) => {
          const section = el.closest("section");
          if (section.dataset.focus != "true") {
            e.preventDefault();
          }
      });

      el.setAttribute("contenteditable", true);
      el.addEventListener("focus", e => {
          this.text = e.target;
          this.addButtons(e)
      });
      el.addEventListener("blur", (e) => {
          this.updateData(e.target);
          this.removeButtons();
          this.text = null;
          renderDiff(e.target.dataset.id, pageData);
          attach();
      });
  } // endfold
}
