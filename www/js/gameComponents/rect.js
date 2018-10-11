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

  static set H(value) {
    this.h = value;
  }

  static get H() {
    return this.h;
  }

  static set W(value) {
    this.w = value;
  }

  static get W() {
    return this.w;
  }

  preciseMove(x) {
    socket.emit('preciseMove', x);
  }

  move(isLeft) {
    socket.emit('move', isLeft);
  }
}