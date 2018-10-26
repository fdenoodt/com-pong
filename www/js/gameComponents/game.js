class Game {
  constructor() {
    this._ball = new MovingBall(1000, 500, 30);
    this._bot = new SmartRect(Canvas.W / 2 - Rect.W / 2, 20, this._ball);
    this._player = new Rect(Canvas.W / 2 - Rect.W / 2, Canvas.H - Rect.H - 20)
    this._canvas = new Canvas();
  }

  playTick() {
    //  console.log(MovingBall.JumpsPerMove);
    for (let i = 0; i < MovingBall.JumpsPerMove; i++) {
      this._ball.move();

      for (let i = 0; i < Rect.JumpsPerMove; i++)
        this._bot.think();

      this.boarderCollissionCheck();
      this.playerCollissionCheck();
    }
    this.displayState();
  }

  boarderCollissionCheck() {
    if (this._ball.Y - MovingBall.R <= 0)
      this.gameover();
    else if (this._ball.Y + MovingBall.R >= Canvas.H) {
      this._ball.bounceVertically();
    }
    else if (this._ball.X - MovingBall.R <= 0 ||
      this._ball.X + MovingBall.R >= Canvas.W) {
      this._ball.bounceSideways();
    }
  }

  playerCollissionCheck() {

  }

  isTouchingBall(player) {
  }

  displayState() {
    this._canvas.updateScreen(this._bot, this._player, this._ball);
  }


  gameover() {
    // this._isOver = true;
    clearInterval(soloTimer);
  }
}







