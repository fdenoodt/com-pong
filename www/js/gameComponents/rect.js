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

  static get H() {
    return 30;
  }


  static get W() {
    return 300;
  }

  preciseMove(x) {
    socket.emit('preciseMove', x);
  }

  move(isLeft) {
    socket.emit('move', isLeft);
  }
}