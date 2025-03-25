import { modalBuilder } from "./base.js";
import { UnsetLoading } from "../interfaces/events.js";

const CONTENT = `
  <img src="/cdn/images/loading.gif" />
`

export function showLoadingModal() {
    const modal = modalBuilder()
      .addClass("loading-modal")
      .contentHTML(CONTENT);
    document.addEventListener(UnsetLoading, (e) => {
        console.log("called");
        modal.close();
        modal.remove();
    });
    modal.showMe();
}
