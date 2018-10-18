const Canvas = require('./canvas.js');
const User = require('./user.js');
const UserGameState = require('./userGameState.js');
const BallDegrees = require('./ballDegrees.js');

class Game {
  constructor(userDuo) {
    this._isOver = false;
    this._lsPlayers = [];
    this._ball = new BallDegrees();

    this.createPlayers(userDuo);
    this.givePlayersValues();
    this.sendInitalValues();
    this.setupMessageReplies();
  }

  get IsOver() {
    return this._isOver;
  }

  createPlayers(userDuo) {
    for (const user of userDuo) {
      const gameState = new UserGameState();
      user.UserGameState = gameState;
      this._lsPlayers.push(user);
      this.sendData(user, 'foundGame');
    }
  }

  givePlayersValues() {

    this._lsPlayers[0].UserGameState.X = Canvas.W / 2 - UserGameState.W;
    this._lsPlayers[0].UserGameState.Y = 20;

    this._lsPlayers[1].UserGameState.X = Canvas.W / 2 - UserGameState.W;
    this._lsPlayers[1].UserGameState.Y = Canvas.H - UserGameState.H - 20;
  }

  sendInitalValues() {
    for (const u of this._lsPlayers) {
      this.sendData(u, 'meInit', u.UserGameState.X, u.UserGameState.Y, UserGameState.W, UserGameState.H);
      this.sendData(u, 'ballInit', this._ball.X, this._ball.Y, this._ball.R);
      const other = this.getOther(u);
      this.sendData(u, 'enemyInit', other.UserGameState.X, other.UserGameState.Y, UserGameState.W, UserGameState.H);
    }
  }

  getOther(p) {
    return p == this._lsPlayers[0] ? this._lsPlayers[1] : this._lsPlayers[0];
  }

  sendData(player, key, ...data) {
    player.Socket.emit(key, ...data);
  }

  setupMessageReplies() {
    for (const pl of this._lsPlayers) {
      pl.Socket.on('move', (isLeft) => {
        this.movePlayer(pl, isLeft);
        pl.Socket.emit('meX', pl.UserGameState.X);
        this.getOther(pl).Socket.emit('enemyX', pl.UserGameState.X);
      });

      pl.Socket.on('preciseMove', (x) => {
        pl.X = x;
        pl.Socket.emit('meX', pl.X);
        this.getOther(pl).Socket.emit('enemyX', pl.UserGameState.X);
      });
    }
  }

  movePlayer(player, isLeft) {
    const jumpsPerMove = UserGameState.JumpsPerMove;
    const jumpsize = UserGameState.JumpSize;
    for (let i = 0; i < jumpsPerMove; i++) {
      if (!this.isTouchingBall(player)) {
        isLeft ? player.UserGameState.X -= jumpsize : player.UserGameState.X += jumpsize;

        for (const pl of this._lsPlayers) {
          this.playerCollissionCheck(pl);
        }
      }

    }
  }

  playTick() {
    for (let i = 0; i < this._ball.JumpsPerMove; i++) {
      this._ball.move();
      this.boarderCollissionCheck();
      for (const pl of this._lsPlayers) {
        this.playerCollissionCheck(pl);
      }
      this.sendBallLocation();
    }
  }

  boarderCollissionCheck() {
    if (this._ball.Y - this._ball.R <= 0)
      this.gameover('gameover', this._lsPlayers[1], this._lsPlayers[0]);

    else if (this._ball.Y + this._ball.R >= Canvas.H)
      this.gameover('gameover', this._lsPlayers[0], this._lsPlayers[1]);

    else if (this._ball.X - this._ball.R <= 0 ||
      this._ball.X + this._ball.R >= Canvas.W) {
      this._ball.bounceSideways();
    }
  }

  playerCollissionCheck(player) {
    if (this.isTouchingSide(player))
      this._ball.bounceSideways();

    if (this.isTouchingVertically(player))
      this._ball.bounceVertically();
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

  sendBallLocation() {
    for (const p of this._lsPlayers) {
      this.sendData(p, 'ball', this._ball.X, this._ball.Y)
    }
  }

  gameover(reason, winner = null, loser = null) {
    this.sendData(winner, reason, 'win');
    this.sendData(loser, reason, 'loss');
    this._isOver = true;
  }
}

module.exports = Game;