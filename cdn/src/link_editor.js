// TODO: It'd be cool if this raised the event to make the change, rather than the change itself.
// Maybe that's a later thing when we get the history API working, though.
class EditLinkModal extends HTMLElement { // startfold
    constructor(currentText, currentDestination, saveFunc) {
        super();
        this.saveFunc = saveFunc;
        attachHTML(this, `
            <dialog data-name="modal">
              <h2>Edit Link</h2>
              <label>Text:</label>
              <input data-name="text" value="${currentText}"></input>
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
        this.saveFunc(this.text.value, this.link.value);
        this.remove();
      }
    }
}
customElements.define("edit-link-modal", EditLinkModal);
// endfold

class LinkController {
  constructor() {
      this.link = null;
  }
  register(link) {
     link.addEventListener("click", (e) => {this.handleClick(e)});
     // Prevent opening the link if the parent isn't in focus.
     link.addEventListener("mousedown", (e) => {
         const section = link.closest("section");
         if (section.dataset.focus != "true") {
           e.preventDefault();
         }
     });
     link.addEventListener("touchstart", (e) => {
         const section = link.closest("section");
         if (section.dataset.focus != "true") {
           e.preventDefault();
         }
     });
  }
  handleClick(e) {
      e.preventDefault(); // should NEVER visit "links" in edit mode.
      const address = getAddress(e.target);
      const node = getDataByAddress(address, pageData);
      const modal = new EditLinkModal(
        node.text,
        node.destination,
        (text, dest) => {
          node.text = text;
          node.destination = dest;
          renderDiff(e.target.dataset.id, pageData);
          attach();
          loadStyles();
        }
      );
  }
}
