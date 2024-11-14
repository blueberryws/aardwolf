export class EditableSection extends HTMLElement { // startfold
  constructor() { // startfold
    super();
  } // endfold
  getOrDefault(elementType) { // startfold
    const defaultElement = new elementType();
    defaultElement.setAttribute("is", defaultElement.elementName);
    const selector = `${defaultElement.elementType}[is='${defaultElement.elementName}']`;
    return this.querySelector(selector) || defaultElement;
  } // endfold
  getOrDefaultText(elementType, text) { // startfold
    const defaultElement = new elementType();
    defaultElement.innerText = text;
    defaultElement.setAttribute("is", defaultElement.elementName);
    const selector = `${defaultElement.elementType}[is='${defaultElement.elementName}']`;
    return this.querySelector(selector) || defaultElement;
  } // endfold
  clean() { // startfold
    this.innerHTML = ""
    for (let child of this.heirs) {
        this.appendChild(child);
    }
  } // endfold
}
