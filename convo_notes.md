** 2024-12-17 **
- We will have "font size" be set by the font when choosing the font.
  - This is because different fonts will have different font size and weight levels to acheive the same effect (e.g. 18px in Helvetica might be 15px in Garamond, or something like that).
  - The fonts will set the following sizes:
    - header-font-size-x-large
    - header-font-size-large
    - header-font-size-medium
    - header-font-size-small
    - header-font-size-x-small
    - body-font-size-x-large
    - body-font-size-large
    - body-font-size-medium
    - body-font-size-small
    - body-font-size-x-small
  - Then in places where a separate size is specified, the size will be specified relative to the font-size set by the font.
    - e.g. calc(var(--header-font-size-large) * .8)
  - This allows the designer to specify the correct "sizings" for the fonts, and all places where a custom sizing is necessary can be defined relative to that size to avoid having wonkiness when a font change is made.

** 2024-12-16 **
- "style set" and "information tag" are separate notions.
- We're going to use SASS "extends" for the style-set, and the information-tag will indiciate the piece of content's place in the heirarchy.

- Testmonial Text is it's own thing named "testimonial-text" (as opposed to p2 or "alternate-text" or "small-text")
- There is more work to be done to figure out how to name things:
  - Style-based names
  - information architecture names
  - heirarchy names

