class MovingBall extends Ball {
  constructor(x, y, degrees) {
    super(x, y);
    this.JumpSize = 1;
    this.Degrees = degrees;
    this.JumpsPerMove = 3;
  }

  get JumpSize() { return this._jumpSize };
  get JumpsPerMove() { return this._jumpsPerMove };
  get Degrees() { return this._degrees; }


  set JumpSize(value) { this._jumpSize = value }
  set JumpsPerMove(value) {this._jumpsPerMove = value}
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