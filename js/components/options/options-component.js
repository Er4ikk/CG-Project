import { utils } from "../../../resources/utils.js";

class OptionsComponent extends HTMLElement {

  htmlName = "/js/components/options/options-component.html"
  cssName = "/js/components/options/options-component.css"
  constructor() {
    super();
  }

  async connectedCallback() {
    const cssStyling = await utils.loadFile(this.cssName)
    const htmlDocument = await utils.loadFile(this.htmlName)
    this.innerHTML = htmlDocument;
    this.innerHTML += "<style>" + cssStyling +"</style>"
    this.dispatchEvent(new CustomEvent('options-component-loaded', { bubbles: true }));

    this.setEventListeners();
  }


  setEventListeners() {
    var saveBtn = document.getElementById("saveBtn");
    var backBtn = document.getElementById("backBtn");
    
    if(saveBtn != null)
      saveBtn.addEventListener("click", this.onSaveClick)
    if(backBtn != null)
      backBtn.addEventListener("click", this.onBackClick)
  }

  onSaveClick() {
    const optionsMenu      = document.getElementById("options-menu");
    const mainMenu         = document.getElementById("main-menu");

    mainMenu.classList.toggle("hidden")
    optionsMenu.classList.toggle("hidden")
  }

  onBackClick() {
    const optionsMenu      = document.getElementById("options-menu");
    const mainMenu         = document.getElementById("main-menu");

    mainMenu.classList.toggle("hidden")
    optionsMenu.classList.toggle("hidden")
  }

  onHelpClick() {
    console.log("HELP")
  }
}

customElements.define('options-component', OptionsComponent);