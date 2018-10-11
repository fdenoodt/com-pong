class Figure {
  constructor(x = undefined, y = undefined) {
    this.X = x;
    this.Y = y;
  }

  get X() {
    return this.x;
  }
  get Y() {
    return this.y;
  }

  set X(value) {
    this.x = value;
  }

  set Y(value) {
    this.y = value;
  }
}