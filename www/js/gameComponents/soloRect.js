class SoloRect extends Rect {
  constructor(x, y) {
    super(x, y);

    this._left = false;
    this._right = false;



    const soloScr = document.querySelector('.solo');
    const that = this;
    soloScr.addEventListener('touchstart', function (ev) {
      const x = ev.touches[0].clientX;
      x < screenWidth / 2 ? that._left = true : that._right = true;
    }, false);

    soloScr.addEventListener('touchend', function (ev) {
      const x = ev.changedTouches[0].clientX;
      x < screenWidth / 2 ? that._left = false : that._right = false;
    }, false);
  }


  move() {
    if (this._right)
      super.move(false);
    if (this._left)
      super.move(true);
  }
}