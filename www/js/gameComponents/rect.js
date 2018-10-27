class Rect extends Figure {
  constructor(x, y) {
    super(x, y);
  }

  get Id() {
    return this.id;
  }

  set Id(value) {
    this.id = value;
  }

  static get JumpsPerMove() { return 5; }
  static get JumpSize() { return 0.5 }

  static get H() {
    return 30;
  }


  static get W() {
    return 300;
  }

  move(isLeft) {
    isLeft ? this.X -= Rect.JumpSize : this.X += Rect.JumpSize;
  }

}