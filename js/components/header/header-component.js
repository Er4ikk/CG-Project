import { utils } from "../../../resources/utils.js";

class HeaderComponent extends HTMLElement {

  htmlName = "/js/components/header/header-component.html"
  cssName = "/js/components/header/header-component.css"
  constructor() {
    super();
  }

  async connectedCallback() {
     const cssStyling   = await utils.loadFile(this.cssName)
    const htmlDocument = await utils.loadFile(this.htmlName)
    this.innerHTML = htmlDocument;
    this.innerHTML += "<style>" + cssStyling +"</style>"
  }
}

customElements.define('header-component', HeaderComponent);