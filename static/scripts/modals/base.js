export function modalBuilder() { // startfold
  const builder = new AdminModal();
  return builder;
} // endfold

export class AdminModal extends HTMLDialogElement { // startfold
  actionText = "save";
  cancelText = "cancel";
  headerText = "Modal";
  classes = ["admin-modal"];
  constructor() { // startfold
    super();
    this.beforeCancel = () => {};
    this.beforeAction = () => {};
    this.content = document.createElement("div");
  } // endfold
  connectedCallback() { // startfold
    this.render();
  }
  render() {
    this.innerHTML = "";
    this.classes.forEach(cl => {
        this.classList.add(cl);
    });

    this.header = document.createElement("h2");
    this.header.innerText = this.headerText;
    this.appendChild(this.header);

    this.appendChild(this.getContent());

    this.createCancelBtn();
    this.createActionBtn();
  } // endfold
  getContent() { // startfold
    return this.content;
  } // endfold
  createActionBtn() { // startfold
      this.actionBtn = document.createElement("button");
      this.actionBtn.innerText = this.actionText;;
    
      this.actionBtn.addEventListener("click", (e) => {
        this.beforeAction(e);
        this.close();
        this.remove();
      });
      this.appendChild(this.actionBtn);
  } // endfold
  createCancelBtn() { // startfold
      this.cancelBtn = document.createElement("button");
      this.cancelBtn.innerText = this.cancelText;
    
      this.cancelBtn.addEventListener("click", (e) => {
        this.beforeCancel(e);
        this.close();
        this.remove();
      });
      this.appendChild(this.cancelBtn);
  } // endfold
  contentHTML(html) { // startfold
    this.content.innerHTML = html
  } // endfold
  contentNode(node) { // startfold
    this.content.innerHTML = "";
    this.content.appendChild(node);
  } // endfold
  actionFunc(func) { // startfold
    this.beforeAction = func
    return this
  } // endfold
  cancelFunc(func) { // startfold
    this.beforeCancel = func
    return this
  } // endfold
  showMe() { //startfold
    document.body.appendChild(this);
    this.showModal();
  } // endfold
}
customElements.define("admin-modal", AdminModal, {extends: "dialog"});
