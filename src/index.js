import template from "./template.html";
import style from "./style.css";
// Custom element
class OneDialog extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.close = this.close.bind(this);
  }

  static get observedAttributes() {
    return ["open"];
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (oldValue !== newValue) {
      this[attrName] = this.hasAttribute(attrName);
    }
  }

  connectedCallback() {
    const { shadowRoot } = this;
    shadowRoot.innerHTML = template;
    debugger;
    shadowRoot.querySelector("button").addEventListener("click", this.close);
    shadowRoot.querySelector(".overlay").addEventListener("click", this.close);
    this.open = this.open;
  }

  disconnectedCallback() {
    this.shadowRoot
      .querySelector("button")
      .removeEventListener("click", this.close);
    this.shadowRoot
      .querySelector(".overlay")
      .removeEventListener("click", this.close);
  }

  get open() {
    return this.hasAttribute("open");
  }

  set open(isOpen) {
    const { shadowRoot } = this;
    shadowRoot.querySelector(".wrapper").classList.toggle("open", isOpen);
    shadowRoot.querySelector(".wrapper").setAttribute("aria-hidden", !isOpen);
    if (isOpen) {
      this._wasFocused = document.activeElement;
      this.setAttribute("open", "");
      document.addEventListener("keydown", this._watchEscape);
      this.focus();
      shadowRoot.querySelector("button").focus();
    } else {
      this._wasFocused && this._wasFocused.focus && this._wasFocused.focus();
      this.removeAttribute("open");
      document.removeEventListener("keydown", this._watchEscape);
      this.close();
    }
  }

  close() {
    if (this.open !== false) {
      this.open = false;
    }
    const closeEvent = new CustomEvent("dialog-closed");
    this.dispatchEvent(closeEvent);
  }

  _watchEscape(event) {
    if (event.key === "Escape") {
      this.close();
    }
  }
}

class DialogWorkflow extends HTMLElement {
  connectedCallback() {
    this._onDialogClosed = this._onDialogClosed.bind(this);
    this.addEventListener("dialog-closed", this._onDialogClosed);
  }

  get dialogs() {
    return Array.from(this.querySelectorAll("one-dialog"));
  }

  _onDialogClosed(event) {
    const dialogClosed = event.target;
    const nextIndex = this.dialogs.indexOf(dialogClosed);
    if (nextIndex !== -1) {
      this.dialogs[nextIndex].open = true;
    }
  }
}

customElements.define("one-dialog", OneDialog);

const button = document.getElementById("launch-dialog");
button.addEventListener("click", () => {
  document.querySelector("one-dialog").open = true;
});
