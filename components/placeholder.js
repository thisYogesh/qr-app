class Placeholder extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const { width, height } = this.getBoundingClientRect();
    const { diagonalLength, diagonalAngle } = this.diagonalProperties(
      width,
      height
    );

    this.style.setProperty("--diagonal-length", diagonalLength + "px");
    this.style.setProperty("--diagonal-angle", diagonalAngle + "deg");
  }

  diagonalProperties(width, height) {
    const diagonalLength = Math.sqrt(width ** 2 + height ** 2);
    const diagonalAngle = Math.atan(height / width) * (180 / Math.PI); // in degrees
    return { diagonalLength, diagonalAngle };
  }
}

customElements.define("place-holder", Placeholder);
