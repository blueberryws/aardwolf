import { LOG } from './logger.js';
export function fromHTML(html) {
    const template = document.createElement('template');
    template.innerHTML = html.trim();
    const numberOfNodes = template.content.childNodes.length;
    if (numberOfNodes !== 1) {
        LOG.error(`HTML parameter must represent a single node; got ${numberOfNodes}. ` +
            'Note that leading or trailing spaces around an element in your ' +
            'HTML, like " <img/> ", get parsed as text nodes neighbouring ' +
            'the element; call .trim() on your input to avoid this.'
        );
        throw new Error(
            `html parameter must represent a single node; got ${numberOfNodes}. ` +
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
    try {
        if (jsonData.element == "raw") {
            return fromHTML(jsonData.content);
        }
        const ElementClass = registry[jsonData.element];
        if (!ElementClass) {
            LOG.warn(`Element class "${jsonData.element}" not found in registry.`);
            throw new Error(`Element class "${jsonData.element}" not found in registry.`);
        }
        const element = new ElementClass();

        if (jsonData.text != null) {
            element.innerText = jsonData.text;
        }

        if (jsonData.classes != null) {
            jsonData.classes.forEach(className => {
                LOG.debug(`Adding class "${className}" to element.`);
                element.classList.add(className);
            });
        }

        const supportedAttributes = ['onclick', 'data', 'type', 'onload'];
        supportedAttributes.forEach(attr => {
            if (jsonData[attr] != null) {
                LOG.debug(`Setting attribute "${attr}" with value "${jsonData[attr]}" on element.`);
                element.setAttribute(attr, jsonData[attr]);
            }
        });

        if (jsonData.children != null) {
            for (const child of jsonData.children) {
                LOG.debug(`Appending child to element: ${JSON.stringify(child)}`);
                element.appendChild(htmlFromJSON(child, registry));
            }
        }

        return element;
    } catch (error) {
        LOG.error(`Failed to convert JSON to HTML: ${error.message}`);
        throw error;
    }
}