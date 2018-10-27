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

  playerCollissionCheck(player) {
    if (this.isTouchingSide(player)) {
      this._ball.bounceSideways();
      this.emitQuickVibrate(player)
    }

    if (this.isTouchingVertically(player)) {
      this._ball.bounceVertically();
      this.emitQuickVibrate(player)
    }
  }



  isTouchingSide(user) {
    const b = this._ball;
    const p = user.UserGameState;
    function isInYRangeOfPlayer() {
      return b.Y + b.R >= p.Y && b.Y - b.R <= p.Y + UserGameState.H ? true : false;
    }
    if (Math.floor(b.X + b.R) == p.X && isInYRangeOfPlayer()) //left side bounce
      return true;
    else if (Math.ceil(b.X - b.R) == p.X + UserGameState.W && isInYRangeOfPlayer()) //right side bounce
      return true;
    else
      return false;
  }

  isTouchingVertically(user) {
    const b = this._ball;
    const p = user.UserGameState;

    function isInXRangeOfPlayer() {
      return b.X + b.R >= p.X && b.X - b.R <= p.X + UserGameState.W ? true : false;
    }

    if (b.Y + b.R >= p.Y && b.Y - b.R <= p.Y + UserGameState.H)
      if (Math.floor(b.Y + b.R) == p.Y && isInXRangeOfPlayer())
        return true;
      else if (Math.ceil(b.Y - b.R) == p.Y + UserGameState.H && isInXRangeOfPlayer())
        return true;
      else return false;

  }


  isTouchingBall(user) {
    const player = user.UserGameState;
    if (this._ball.X >= player.X && this._ball.X <= player.X + UserGameState.W
      && this._ball.Y + this._ball.R >= player.Y && this._ball.Y - this._ball.R <= player.Y + UserGameState.H) {
      return true;
    } else if (this._ball.X + this._ball.R >= player.X - 2 && this._ball.X - this._ball.R <= player.X + UserGameState.W + 2 &&
      this._ball.Y + this._ball.R > player.Y && this._ball.Y - this._ball.R <= player.Y + UserGameState.H
    ) {
      return true;
    }
    else return false;
  }

  displayState() {
    this._canvas.updateScreen(this._bot, this._player, this._ball);
  }


  gameover() {
    // this._isOver = true;
    clearInterval(soloTimer);
  }
}







