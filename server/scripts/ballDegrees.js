const Canvas = require('./canvas.js');


class BallDegrees {
  constructor(x = Canvas.W / 2, y = Canvas.H / 2) {
    this.X = x;
    this.Y = y;
    this.R = 50;
    
    this.JumpSize = 0.5;
    this.Degrees = -110;
    // this.JumpsPerMove = 1;
    this.JumpsPerMove = 10;
  }

  get X() { return this._x; }
  get Y() { return this._y };
  get R() { return this._r };
  get JumpSize() { return this._speed };
  get Degrees() { return this._degrees; }


  set X(value) { this._x = value }
  set Y(value) { this._y = value }
  set R(value) { this._r = value }
  set JumpSize(value) { this._speed = value }
  set Degrees(value) { this._degrees = value }

  move() {
    let rad = this.degToRad(this.Degrees);
    let hypotenuse = this.JumpSize;

    //Sin(20 Deg) = x/0.7
    let opposite = Math.sin(rad) * hypotenuse;

    //Cos(20 deg) = adjacent / hypotenuse
    let adjacent = Math.cos(rad) * hypotenuse;

    this.Y -= adjacent;
    this.X += opposite;
  }

  degToRad(degrees) {
    return degrees * (Math.PI / 180);
  }

  bounceVertically() {
    this.Degrees = 180 - this.Degrees;
  }

  bounceSideways() {
    this.Degrees = 180 + (180 - this.Degrees);
  }

}

module.exports = BallDegrees;
