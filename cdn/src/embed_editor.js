// TODO: It'd be cool if this raised the event to make the change, rather than the change itself.
// Maybe that's a later thing when we get the history API working, though.
class EditEmbedModal extends HTMLElement {
    constructor(content, saveFunc) {
        super();
        this.saveFunc = saveFunc;
        attachHTML(this, `
            <dialog data-name="modal">
              <h2>Edit Embed</h2>
              <label>Embed Code:</label>
              <textarea data-name="content"></textarea>
              <button data-name="cancel">Cancel</button>
              <button data-name="save">Save</button>
            </dialog>
        `);
        this.content.value = content;
        document.body.appendChild(this);
        this.addEventListener("click", (e) => {this.handleClick(e)});
        this.modal.showModal();
    }
    handleClick(e) {
      if (e.target == this.cancel) {
        this.remove();
      }
      if (e.target == this.save) {
        this.saveFunc(this.content.value);
        this.remove();
      }
    }
}
customElements.define("edit-embed-modal", EditEmbedModal);

class EmbedController {
  constructor() {
      this.embed = null;
  }
  register(embed) {
     console.log("attaching");
     const clicker = document.createElement("div");
     clicker.classList.add("clicker");
     clicker.addEventListener('click', (e) => {this.handleClick(e)});
     embed.appendChild(clicker);
     // Prevent opening the link if the parent isn't in focus.
     embed.addEventListener("mousedown", (e) => {
         const section = embed.closest("section");
         if (section.dataset.focus != "true") {
           e.preventDefault();
         }
     });
     embed.addEventListener("touchstart", (e) => {
         const section = embed.closest("section");
         if (section.dataset.focus != "true") {
           e.preventDefault();
         }
     });
  }
  handleClick(e) {
      e.preventDefault();
      const address = getAddress(e.target);
      const node = getDataByAddress(address, pageData);
      const modal = new EditEmbedModal(
        node.content,
        (content) => {
          node.content = content;
          renderDiff(node.id, pageData);
          attach();
          loadStyles();
        }
      );
  }
}
