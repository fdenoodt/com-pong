class Game {
  constructor() {
    this._ball = new MovingBall(1000, 500, 30);
    this._bot = new SmartRect(Canvas.W / 2 - Rect.W / 2, 20, this._ball);
    this._player = new SoloRect(Canvas.W / 2 - Rect.W / 2, Canvas.H - Rect.H - 20)
    this._canvas = new Canvas();
    this._score = 0;
  }

  playTick() {
    for (let i = 0; i < MovingBall.JumpsPerMove; i++) {
      this._ball.move();
      this.boarderCollissionCheck();
      this.playerCollissionCheck(this._bot);
      this.playerCollissionCheck(this._player);
    }

    for (let i = 0; i < Rect.JumpsPerMove; i++)
      this._bot.think();

    for (let i = 0; i < Rect.JumpsPerMove; i++)
      this._player.move();


    this.displayState();
    this._score++;
  }

  boarderCollissionCheck() {
    if (this._ball.Y - MovingBall.R <= 0)
      this.gameover();
    else if (this._ball.Y + MovingBall.R >= Canvas.H) {
      this.gameover();
    }
    else if (this._ball.X - MovingBall.R <= 0 ||
      this._ball.X + MovingBall.R >= Canvas.W) {
      this._ball.bounceSideways();
    }
  }

  playerCollissionCheck(player) {
    if (this.isTouchingSide(player)) {
      this._ball.bounceSideways();
      this._bot.XObjective = null;
      handleQuickVibration();
    }


    if (this.isTouchingVertically(player)) {
      this._ball.bounceVertically();
      this._bot.XObjective = null;
      handleQuickVibration();
    }
  }



  isTouchingSide(user) {
    const b = this._ball;
    const p = user;
    function isInYRangeOfPlayer() {
      return b.Y + Ball.R >= p.Y && b.Y - Ball.R <= p.Y + Rect.H ? true : false;
    }
    if (Math.floor(b.X + Ball.R) == p.X && isInYRangeOfPlayer()) //left side bounce
      return true;
    else if (Math.ceil(b.X - Ball.R) == p.X + Rect.W && isInYRangeOfPlayer()) //right side bounce
      return true;
    else
      return false;
  }

  isTouchingVertically(user) {
    const b = this._ball;
    const p = user;

    function isInXRangeOfPlayer() {
      return b.X + Ball.R >= p.X && b.X - Ball.R <= p.X + Rect.W ? true : false;
    }

    if (b.Y + Ball.R >= p.Y && b.Y - Ball.R <= p.Y + Rect.H)
      if (Math.floor(b.Y + Ball.R) == p.Y && isInXRangeOfPlayer())
        return true;
      else if (Math.ceil(b.Y - Ball.R) == p.Y + Rect.H && isInXRangeOfPlayer())
        return true;
      else return false;

  }


  isTouchingBall(user) {
    const player = user;
    if (this._ball.X >= player.X && this._ball.X <= player.X + Rect.W
      && this._ball.Y + this._ball.R >= player.Y && this._ball.Y - this._ball.R <= player.Y + Rect.H) {
      return true;
    } else if (this._ball.X + this._ball.R >= player.X - 2 && this._ball.X - this._ball.R <= player.X + Rect.W + 2 &&
      this._ball.Y + this._ball.R > player.Y && this._ball.Y - this._ball.R <= player.Y + Rect.H
    ) {
      return true;
    }
    else return false;
  }

  displayState() {
    this._canvas.updateScreen(this._bot, this._player, this._ball);
  }


  gameover() {
    clearInterval(soloTimer);
    warn("Game Over", `You achieved a score of: ${Math.round(this._score / 100)}`);
    // goTo("home");
    soloGame = null;
  }
}







