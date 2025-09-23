window.setTimeout(() => {
  const sel = window.getSelection();
  console.log(sel);
  console.log(sel.rangeCount);
  console.log(sel.getRangeAt(0));
}, 2000);
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

let sel = null;
class TextController {
  constructor() {
      this.boldButton = new BoldButton((e) => this.boldSelection(e));
  }
  getSelection() { // startfold
    const selection = window.getSelection();
    if (selection.type != "Range") {
      return
    }

    // TODO: Make this work for multiple spans
    const span = selection.anchorNode.parentElement;
    const textNode = span.closest(`[data-editor='text']`);
    const spanId = span.dataset.id;
    const start = selection.direction == "forward" ? selection.anchorOffset : selection.focusOffset;
    const end  = selection.direction == "forward" ? selection.focusOffset : selection.anchorOffset;
    return {
      nodeId: textNode.dataset.id,
      start: start,
      end: end,
    }
  } // endfold
  setSelection(selection) { // startfold
    const textNode = document.querySelector(`[data-id="${selection.nodeId}"]`);
    const newRange = document.createRange();
    newRange.setStart(textNode, selection.start);
    newRange.setEnd(textNode, selection.end);

    const newSelection = window.getSelection();
    newSelection.removeAllRanges();
    newSelection.addRange(newRange);
  } // endfold

  boldSelection(e) { // startfold
    e.preventDefault();
    const selection = this.getSelection();
    render(pageData);
    attach();
    // TODO: Actually bold it.
    console.log("bolding!");
    this.setSelection(selection);
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
      el.addEventListener("focus", (e) => {
          document.body.appendChild(this.boldButton);
          this.boldButton.focus(e.target);
      });
      el.addEventListener("blur", (e) => {
          const fragNodes = Array.from(e.target.children);
          const fragments = fragNodes.map(f => {return {
              id: f.dataset.id,
              text: f.textContent,
          }});
          const sel = window.getSelection();
          const address = getAddress(e.target);
          // TODO: move this to an event, and have the handler elsewhere.
          const node = getDataByAddress(address, pageData);
          node.fragments = fragments;
          renderDiff(e.target.dataset.id, pageData);
          attach();


//          newSelection.removeAllRanges();
//          console.log(range);
//          selection.addRange(range);
      });
  } // endfold
}
