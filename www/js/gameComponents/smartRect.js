class SmartRect extends Rect {
  constructor(x, y, ball) {
    super(x, y);
    this._ball = ball;
    this._xOBjective = null;
  }

  think() {
    if (this._xOBjective == null) {
      const direction = this._ball.Degrees;
      const x = this._ball.X;
      const y = this._ball.Y;
      this._xOBjective = Math.round((this.calculateWhereBallWillArrive(direction, x, y)) - (Rect.W / 2));
    }

    if (this.X  < this._xOBjective) {
      this.move(false)
    }
    else if (this.X > this._xOBjective) {
      this.move(true)
    }
  }

  calculateWhereBallWillArrive(direction, x, y) {
    console.log(direction, x, y);

    const w = Canvas.W;
    const h = Canvas.H;
    const simplifiedDirection = this.simplifyDegrees(direction);
    if (simplifiedDirection >= 89 && simplifiedDirection <= 271) {
      simplifiedDirection;
      return 600;

    }
    const rad = this.degToRad(simplifiedDirection);
    const tanB = Math.tan(rad);

    let nextX;
    let nextY;
    let adj;

    //Formula:
    //https://www.google.be/search?q=sinus+formule&tbm=isch&source=iu&ictx=1&fir=PMWFjKKR2PjCIM%253A%252CSPS6U1f2fHzYLM%252C_&usg=AI4_-kQEuwYiDtODyuGNHz_fQLaV2lrHpQ&sa=X&ved=2ahUKEwjCp4zkxJreAhVQC-wKHeLuCoIQ9QEwBnoECAUQDA#imgrc=I1JuEGwr4_TDnM:
    if (simplifiedDirection > 180) { //left bounce
      const opposite = x;
      adj = opposite / tanB;
      nextY = y + adj;
      nextX = 0;
    }
    else { //right bounce
      const opposite = w - x;
      adj = opposite / tanB;
      nextY = y - adj;
      nextX = w;
    }

    //if ball will not bounce on wall, but on player 
    if (nextY < 30) {
      adj = y;
      let opposite = tanB * adj;
      nextX = x + opposite;
      nextY = 30;
      return nextX;
    }
    else {
      const newDirection = 180 + (180 - simplifiedDirection);
      return this.calculateWhereBallWillArrive(newDirection, nextX, nextY);
    }
  }

  simplifyDegrees(degrees) {
    if (degrees > 360)
      return this.simplifyDegrees(degrees - 360)
    else if (degrees < 0)
      return this.simplifyDegrees(degrees + 360)
    else
      return degrees;
  }

  degToRad(degrees) {
    return degrees * (Math.PI / 180);
  }

  goLeft() {

  }

  goRight() {

  }
}