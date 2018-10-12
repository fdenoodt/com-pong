const Canvas = require('./canvas.js');
const Player = require('./player.js');
const BallDegrees = require('./ballDegrees.js');

class Game {
  constructor(duoSocket) {
    this._isOver = false;
    this._lsPlayers = [];
    this._ball = new BallDegrees();

    this.createPlayers(duoSocket);
    this.givePlayersValues();
    this.sendInitalValues();
    this.setupMessageReplies();
  }

  get IsOver() {
    return this._isOver;
  }

  createPlayers(duoSocket) {
    for (const person of duoSocket) {
      const pl = new Player(person);
      this._lsPlayers.push(pl);
      this.sendData(pl, 'foundGame');
    }
  }

  givePlayersValues() {
    this._lsPlayers[0].X = Canvas.W / 2 - Player.W;
    this._lsPlayers[0].Y = 20;

    this._lsPlayers[1].X = Canvas.W / 2 - Player.W;
    this._lsPlayers[1].Y = Canvas.H - Player.H - 20;
  }

  sendInitalValues() {
    for (const p of this._lsPlayers) {
      this.sendData(p, 'meInit', p.X, p.Y, Player.W, Player.H);
      this.sendData(p, 'ballInit', this._ball.X, this._ball.Y, this._ball.R);
      const other = this.getOther(p);
      this.sendData(p, 'enemyInit', other.X, other.Y, Player.W, Player.H);
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
      pl.Socket.on('pingReply', () => {
        this.handlePingReply(pl);
      });

      pl.Socket.on('move', (isLeft) => {
        this.movePlayer(pl, isLeft);
        pl.Socket.emit('meX', pl.X);
        this.getOther(pl).Socket.emit('enemyX', pl.X);
      });

      pl.Socket.on('preciseMove', (x) => {
        pl.X = x;
        pl.Socket.emit('meX', pl.X);
        this.getOther(pl).Socket.emit('enemyX', pl.X);
      });

      // pl.Socket.on('reset', () => {
      //   pl.WantsReset = true;
      //   this.reset();
      // });
    }
  }

  movePlayer(player, isLeft) {
    let JumpsPerMove = player.JumpsPerMove;
    for (let i = 0; i < JumpsPerMove; i++) {
      if (!this.isTouchingBall(player)) {
        isLeft ? player.X -= player.JumpSize : player.X += player.JumpSize;

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

  afkTick() {
    this.trackConnections();
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
    if (this._ball.X >= player.X && this._ball.X <= player.X + Player.W
      && this._ball.Y + this._ball.R >= player.Y && this._ball.Y - this._ball.R <= player.Y + Player.H) {
      this._ball.bounceVertically();
    } else if (this._ball.X + this._ball.R >= player.X && this._ball.X - this._ball.R <= player.X + Player.W &&
      this._ball.Y + this._ball.R > player.Y && this._ball.Y - this._ball.R <= player.Y + Player.H
    ) {
      this._ball.bounceSideways();
    }
  }

  isTouchingBall(player) {
    if (this._ball.X >= player.X && this._ball.X <= player.X + Player.W
      && this._ball.Y + this._ball.R >= player.Y && this._ball.Y - this._ball.R <= player.Y + Player.H) {
      return true;
    } else if (this._ball.X + this._ball.R >= player.X - 2 && this._ball.X - this._ball.R <= player.X + Player.W + 2 &&
      this._ball.Y + this._ball.R > player.Y && this._ball.Y - this._ball.R <= player.Y + Player.H
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

  trackConnections() {
    for (const p of this._lsPlayers) {
      p.TimeWithoutResponse++;
      p.IsPresent = false;
      if (p.TimeWithoutResponse >= 4)
        this.gameover('disonnected', this.getOther(p), p)

      this.sendPing(p);
    }
  }

  sendPing(p) {
    this.sendData(p, 'ping');
  }

  handlePingReply(p) {
    p.TimeWithoutResponse = 0;
  }
}

module.exports = Game;