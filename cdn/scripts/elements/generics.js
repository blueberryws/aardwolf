import { register, ELEMENT_NAMES } from "../element_registry.js";

export class UnorderedList extends HTMLUListElement { // startfold
  static elementName = ELEMENT_NAMES.unorderedList
  static elementType = "ul"

  constructor() { // startfold
    super();
  } // endfold
} // endfold
register(UnorderedList);

export class ListItem extends HTMLLIElement { // startfold
  static elementName = ELEMENT_NAMES.listItem
  static elementType = "li"

  constructor() { // startfold
    super();
  } // endfold
} // endfold
register(ListItem);

export class DetailsElement extends HTMLDetailsElement { // startfold
  static elementName = ELEMENT_NAMES.detailsElement
  static elementType = "details"

  constructor() { // startfold
    super();
  } // endfold
} // endfold
register(DetailsElement);

export class SummaryElement extends HTMLElement { // startfold
  static elementName = ELEMENT_NAMES.summaryElement
  static elementType = "summary"

  constructor() { // startfold
    super();
  } // endfold
} // endfold
register(SummaryElement);

export class DialogElement extends HTMLDialogElement { // startfold
  static elementName = ELEMENT_NAMES.dialogElement
  static elementType = "dialog"

  constructor() { // startfold
    super();
  } // endfold
} // endfold
register(DialogElement);
