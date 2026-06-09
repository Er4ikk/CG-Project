import { utils } from "../../../resources/utils.js";

class GameWindowComponent extends HTMLElement {

  htmlName = "/js/components/game-window/game-window-component.html"
  cssName = "/js/components/game-window/game-window-component.css"
  cssStyling = ""

  htmlDocument = ""



  constructor() {
    super();

  }
  //clean first the html document to prevent multiple style declaration
  manageMobileEvents() {
    //first load
    if (window.screen.width < 600) {
      this.dispatchEvent(new CustomEvent('is-mobile', { bubbles: true }));
    } else {
      this.dispatchEvent(new CustomEvent('not-is-mobile', { bubbles: true }));
    }

    //then listen to changes
    window.addEventListener("resize", (event) => {
      if (window.screen.width < 600) {
        this.dispatchEvent(new CustomEvent('is-mobile', { bubbles: true }));
      } else {
        this.dispatchEvent(new CustomEvent('not-is-mobile', { bubbles: true }));
      }
    });

    // https://dev.to/dcodeyt/the-easiest-way-to-detect-device-orientation-in-javascript-7d7
    window.matchMedia("(orientation: portrait)").addEventListener("change", e => {
      const portrait = e.matches;

      if (portrait) {
        this.dispatchEvent(new CustomEvent('is-portrait', { bubbles: true }));
      } else {
        this.dispatchEvent(new CustomEvent('not-is-portrait', { bubbles: true }));

      }
    });

    // window.onclick = function (event) {
    //   alert(event.target);
    // }
  }


  async connectedCallback() {
    this.cssStyling = await utils.loadFile(this.cssName)
    this.htmlDocument = await utils.loadFile(this.htmlName)

    this.innerHTML = this.htmlDocument;
    // console.log(this.innerHTML)
    

    this.innerHTML += "<style>" + this.cssStyling + "</style>"

    const gameView = document.getElementById("canvas")
    gameView.classList.toggle("hidden")
    const optionsMenu = document.getElementById("options-menu");
    optionsMenu.classList.toggle("hidden")

    this.setEventListeners()
    this.manageMobileEvents()

    this.dispatchEvent(new CustomEvent('game-window-component-loaded', { bubbles: true }));

  }

  setEventListeners() {
    var quickRaceBtn = document.getElementById("quickRaceBtn");
    var optionsBtn = document.getElementById("optionsBtn");
    var helpBtn = document.getElementById("helpBtn");
    quickRaceBtn.addEventListener("click", this.onQuickRaceClick)
    optionsBtn.addEventListener("click", this.onOptionsClick)
    helpBtn.addEventListener("click", this.onHelpClick)
  }

  onQuickRaceClick() {
    console.log("QUICK RACE CLOCKERD")
    const gameView = document.getElementById("canvas")
    const canvasContainer = document.getElementById("canvas-container")
    const wallpaper = document.getElementById("wallpaper")
    gameView.classList.toggle("hidden")
    canvasContainer.classList.toggle("hidden");
    wallpaper.classList.toggle("hidden")

    if(utils.isMobile){
      const touchControls = document.getElementById("touch-controls")
      touchControls.classList.toggle("hidden")
    }
  }

  onOptionsClick() {
    const optionsMenu = document.getElementById("options-menu");
    const mainMenu = document.getElementById("main-menu");

    mainMenu.classList.toggle("hidden")
    optionsMenu.classList.toggle("hidden")
  }

  onHelpClick() {
    console.log("HELP")
  }
}

customElements.define('game-window-component', GameWindowComponent);