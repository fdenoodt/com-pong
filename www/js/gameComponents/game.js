class Game {
  constructor() {
    this._ball = new MovingBall(1000, 500, 85);
    this._player = new SmartRect(40, 20, this._ball);
    this._canvas = new Canvas(this._player);
  }

  playTick() {
    for (let i = 0; i < this._ball.JumpsPerMove; i++) {
      this._ball.move();
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
    this._canvas.updateScreen(this._player, this._ball);
  }


  gameover() {
    // this._isOver = true;
    clearInterval(soloTimer);
  }
}







