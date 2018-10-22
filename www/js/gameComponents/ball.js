class Ball extends Figure {
  constructor(x, y) {
    super(x, y);
  }

  static get R() {
    return 30;
  }

  static get RColor() { return 255 /*230*/ }
  static get GColor() { return 255 /*50*/ }
  static get BColor() { return 255 /*255*/ }

}