import { LOG } from '../utils/logger.js';

export function modalBuilder() { // startfold
  try {
    const builder = new AdminModal();
    return builder;
  } catch (error) {
    LOG.error("Error in modalBuilder: " + error.message);
  }
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
    try {
      this.render();
    } catch (error) {
      LOG.error("Error in connectedCallback: " + error.message);
    }
  }
  render() {
    try {
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
    } catch (error) {
      LOG.error("Error in render: " + error.message);
    }
  } // endfold
  getContent() { // startfold
    return this.content;
  } // endfold
  createActionBtn() { // startfold
    try {
      this.actionBtn = document.createElement("button");
      this.actionBtn.classList.add("admin-modal-action-btn");
      this.actionBtn.innerText = this.actionText;

      this.actionBtn.addEventListener("click", (e) => {
        try {
          this.beforeAction(e);
          this.close();
          this.remove();
        } catch (error) {
          LOG.error("Error in actionBtn click handler: " + error.message);
        }
      });
      this.appendChild(this.actionBtn);
    } catch (error) {
      LOG.error("Error in createActionBtn: " + error.message);
    }
  } // endfold
  createCancelBtn() { // startfold
    try {
      this.cancelBtn = document.createElement("button");
      this.cancelBtn.classList.add("admin-modal-cancel-btn");
      this.cancelBtn.innerText = this.cancelText;

      this.cancelBtn.addEventListener("click", (e) => {
        try {
          this.beforeCancel(e);
          this.close();
          this.remove();
        } catch (error) {
          LOG.error("Error in cancelBtn click handler: " + error.message);
        }
      });
      this.appendChild(this.cancelBtn);
    } catch (error) {
      LOG.error("Error in createCancelBtn: " + error.message);
    }
  } // endfold
  contentHTML(html) { // startfold
    try {
      this.content.innerHTML = html;
      return this;
    } catch (error) {
      LOG.error("Error in contentHTML: " + error.message);
    }
  } // endfold
  contentNode(node) { // startfold
    try {
      this.content.innerHTML = "";
      this.content.appendChild(node);
      return this;
    } catch (error) {
      LOG.error("Error in contentNode: " + error.message);
    }
  } // endfold
  setHeaderText(text) { // startfold
    this.headerText = text;
    return this;
  } // endfold
  setActionText(text) { // startfold
    this.actionText = text;
    return this;
  } // endfold
  actionFunc(func) { // startfold
    this.beforeAction = func;
    return this;
  } // endfold
  cancelFunc(func) { // startfold
    this.beforeCancel = func;
    return this;
  } // endfold
  showMe() { //startfold
    try {
      document.body.appendChild(this);
      this.showModal();
    } catch (error) {
      LOG.error("Error in showMe: " + error.message);
    }
  } // endfold
}
customElements.define("admin-modal", AdminModal, {extends: "dialog"});