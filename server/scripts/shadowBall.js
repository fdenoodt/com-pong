const Canvas = require('./canvas.js');


class ShadowBall {
  constructor(x = Canvas.W / 2, y = Canvas.H / 2) {
    this.X = x;
    this.Y = y;
  }

  get X() { return this._x; }
  get Y() { return this._y };
  set X(value) { this._x = value }
  set Y(value) { this._y = value }
}

module.exports = ShadowBall;
