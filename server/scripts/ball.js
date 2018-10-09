const Canvas = require('./canvas.js');


class Ball {
  constructor() {
    this.GoesLeft = Math.floor(Math.random() * 2) == 0 ? true : false;
    this.GoesUp = Math.floor(Math.random() * 2) == 0 ? true : false;
    this.X = Canvas.W / 2;
    this.Y = Canvas.H / 2;
    this.R = 10;
    this.Speed = 0.7;
  }

  get GoesLeft() { return this._goesLeft };
  get GoesUp() { return this._goesUp };
  get X() { return this._x; }
  get Y() { return this._y };
  get R() { return this._r };
  get Speed() { return this._speed };

  set GoesLeft(value) { this._goesLeft = value };
  set GoesUp(value) { this._goesUp = value }
  set X(value) { this._x = value }
  set Y(value) { this._y = value }
  set R(value) { this._r = value }
  set Speed(value) { this._speed = value }


  move() {
    this.GoesLeft ? this.X -= this.Speed : this.X += this.Speed;
    this.GoesUp ? this.Y -= this.Speed : this.Y += this.Speed;
  }
}

module.exports = Ball;
