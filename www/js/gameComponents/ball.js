class Ball extends Figure {
  constructor(x, y) {
    super(x, y);
  }

  static set R(value) {
    this.r = value;
  }

  static get R() {
    return this.r;
  }

  static get RColor() { return 255 /*230*/ }
  static get GColor() { return 255 /*50*/ }
  static get BColor() { return 255 /*255*/ }

}