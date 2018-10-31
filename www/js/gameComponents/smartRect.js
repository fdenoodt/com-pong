class SmartRect extends Rect {
  constructor(x, y, ball) {
    super(x, y);
    this._ball = ball;
    this._xOBjective = null;
    this._timeToTravel = 0;
    this.startTime = new Date().getTime();
    this._expectedTime = Infinity;
    this._testCounter = 0;
  }

  get XObjective() {
    return this._xOBjective;
  }

  set XObjective(value) {
    this._xOBjective = value;
  }

  think() {
    if (this._xOBjective == null) {
      const direction = this._ball.Degrees;
      const x = this._ball.X;
      const y = this._ball.Y;
      this._xOBjective = Math.round((this.calculateWhereBallWillArrive(direction, x, y)) - (Rect.W / 2));
    }

    if (this.X < this._xOBjective) {
      this.move(false)
    }
    else if (this.X > this._xOBjective) {
      this.move(true)
    }

    if (new Date().getTime() >= this._expectedTime) {
      if (this._testCounter == 0) {
        alert('done')
        this._testCounter++;
      }

    }
  }

  calculateWhereBallWillArrive(direction, x, y) {
    console.log(direction, x, y);

    const w = Canvas.W;
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
    if (nextY < 30 + Rect.H) {
      adj = y;
      let opposite = tanB * adj;
      nextX = x + opposite;
      nextY = 30 + Rect.H + MovingBall.R;

      this.updateTravelDistance(x, y, nextX, nextY);

      return nextX;
    }
    else {
      const newDirection = 180 + (180 - simplifiedDirection);
      this.updateTravelDistance(x, y, nextX, nextY);
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

  updateTravelDistance(currX, currY, nextX, nextY) {
    const b = Math.abs(currX - nextX);
    const c = Math.abs(currY - nextY);
    const a = Math.sqrt((b * b) + (c * c));

    this._timeToTravel += a;
    this._expectedTime = this.startTime + this._timeToTravel;
    console.log(this._timeToTravel);
  }

  goLeft() {

  }

  goRight() {

  }
}