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


    leftBtn.addEventListener("touchstart", this.onLeftTouch)
    leftBtn.addEventListener("touchend", this.onLeftRelease)

    rightBtn.addEventListener("touchstart", this.onRightTouch)
    rightBtn.addEventListener("touchend", this.onRightRelease)

    forwardBtn.addEventListener("touchstart", this.onForwardTouch)
    forwardBtn.addEventListener("touchend", this.onForwardRelease)

    backBtn.addEventListener("touchstart", this.onBackTouch)
    backBtn.addEventListener("touchend", this.onBackRelease)
  }

  onLeftTouch() {
    this.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'a',
      code: 'KeyA',
      bubbles: true,
      composed: true
    }));
    
  }

  onLeftRelease() {
    this.dispatchEvent(new KeyboardEvent('keyup', {
      key: 'a',
      code: 'KeyA',
      bubbles: true,
      composed: true
    }));
  }

  onRightTouch() {
    this.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'd',
      code: 'KeyD',
      bubbles: true,
      composed: true
    }));
  }

  onRightRelease() {
    this.dispatchEvent(new KeyboardEvent('keyup', {
      key: 'd',
      code: 'KeyD',
      bubbles: true,
      composed: true
    }));
  }

  onForwardTouch(
  ) {
    this.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'w',
      code: 'KeyW',
      bubbles: true,
      composed: true
    }));
  }

  onForwardRelease() {
    this.dispatchEvent(new KeyboardEvent('keyup', {
      key: 'w',
      code: 'KeyW',
      bubbles: true,
      composed: true
    }));
  }

  onBackTouch() {
    this.dispatchEvent(new KeyboardEvent('keydown', {
      key: 's',
      code: 'KeyS',
      bubbles: true,
      composed: true
    }));
  }

  onBackRelease() {
    this.dispatchEvent(new KeyboardEvent('keyup', {
      key: 's',
      code: 'KeyS',
      bubbles: true,
      composed: true
    }));
  }
}

customElements.define('touch-controls-component', TouchControlsComponent);