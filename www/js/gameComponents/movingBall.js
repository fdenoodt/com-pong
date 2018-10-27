class MovingBall extends Ball {
  constructor(x, y, degrees) {
    super(x, y);
    this.Degrees = degrees;
  }

  static get JumpSize() { return 1 };
  static get JumpsPerMove() { return 3 }
  get Degrees() { return this._degrees; }
  set Degrees(value) { this._degrees = value }

  move() {
    let rad = this.degToRad(this.Degrees);
    let hypotenuse = MovingBall.JumpSize;

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