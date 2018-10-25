class MultiRect extends Rect {
  constructor(x, y) {
    super(x, y);
  }


  move(isLeft) {
    socket.emit('move', isLeft);
  }
}