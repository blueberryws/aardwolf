import { AdminModal } from "../modals/base.js";
import { ElementEditor } from "./element_editor.js";
import { EditablePicture } from "../elements/editable_picture.js";
import { getColorStyle } from "../colors/color_style.js";

// startfold
const respMock = '[{"alt": "White Capsule on Red Surface", "avg_color": "#E30802", "height": 3372, "id": 3683083, "liked": false, "photographer": "Anna Shvets", "photographer_id": 1984515, "photographer_url": "https://www.pexels.com/@shvetsa", "src": {"landscape": "https://images.pexels.com/photos/3683083/pexels-photo-3683083.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200", "large": "https://images.pexels.com/photos/3683083/pexels-photo-3683083.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "large2x": "https://images.pexels.com/photos/3683083/pexels-photo-3683083.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "medium": "https://images.pexels.com/photos/3683083/pexels-photo-3683083.jpeg?auto=compress&cs=tinysrgb&h=350", "original": "https://images.pexels.com/photos/3683083/pexels-photo-3683083.jpeg", "portrait": "https://images.pexels.com/photos/3683083/pexels-photo-3683083.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800", "small": "https://images.pexels.com/photos/3683083/pexels-photo-3683083.jpeg?auto=compress&cs=tinysrgb&h=130", "tiny": "https://images.pexels.com/photos/3683083/pexels-photo-3683083.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=280"}, "url": "https://www.pexels.com/photo/white-capsule-on-red-surface-3683083/", "width": 5058}, {"alt": "Syringes on Red Background", "avg_color": "#FB3007", "height": 6000, "id": 3786132, "liked": false, "photographer": "Anna Shvets", "photographer_id": 1984515, "photographer_url": "https://www.pexels.com/@shvetsa", "src": {"landscape": "https://images.pexels.com/photos/3786132/pexels-photo-3786132.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200", "large": "https://images.pexels.com/photos/3786132/pexels-photo-3786132.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "large2x": "https://images.pexels.com/photos/3786132/pexels-photo-3786132.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "medium": "https://images.pexels.com/photos/3786132/pexels-photo-3786132.jpeg?auto=compress&cs=tinysrgb&h=350", "original": "https://images.pexels.com/photos/3786132/pexels-photo-3786132.jpeg", "portrait": "https://images.pexels.com/photos/3786132/pexels-photo-3786132.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800", "small": "https://images.pexels.com/photos/3786132/pexels-photo-3786132.jpeg?auto=compress&cs=tinysrgb&h=130", "tiny": "https://images.pexels.com/photos/3786132/pexels-photo-3786132.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=280"}, "url": "https://www.pexels.com/photo/syringes-on-red-background-3786132/", "width": 4000}, {"alt": "Close-Up View of Logo With Horse", "avg_color": "#E10706", "height": 3194, "id": 9843280, "liked": false, "photographer": "Leif Bergerson", "photographer_id": 99376750, "photographer_url": "https://www.pexels.com/@leif-bergerson-99376750", "src": {"landscape": "https://images.pexels.com/photos/9843280/pexels-photo-9843280.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200", "large": "https://images.pexels.com/photos/9843280/pexels-photo-9843280.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "large2x": "https://images.pexels.com/photos/9843280/pexels-photo-9843280.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "medium": "https://images.pexels.com/photos/9843280/pexels-photo-9843280.jpeg?auto=compress&cs=tinysrgb&h=350", "original": "https://images.pexels.com/photos/9843280/pexels-photo-9843280.jpeg", "portrait": "https://images.pexels.com/photos/9843280/pexels-photo-9843280.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800", "small": "https://images.pexels.com/photos/9843280/pexels-photo-9843280.jpeg?auto=compress&cs=tinysrgb&h=130", "tiny": "https://images.pexels.com/photos/9843280/pexels-photo-9843280.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=280"}, "url": "https://www.pexels.com/photo/close-up-view-of-logo-with-horse-9843280/", "width": 4791}, {"alt": "Leaves Cut Out in Red Paper", "avg_color": "#F82110", "height": 6720, "id": 5412288, "liked": false, "photographer": "Photo By: Kaboompics.com", "photographer_id": 2332540, "photographer_url": "https://www.pexels.com/@karolina-grabowska", "src": {"landscape": "https://images.pexels.com/photos/5412288/pexels-photo-5412288.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200", "large": "https://images.pexels.com/photos/5412288/pexels-photo-5412288.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "large2x": "https://images.pexels.com/photos/5412288/pexels-photo-5412288.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "medium": "https://images.pexels.com/photos/5412288/pexels-photo-5412288.jpeg?auto=compress&cs=tinysrgb&h=350", "original": "https://images.pexels.com/photos/5412288/pexels-photo-5412288.jpeg", "portrait": "https://images.pexels.com/photos/5412288/pexels-photo-5412288.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800", "small": "https://images.pexels.com/photos/5412288/pexels-photo-5412288.jpeg?auto=compress&cs=tinysrgb&h=130", "tiny": "https://images.pexels.com/photos/5412288/pexels-photo-5412288.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=280"}, "url": "https://www.pexels.com/photo/leaves-cut-out-in-red-paper-5412288/", "width": 4480}, {"alt": "A Gift Box on a Red Background", "avg_color": "#F72429", "height": 6720, "id": 5725868, "liked": false, "photographer": "Photo By: Kaboompics.com", "photographer_id": 2332540, "photographer_url": "https://www.pexels.com/@karolina-grabowska", "src": {"landscape": "https://images.pexels.com/photos/5725868/pexels-photo-5725868.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200", "large": "https://images.pexels.com/photos/5725868/pexels-photo-5725868.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "large2x": "https://images.pexels.com/photos/5725868/pexels-photo-5725868.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "medium": "https://images.pexels.com/photos/5725868/pexels-photo-5725868.jpeg?auto=compress&cs=tinysrgb&h=350", "original": "https://images.pexels.com/photos/5725868/pexels-photo-5725868.jpeg", "portrait": "https://images.pexels.com/photos/5725868/pexels-photo-5725868.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800", "small": "https://images.pexels.com/photos/5725868/pexels-photo-5725868.jpeg?auto=compress&cs=tinysrgb&h=130", "tiny": "https://images.pexels.com/photos/5725868/pexels-photo-5725868.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=280"}, "url": "https://www.pexels.com/photo/a-gift-box-on-a-red-background-5725868/", "width": 4480}]'
// endfold

export class PictureEditor extends ElementEditor {
    constructor(element) { // startfold
        super();
        this.element = element;

        // TODO: Refactor candidate.
        // Not sure what the right pattern is here.
        this.pexelsQuery = document.createElement("input");
        this.pexelsQuery.placeholder = "Search for stock photos...";
    } // endfold
    loadFromElement() { // startfold
        //   We need to make a modal copy of the attributes, so we can modify
        // with impunity, and decide to save or cancel later.
        //   Make a two-way-data-binding sorta thing here.
        // Read from altText, Write to altTextInput.
        this.altText = this.element.dataset.altText;
        this.altTextInput = document.createElement("input");
        this.altTextInput.value = this.altText;
        this.altTextInput.addEventListener("change", (e) => {
            this.altText = e.target.value;
        })

        this.attributionText = this.element.dataset.attributionText;
        this.attributionTextInput = document.createElement("input");
        this.attributionTextInput.value = this.attributionText;
        this.attributionTextInput.addEventListener("change", (e) => {
            this.attributionText = e.target.value;
        });

        this.attributionHref = this.element.dataset.attributionHref;
        this.attributionHrefInput = document.createElement("input");
        this.attributionHrefInput.value = this.attributionHref;
        this.attributionHrefInput.addEventListener("change", (e) => {
            this.attributionHref= e.target.value;
        });

        this.imgPreviewSrc = this.element.dataset.imgSrc;
        this.imgPreview = document.createElement("img");
        this.imgPreview.src = this.imgPreviewSrc;

    } // endfold
    makeForm() { // startfold
        // startfold photo metadata form
        let form = document.createElement("form");

        form.insertAdjacentHTML("beforeend", "<label>Alt Text: </label>");
        this.altTextInput.remove();
        form.appendChild(this.altTextInput);

        form.insertAdjacentHTML("beforeend", "<label>Attribution Text: </label>");
        this.attributionTextInput.remove();
        form.appendChild(this.attributionTextInput);

        form.insertAdjacentHTML("beforeend", "<label>Attribution Link: </label>");
        this.attributionHrefInput.remove();
        form.appendChild(this.attributionHrefInput);
        return form
        // endfold
    } // endfold
  setEditable() { // startfold
    this.element.addEventListener("click", () => this.launchEditorModal());
  } // endfold
  unsetEditable() { // startfold
    this.element.removeEventListener("click", () => this.launchEditorModal());
  } // endfold
  clean() { // startfold
      const text = this.element.innerText.replaceAll("\n", "<br>");
      this.element.innerHTML = text;
  } // endfold
   previewFile(fileInput, imgPreview) { // startfold
      var file    = fileInput.files[0];
      var reader  = new FileReader();
    
      reader.onloadend = function () {
        imgPreview.src = reader.result;
      }
    
      if (file) {
        reader.readAsDataURL(file);
      }
  } // endfold
  selectImg(selected) { // startfold
      this.altTextInput.value = selected.dataset.altText;
      this.attributionTextInput.value = selected.dataset.attributionText;
      this.attributionHrefInput.value = selected.dataset.attributionHref;
      this.imgPreview.src = selected.src;
  } // endfold
  launchEditorModal() { // startfold
    this.loadFromElement();
    let m = new AdminModal();
    m.headerText = "Edit Image";

    let content = document.createElement("div");
    content.id = "edit-image-modal-content";

    this.imgPreview.remove();
    content.appendChild(this.imgPreview);
    content.appendChild(this.makeForm());

    const uploadInput = document.createElement("input");
    uploadInput.innerText = "Upload Photo";
    uploadInput.type="file";
    uploadInput.addEventListener("change", (e) => {
        this.previewFile(e.target, this.imgPreview);
    });
    content.appendChild(uploadInput);

    const pexelsSearchForm = document.createElement("div");

    this.pexelsQuery.remove();
    pexelsSearchForm.appendChild(this.pexelsQuery);

    const searchButton = document.createElement("button");
    searchButton.addEventListener("click", () => this.searchPexels(pexelsPreviews));
    pexelsSearchForm.appendChild(searchButton);
    content.appendChild(pexelsSearchForm);

    const pexelsPreviews = document.createElement("ul");
    pexelsPreviews.innerHTML = "";
    content.appendChild(pexelsPreviews);
    m.content = content;
    m.beforeAction = () => this.saveChanges();
    m.showMe();
  } // endfold
  searchPexels(pexelsPreviews) { // startfold
      const url = "/image/search"
      const colorStyle = getColorStyle();
      const palette = JSON.parse(colorStyle.dataset.palette);
      let searchParams = new URLSearchParams(palette.map(color => ["color", color]));
      searchParams.append("query", this.pexelsQuery.value);
      // TODO: error handling?
      fetch(url + "?" + String(searchParams))
        .then(resp => resp.json())
        .then(results => this.loadPreviewImages(results, pexelsPreviews));
  } // endfold
  loadPreviewImages(results, pexelsPreviews) { // startfold
      pexelsPreviews.innerHTML = "";
      for (let result of results) {
          const newPreview = document.createElement("img"); 
          newPreview.src = result.src.small;
          newPreview.dataset.altText = result.alt;
          newPreview.dataset.attributionText = `Photo Credit ${result.photographer}`;
          newPreview.dataset.attributionHref = result.photographer_url;
          newPreview.addEventListener("click", () => this.selectImg(newPreview));
          pexelsPreviews.appendChild(newPreview);

  //{"alt": "White Capsule on Red Surface", "avg_color": "#E30802", "height": 3372, "id": 3683083, "liked": false, "photographer": "Anna Shvets", "photographer_id": 1984515, "photographer_url": "https://www.pexels.com/@shvetsa", "src": {"landscape": "https://images.pexels.com/photos/3683083/pexels-photo-3683083.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200", "large": "https://images.pexels.com/photos/3683083/pexels-photo-3683083.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "large2x": "https://images.pexels.com/photos/3683083/pexels-photo-3683083.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "medium": "https://images.pexels.com/photos/3683083/pexels-photo-3683083.jpeg?auto=compress&cs=tinysrgb&h=350", "original": "https://images.pexels.com/photos/3683083/pexels-photo-3683083.jpeg", "portrait": "https://images.pexels.com/photos/3683083/pexels-photo-3683083.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800", "small": "https://images.pexels.com/photos/3683083/pexels-photo-3683083.jpeg?auto=compress&cs=tinysrgb&h=130", "tiny": "https://images.pexels.com/photos/3683083/pexels-photo-3683083.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=280"}, "url": "https://www.pexels.com/photo/white-capsule-on-red-surface-3683083/", "width": 5058}
      }
  } // endfold
  saveChanges() { // startfold
      this.element.dataset.altText = this.altText;
      this.element.dataset.attributionText = this.attributionText;
      this.element.dataset.attributionHref = this.attributionHref;
      this.element.dataset.imgSrc = this.imgPreview.src;
  } // endfold
}