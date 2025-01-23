export function fromHTML(html) {
    const template = document.createElement('template');
    template.innerHTML = html.trim();
    const nNodes = template.content.childNodes.length;
    if (nNodes !== 1) {
        throw new Error(
            `html parameter must represent a single node; got ${nNodes}. ` +
            'Note that leading or trailing spaces around an element in your ' +
            'HTML, like " <img/> ", get parsed as text nodes neighbouring ' +
            'the element; call .trim() on your input to avoid this.'
        );
    }
    return template.content.firstChild;
}

function htmlToNodes(html) {
    const template = document.createElement('template');
    template.innerHTML = html;
    return template.content.childNodes;
}

export function htmlFromJSON(json, registry) {
  if (json.element == "raw") {
    const element = fromHTML(json.content);
    return element;
  }
  console.log(json.element);
  const elClass = registry[json.element];
  const element = new elClass();
  if (json.text != null) {
    element.innerText = json.text;
  }
  if (json.classes != null) {
    console.log(json.classes)
    json.classes.forEach(e => {element.classList.add(e)});
  }
  if (json.children != null) {
    for (const child of json.children) {
        element.appendChild(htmlFromJSON(child, registry));
    }
  }
  if (json.onclick != null) {
    element.setAttribute("onclick", json.onclick);
  }
  if (json.data != null) {
    element.setAttribute("data", json.data);
  }
  if (json.type != null) {
    element.setAttribute("type", json.type);
  }
  if (json.onload != null) {
    element.setAttribute("onload", json.onload);
  }
  return element
  // have to add "children" support
}
