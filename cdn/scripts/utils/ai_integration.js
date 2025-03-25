import { SECTIONS } from "../element_registry.js";
import { makeSection } from "../editors/section_editor.js";
import { getColorStyle, genStraight } from "../colors/color_style.js";

// sample:
// [
//   {
//     "name": "hero",
//     "content": {
//       "h1": "some text",
//       "h2": "some text",
//       "p": "some text",
//       "button": "some text",
//     }
//   },
//   {
//     "name": "at-a-glance",
//     "content": {
//       "h2": "some text",
//       "li": [
//         {
//           "h3": "some text"
//         },
//         {
//           "h3": "some text"
//         }
//       ]
//     }
//   },
// {
//   "name": "about",
//   "content": {
//     "h2": "some text",
//     "p": "some text",
//     "li": [
//       {
//         "h3": "some text",
//         "p": "some text"
//       },
//       {
//         "h3": "some text",
//         "p": "some text"
//       }
//     ]
//   }
// }
// 
// ]

function getRandomElement(array) {
  if (array.length === 0) {
    return undefined; // Return undefined for empty arrays
  }
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

function replText(el, content) {
  for (const [key, val] of Object.entries(content)) {
    if (Array.isArray(val)) {
      let children = Array.from(el.querySelectorAll(key));
      while (children.length < val.length) {
        let clone = children[0].cloneNode(true); 
        children[0].parentElement.appendChild(clone);
        children = Array.from(el.querySelectorAll(key));
      }
      children.forEach((child, idx) => {
        replText(child, val[idx]);
      });
    } else {
      el.querySelector(key).innerText = val;
    }
  }
}

export function loadSectionsFromJSON(content) {
    const main = document.querySelector("main");
    main.innerHTML = "";
    for (const sectionContent of content) {
        const sectionName = SECTIONS[sectionContent.name];
        const sectionInstance = makeSection(sectionName);
        replText(sectionInstance, sectionContent.content || []);
        const newClass = getRandomElement(sectionInstance.classes);
        sectionInstance.classList.replace("default", newClass);
        main.appendChild(sectionInstance);
    }
}

export function loadMetadataFromJSON(metadata) {
    const title = document.querySelector("title");
    title.innerText = metadata.title || title.innerText;
    const description = document.querySelector("meta[name='description']");
    description.content = metadata.description || description.content;
    const palette = getColorStyle();
    palette.dataset.primaryColor = metadata.primaryColor;
    palette.dataset.secondaryColor = metadata.secondaryColor
    palette.dataset.palette = JSON.stringify(genStraight(palette.dataset.secondaryColor));
    palette.render();
}

window.loadSectionsFromJSON = loadSectionsFromJSON;
window.loadMetadataFromJSON = loadMetadataFromJSON;
