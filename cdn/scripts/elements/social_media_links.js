import { AdminModal } from "../modals/base.js";
import { register, ELEMENT_NAMES } from "../element_registry.js";

export class SocialMediaLinks extends HTMLUListElement { // startfold
  static elementName = ELEMENT_NAMES.socialMediaLinks;
  static elementType = "ul";

  supportedLinks = [
    "facebook",
    "twitter",
    "youtube",
  ];

  constructor() { // startfold
    super();
    this.addEventListener("click", (e) => this.openEditor(e));
    this.setAttribute("is", SocialMediaLinks.elementName);
  } // endfold
  openEditor() { // startfold
    console.log("clicked add");
    const modal = new SocialMediaLinksModal();
    modal.showMe();
  } //endfold
  setLinks(links) {
    this.innerHTML = "";
    for (const link of links) {
       const newLink = document.createElement('li'); 
       const linkA = document.createElement('a');
       linkA.dataset.linkType = link.linkType;
       linkA.href = link.href;
       newLink.appendChild(linkA);
       this.appendChild(newLink);
    }
  }
}
// endfold
register(SocialMediaLinks);

export class SocialMediaLinksModal extends AdminModal { // startfold
  static elementName = ELEMENT_NAMES.socialMediaLinks;
  static elementType = "dialog";

  headerText = "Social Media Links";
  actionText = "Update";
  contentClass = "modal-content";

  connectedCallback() { // startfold
    this.links = document.querySelector("ul[is='social-media-links']");

    this.beforeAction = () => {
        let linkData = [];
        let newLinks = this.querySelectorAll(`.${this.contentClass} div`);
        for (const link of newLinks) {
            const selector = link.querySelector("select");
            const value = link.querySelector("input");
            const newLinkData = {
                linkType: selector.value,
                href: value.value,
            }
            linkData.push(newLinkData);
        }
        for (const linkSet of document.querySelectorAll("ul[is='social-media-links']")) {
            linkSet.setLinks(linkData);
        }
    };
    this.metaChildren = null;
    this.render();
  } // endfold
  makeLinkSelector(name, content) { // startfold
    const container = document.createElement("div");
    const selector = document.createElement("select");
    for (let opt of this.links.supportedLinks) {
        const option = document.createElement("option");
        option.value = opt;
        option.innerText = opt;
        selector.appendChild(option);
    }
    if (name != null) {
        selector.value = name;
    }
    container.appendChild(selector);

    const input = document.createElement("input");
    input.value = content;
    container.appendChild(input);

    const removeButton = document.createElement("button");
    removeButton.innerText = "x";
    removeButton.addEventListener("click", () => {
        container.remove();
    })
    container.appendChild(removeButton);
    return container;
  } // endfold
  getContent() { // startfold
    const content = document.createElement("div");
    content.classList.add(this.contentClass);
    content.classList.add("social-media-links-modal");

    for (let link of this.links.children) {
        const linkA = link.querySelector("a");
        const linkLineItem = this.makeLinkSelector(linkA.dataset.linkType, linkA.href);
        content.appendChild(linkLineItem);
    }

    const addButton = document.createElement("button");
    addButton.innerText = "Add Link";
    addButton.addEventListener("click", () => {
        const newLink = this.makeLinkSelector(null, "");
        content.appendChild(newLink);
    });
    content.appendChild(addButton);

    return content
  } // endfold
} // endfold
customElements.define("social-media-links-modal", SocialMediaLinksModal, {extends: "dialog"});
