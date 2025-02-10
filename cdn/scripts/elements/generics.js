import { LOG } from '../utils/logger.js';

import { register, ELEMENT_NAMES } from "../element_registry.js";

export class UnorderedList extends HTMLUListElement { // startfold
  static elementName = ELEMENT_NAMES.unorderedList
  static elementType = "ul"

  constructor() { // startfold
    super();
  } // endfold
} // endfold
try {
  register(UnorderedList);
} catch (error) {
  LOG.error(`Failed to register UnorderedList: ${error.message}`);
}

export class ListItem extends HTMLLIElement { // startfold
  static elementName = ELEMENT_NAMES.listItem
  static elementType = "li"

  constructor() { // startfold
    super();
  } // endfold
} // endfold
try {
  register(ListItem);
} catch (error) {
  LOG.error(`Failed to register ListItem: ${error.message}`);
}

export class DetailsElement extends HTMLDetailsElement { // startfold
  static elementName = ELEMENT_NAMES.detailsElement
  static elementType = "details"

  constructor() { // startfold
    super();
  } // endfold
} // endfold
try {
  register(DetailsElement);
} catch (error) {
  LOG.error(`Failed to register DetailsElement: ${error.message}`);
}

export class SummaryElement extends HTMLElement { // startfold
  static elementName = ELEMENT_NAMES.summaryElement
  static elementType = "summary"

  constructor() { // startfold
    super();
  } // endfold
} // endfold
try {
  register(SummaryElement);
} catch (error) {
  LOG.error(`Failed to register SummaryElement: ${error.message}`);
}

export class DialogElement extends HTMLDialogElement { // startfold
  static elementName = ELEMENT_NAMES.dialogElement
  static elementType = "dialog"

  constructor() { // startfold
    super();
  } // endfold
} // endfold
try {
  register(DialogElement);
} catch (error) {
  LOG.error(`Failed to register DialogElement: ${error.message}`);
}

export class ButtonElement extends HTMLButtonElement { // startfold
  static elementName = ELEMENT_NAMES.buttonElement
  static elementType = "button"

  constructor() { // startfold
    super();
  } // endfold
} // endfold
try {
  register(ButtonElement);
} catch (error) {
  LOG.error(`Failed to register ButtonElement: ${error.message}`);
}

export class ObjectElement extends HTMLObjectElement { // startfold
  static elementName = ELEMENT_NAMES.objectElement
  static elementType = "object"

  constructor() { // startfold
    super();
  } // endfold
} // endfold
try {
  register(ObjectElement);
} catch (error) {
  LOG.error(`Failed to register ObjectElement: ${error.message}`);
}

export class FigureElement extends HTMLElement { // startfold
  static elementName = ELEMENT_NAMES.figureElement
  static elementType = "figure"

  constructor() { // startfold
    super();
  } // endfold
} // endfold
try {
  register(FigureElement);
} catch (error) {
  LOG.error(`Failed to register FigureElement: ${error.message}`);
}

export class BlockquoteElement extends HTMLElement { // startfold
  static elementName = ELEMENT_NAMES.blockquoteElement
  static elementType = "blockquote"

  constructor() { // startfold
    super();
  } // endfold
} // endfold
try {
  register(BlockquoteElement);
} catch (error) {
  LOG.error(`Failed to register BlockquoteElement: ${error.message}`);
}

export class FigcaptionElement extends HTMLElement { // startfold
  static elementName = ELEMENT_NAMES.figcaptionElement
  static elementType = "figcaption"

  constructor() { // startfold
    super();
  } // endfold
} // endfold
try {
  register(FigcaptionElement);
} catch (error) {
  LOG.error(`Failed to register FigcaptionElement: ${error.message}`);
}