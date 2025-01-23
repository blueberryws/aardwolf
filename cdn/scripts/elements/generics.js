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

export class ButtonElement extends HTMLButtonElement { // startfold
  static elementName = ELEMENT_NAMES.buttonElement
  static elementType = "button"

  constructor() { // startfold
    super();
  } // endfold
} // endfold
register(ButtonElement);

export class ObjectElement extends HTMLObjectElement { // startfold
  static elementName = ELEMENT_NAMES.objectElement
  static elementType = "object"

  constructor() { // startfold
    super();
  } // endfold
} // endfold
register(ObjectElement);

export class FigureElement extends HTMLElement { // startfold
  static elementName = ELEMENT_NAMES.figureElement
  static elementType = "figure"

  constructor() { // startfold
    super();
  } // endfold
} // endfold
register(FigureElement);

export class BlockquoteElement extends HTMLElement { // startfold
  static elementName = ELEMENT_NAMES.blockquoteElement
  static elementType = "blockquote"

  constructor() { // startfold
    super();
  } // endfold
} // endfold
register(BlockquoteElement);

export class FigcaptionElement extends HTMLElement { // startfold
  static elementName = ELEMENT_NAMES.figcaptionElement
  static elementType = "figcaption"

  constructor() { // startfold
    super();
  } // endfold
} // endfold
register(FigcaptionElement);
