class SmartRect extends Rect {
  constructor(x, y, ball) {
    super(x, y);
    this._ball = ball;
    this.think()
  }

  think() {
    this.calculateWhereBallWillArrive()
  }

  calculateWhereBallWillArrive() {
    const direction = this._ball.Degrees;
    const x = this._ball.X;
    const y = this._ball.Y;

    const w = Canvas.W;
    const h = Canvas.H;
    const simplifiedDirection = this.simplifyDegrees(direction);
    const rad = this.degToRad(simplifiedDirection);

    let nextX;
    let nextY;
    let adj;

    //Formula:
    //https://www.google.be/search?q=sinus+formule&tbm=isch&source=iu&ictx=1&fir=PMWFjKKR2PjCIM%253A%252CSPS6U1f2fHzYLM%252C_&usg=AI4_-kQEuwYiDtODyuGNHz_fQLaV2lrHpQ&sa=X&ved=2ahUKEwjCp4zkxJreAhVQC-wKHeLuCoIQ9QEwBnoECAUQDA#imgrc=I1JuEGwr4_TDnM:
    const tanB = Math.tan(rad);
    if (simplifiedDirection > 180) {
      const opposite = x;
      adj = opposite / tanB;
      nextY = y + adj;
      nextX = 0;
    }
    else {
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
    }


    //temporary set player there
    this.Y = nextY;
    this.X = nextX - 100;

  }

  simplifyDegrees(degrees) {
    if (degrees > 360)
      return this.simplifyDegrees(degrees - 360)
    else if (degrees < 0)
      return this.simplifyDegrees(degrees + 360)
    else
      return degrees;
  }

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

  goLeft() {

  }

  goRight() {

  }
}