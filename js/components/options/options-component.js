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
    this.innerHTML += "<style>" + cssStyling + "</style>"
    // this.dispatchEvent(new CustomEvent('options-component-loaded', { bubbles: true }));

    this.setEventListeners();
  }

  onMusicToggle(checkbox) {
    utils.isMusicEnabled = checkbox.explicitOriginalTarget.checked
  }

  onDebugToggle(checkbox) {
    // console.log(checkbox.explicitOriginalTarget.checked)
    utils.isDebugEnabled = checkbox.explicitOriginalTarget.checked
  }

  onShadowToggle(checkbox) {
    // debugger
    utils.areShadowEnabled = checkbox.explicitOriginalTarget.checked
  }


  setEventListeners() {
    const debugCheckbox = document.getElementById("debug-checkbox")
    const musicCheckbox = document.getElementById("music-checkbox")
    const shadowsCheckbox = document.getElementById("shadows-checkbox")

    if (debugCheckbox != null) {
      debugCheckbox.addEventListener("click", (e) => this.onDebugToggle(e))
    }

    if (musicCheckbox != null) {
      musicCheckbox.addEventListener("click", (e) => this.onMusicToggle(e))
    }
    if (shadowsCheckbox != null) {
      shadowsCheckbox.addEventListener("click", (e) => this.onShadowToggle(e))
    }

    var backBtn = document.getElementById("backBtn");

    if (backBtn != null)
      backBtn.addEventListener("click", this.onBackClick)
  }


  onBackClick() {
    const optionsMenu = document.getElementById("options-menu");
    const mainMenu = document.getElementById("main-menu");

    mainMenu.classList.toggle("hidden")
    optionsMenu.classList.toggle("hidden")
  }

}

customElements.define('options-component', OptionsComponent);