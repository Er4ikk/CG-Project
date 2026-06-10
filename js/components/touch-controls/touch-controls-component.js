import { utils } from "../../../resources/utils.js";
class TouchControlsComponent extends HTMLElement {

  htmlName = "/js/components/touch-controls/touch-controls-component.html"
  cssName = "/js/components/touch-controls/touch-controls-component.css"
  cssStyling = ""
  htmlDocument = ""
  constructor() {
    super();
  }

  async connectedCallback() {
    this.cssStyling = await utils.loadFile(this.cssName)
    this.htmlDocument = await utils.loadFile(this.htmlName)

    this.innerHTML = this.htmlDocument;
    // console.log(this.innerHTML)


    this.innerHTML += "<style>" + this.cssStyling + "</style>"

    this.setEventListeners()

  }

  // touchstart -> https://developer.mozilla.org/en-US/docs/Web/API/Element/touchstart_event
  // touchend   -> https://developer.mozilla.org/en-US/docs/Web/API/Element/touchend_event

  setEventListeners() {
    var leftBtn = document.getElementById("leftBtn");
    var rightBtn = document.getElementById("rightBtn");
    var forwardBtn = document.getElementById("forwardBtn");
    var backBtn = document.getElementById("backBtn");


    leftBtn.addEventListener("touchstart", utils.onLeftTouch)
    leftBtn.addEventListener("touchend", utils.onLeftRelease)

    rightBtn.addEventListener("touchstart", utils.onRightTouch)
    rightBtn.addEventListener("touchend", utils.onRightRelease)

    forwardBtn.addEventListener("touchstart", utils.onForwardTouch)
    forwardBtn.addEventListener("touchend", utils.onForwardRelease)

    backBtn.addEventListener("touchstart", utils.onBackTouch)
    backBtn.addEventListener("touchend", utils.onBackRelease)
  }
}

customElements.define('touch-controls-component', TouchControlsComponent);