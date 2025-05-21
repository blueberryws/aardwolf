function getDocumentPosition(el) {
  const rect = el.getBoundingClientRect();
  return {
    top: rect.top + window.scrollY,
    bottom: rect.bottom + window.scrollY,
    left: rect.left + window.scrollX,
   right: rect.right + window.scrollX,
  };
}

export class Tutorial {
    constructor() {
        this.overlay = document.createElement("div");
        this.overlay.classList.add("tutorial-overlay");
        document.body.appendChild(this.overlay);

        this.steps = [
          this.showH1.bind(this),
          this.removeOverlay.bind(this),
        ]
        this.step = 0;
        this.nextStep();
    }
    nextStep() {
        this.steps[this.step]();
        this.step += 1;
    }
    showH1() {
      const h1 = document.querySelector("section h1");
      h1.classList.add("highlighted");


      const h1Pos = getDocumentPosition(h1);
      console.log(h1Pos);
      const descBox = document.createElement("div");
      descBox.innerHTML = "Click the above text to edit it.<br>All text is click to edit, after the tutorial this will work on all text.";
      descBox.style.position = "absolute";
      descBox.style.zIndex = "9001";
      descBox.style.top = parseInt(h1Pos.bottom) + "px";
      descBox.style.left = parseInt(h1Pos.left) + "px";
      descBox.style.fontSize = "16px";
      descBox.style.color = "white";
      descBox.style.backgroundColor = "gray";
      descBox.style.padding = "8px";
      descBox.style.borderRadius = "5px";
      document.body.appendChild(descBox);

      const clickListener = (e) => {
          h1.removeEventListener("click", clickListener);
          this.nextStep();
          descBox.remove();
      };
      h1.addEventListener("click", clickListener);
    }
    removeOverlay() {
        this.overlay.remove();
        const highlights = document.querySelectorAll(".highlighted");
        highlights.forEach(el => el.classList.remove("highlighted"));
    }
}
