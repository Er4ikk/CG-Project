import { utils } from "../../../resources/utils.js";

class GameWindowComponent extends HTMLElement {

  htmlName = "/js/components/game-window/game-window-component.html"
  cssName = "/js/components/game-window/game-window-component.css"
  constructor() {
    super();
  }

  async connectedCallback() {
    const cssStyling   = await utils.loadFile(this.cssName)
    const htmlDocument = await utils.loadFile(this.htmlName)
    this.innerHTML = htmlDocument;
    this.innerHTML += "<style>" + cssStyling +"</style>"

    const gameView         = document.getElementById("canvas")
    gameView.classList.toggle("hidden")
    const optionsMenu      = document.getElementById("options-menu");
    optionsMenu.classList.toggle("hidden")

    this.dispatchEvent(new CustomEvent('game-window-component-loaded', { bubbles: true }));

    this.setEventListeners()
  }

  setEventListeners(){
    var quickRaceBtn = document.getElementById("quickRaceBtn");
    var optionsBtn   = document.getElementById("optionsBtn");
    var helpBtn      = document.getElementById("helpBtn");

    quickRaceBtn.addEventListener("click", this.onQuickRaceClick)
    optionsBtn.addEventListener("click", this.onOptionsClick)
    helpBtn.addEventListener("click", this.onHelpClick)
  }

  onQuickRaceClick(){
    console.log("QUICK RACE CLOCKERD")
    const gameView        = document.getElementById("canvas")
    const canvasContainer = document.getElementById("canvas-container")
    const wallpaper       = document.getElementById("wallpaper")
    gameView.classList.toggle("hidden")
    canvasContainer.classList.toggle("hidden");
    wallpaper.classList.toggle("hidden")
  }

  onOptionsClick(){
    const optionsMenu      = document.getElementById("options-menu");
    const mainMenu         = document.getElementById("main-menu");

    mainMenu.classList.toggle("hidden")
    optionsMenu.classList.toggle("hidden")
  }

  onHelpClick(){
    console.log("HELP")
  }
}

customElements.define('game-window-component', GameWindowComponent);