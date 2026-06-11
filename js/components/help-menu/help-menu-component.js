import { utils } from "../../../resources/utils.js";

class HelpMenuComponent extends HTMLElement {

    htmlName = "/js/components/help-menu/help-menu-component.html"
  cssName = "/js/components/help-menu/help-menu-component.css"

    constructor(){
        super();
    }

    async connectedCallback() {
    const cssStyling = await utils.loadFile(this.cssName)
    const htmlDocument = await utils.loadFile(this.htmlName)
    this.innerHTML = htmlDocument;
    this.innerHTML += "<style>" + cssStyling + "</style>"
    // this.dispatchEvent(new CustomEvent('help-menu-loaded', { bubbles: true }));

    this.setEventListeners();
  }

  setEventListeners(){
    //always use different ids in components
     var backBtn = document.getElementById("backBt");

    if (backBtn != null)
      backBtn.addEventListener("click", this.onBackClick)
  }

   onBackClick() {
    // debugger
    const helpMenu = document.getElementById("help-menu");
    const mainMenu = document.getElementById("main-menu");

    mainMenu.classList.toggle("hidden")
    helpMenu.classList.toggle("hidden")
  }
  
}
customElements.define('help-menu-component', HelpMenuComponent);