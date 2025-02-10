export function fromHTML(html) {
    const template = document.createElement('template');
    template.innerHTML = html.trim();
    const numberOfNodes = template.content.childNodes.length;
    if (numberOfNodes !== 1) {
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

export function htmlFromJSON(jsonData, registry) {
  if (jsonData.element == "raw") {
    return fromHTML(jsonData.content);
  }
  const ElementClass = registry[jsonData.element];
  const element = new ElementClass();


  if (jsonData.text != null) {
    element.innerText = jsonData.text;
  }

  if (jsonData.classes != null) {
    jsonData.classes.forEach(className => {element.classList.add(className)});
  }

  const supportedAttributes = ['onclick', 'data', 'type', 'onload'];
  supportedAttributes.forEach(attr => {
    if (jsonData[attr] != null) {
        element.setAttribute(attr, jsonData[attr]);
    }
  });

  if (jsonData.children != null) {
    for (const child of jsonData.children) {
        element.appendChild(htmlFromJSON(child, registry));
    }
  }

  return element
}
