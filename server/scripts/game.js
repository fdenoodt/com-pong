const Canvas = require('./canvas.js');
const Player = require('./player.js');
const BallDegrees = require('./ballDegrees.js');


class Game {
  constructor(duoSocket) {

    this._lsPlayers = [];
    for (const person of duoSocket) {
      person.emit('foundGame');
      this._lsPlayers.push(new Player(person));
    }

    this._canBeDeleted = false;
    this.givePlayersValues();
    this._ball = new BallDegrees();

    for (const p of this._lsPlayers) {
      this.sendData(p, 'meInit', p.X, p.Y, Player.W, Player.H);
      this.sendData(p, 'ballInit', this._ball.X, this._ball.Y, this._ball.R);
      const other = p == this._lsPlayers[0] ? this._lsPlayers[1] : this._lsPlayers[0];
      this.sendData(other, 'enemyInit', other.X, other.Y, Player.W, Player.H);
    }

    this._lsPlayers[0].Socket.on('isReady', () => {
      this._lsPlayers[0].Socket.emit('lolol');
      console.log('done', this._lsPlayers[0].Socket.id);
    });

    this._lsPlayers[1].Socket.on('isReady', () => {
      this._lsPlayers[1].Socket.emit('lolol');
      console.log('done');
    });

    // this.initPingReplies();

    // if (this.isFull()) {
    //   this.canStart = true;
    //   this.receiveMessages();
    // }

  }

  sendData(player, key, ...data) {
    // console.log(player.Socket);
    // player.Socket.emit('lolol', 'hello');
  }

  receiveMessages() {
    this.Player1.Socket.on('move', (isLeft) => {
      this.movePlayer(this.Player1, isLeft);
      this.Player1.Socket.emit('meX', this.Player1.X);
      this.Player2.Socket.emit('enemyX', this.Player1.X);
    });

    this.Player2.Socket.on('move', (isLeft) => {
      this.movePlayer(this.Player2, isLeft)
      this.Player2.Socket.emit('meX', this.Player2.X);
      this.Player1.Socket.emit('enemyX', this.Player2.X);
    });


    this.Player1.Socket.on('preciseMove', (x) => {
      this.Player1.X = x;
      this.Player1.Socket.emit('meX', this.Player1.X);
      this.Player2.Socket.emit('enemyX', this.Player1.X);
    });

    this.Player2.Socket.on('preciseMove', (x) => {
      this.Player2.X = x;

      this.Player2.Socket.emit('meX', this.Player2.X);
      this.Player1.Socket.emit('enemyX', this.Player2.X);
    });


    this.Player1.Socket.on('reset', () => {
      this.Player1.WantsReset = true;
      this.reset();
    });

    this.Player2.Socket.on('reset', () => {
      this.Player2.WantsReset = true;
      this.reset();
    })

  }

  movePlayer(player, isLeft) {
    let JumpsPerMove = player.JumpsPerMove;
    for (let i = 0; i < JumpsPerMove; i++) {
      if (!this.isTouchingBall(player)) {
        isLeft ? player.X -= player.JumpSize : player.X += player.JumpSize;
        this.playerCollissionCheck(this.Player1);
        this.playerCollissionCheck(this.Player2);
      }

    }
  }

  // prepare() {
  //   this.givePlayersValues();
  //   this._ball = new BallDegrees();

  //   if (this.Player1 != null) {
  //     console.log(this.Player1.X, this.Player1.Y, this.Player1.W);
  //     this.Player1.Socket.emit('meInit', this.Player1.X, this.Player1.Y, Player.W, Player.H);
  //     if (this.Player2 != null)
  //       this.Player1.Socket.emit('enemyInit', this.Player2.X, this.Player2.Y, Player.W, Player.H);
  //     this.Player1.Socket.emit('ballInit', this._ball.X, this._ball.Y, this._ball.R);
  //   }

  //   if (this.Player2 != null) {
  //     this.Player2.Socket.emit('meInit', this.Player2.X, this.Player2.Y, Player.W, Player.H);
  //     if (this.Player1 != null)
  //       this.Player2.Socket.emit('enemyInit', this.Player1.X, this.Player1.Y, Player.W, Player.H);
  //     this.Player2.Socket.emit('ballInit', this._ball.X, this._ball.Y, this._ball.R);
  //   }

  //   this.initPingReplies();

  //   if (this.isFull()) {
  //     this.canStart = true;
  //     this.receiveMessages();
  //   }

  // }

  isFull() {
    return this.Player1 != null && this.Player2 != null;
  }

  addPlayer(player) {
    if (!this.isFull()) {
      this.Player1 == null ? this.Player1 = player : this.Player2 = player;
    }
  }

  set Player1(value) {
    this._player1 = value;
  }

  set Player2(value) {
    this._player2 = value;
  }

  get Player1() {
    return this._player1;
  }

  get Player2() {
    return this._player2;
  }

  givePlayersValues() {
    if (this.Player1 != null) {
      this.Player1.X = Canvas.W / 2 - Player.W;
      this.Player1.Y = 20;
    }

    if (this.Player2 != null) {
      this.Player2.X = Canvas.W / 2 - Player.W;
      this.Player2.Y = Canvas.H - Player.H - 20;
    }
  }

  playTick() {
    if (this.Player1 != null && this.Player2 != null) {
      if (this.Player1.IsPresent && this.Player2.IsPresent) {
        if (this.canStart) {

          for (let i = 0; i < this._ball.JumpsPerMove; i++) {
            this._ball.move();
            this.boarderCollissionCheck();
            this.playerCollissionCheck(this.Player1);
            this.playerCollissionCheck(this.Player2);
            this.sendBallLocation();
          }

        }

      }
    }
  }

  afkTick() {
    this.trackConnections();
  }



  boarderCollissionCheck() {
    if (this._ball.Y - this._ball.R <= 0 ||
      this._ball.Y + this._ball.R >= Canvas.H) {
      this._ball.bounceVertically();
    }
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
    this.Player1.Socket.emit('ball', this._ball.X, this._ball.Y);
    this.Player2.Socket.emit('ball', this._ball.X, this._ball.Y);
  }


  gameover(winner = null, loser = null) {
    if (winner != null)
      winner.Socket.emit('gameover', 'win');

    if (loser != null)
      loser.Socket.emit('gameover', 'loss');
    this.canStart = false;
  }

  reset() {
    if (this.Player1.WantsReset && this.Player2.WantsReset) {
      this.Player1.WantsReset = false;
      this.Player2.WantsReset = false;
      this.prepare();
    }
  }

  initPingReplies() {
    if (this.Player1 != null) {
      this.Player1.Socket.on('pingReply', () => {
        this.handlePingReply(this.Player1);
      });
    }

    if (this.Player2 != null) {
      this.Player2.Socket.on('pingReply', () => {
        this.handlePingReply(this.Player2);
      });
    }
  }

  trackConnections() {
    if (this.Player1 != null) {
      this.Player1.TimeWithoutResponse++;

      if (this.Player1.TimeWithoutResponse >= 3) {
        this.Player1.IsPresent = false;
        this.handleDisconnection(this.Player1, this.Player2);
      }
    }

    if (this.Player2 != null) {
      this.Player2.TimeWithoutResponse++;

      if (this.Player2.TimeWithoutResponse >= 3) {
        this.Player2.IsPresent = false;
        this.handleDisconnection(this.Player2, this.Player1); //2 = afker
      }

    }

    this.sendPing();
  }

  sendPing() {
    if (this.Player1 != null)
      this.Player1.Socket.emit('ping');

    if (this.Player2 != null)
      this.Player2.Socket.emit('ping');
  }

  handlePingReply(p) {
    p.TimeWithoutResponse = 0;
  }

  handleDisconnection(pAfk, pLeftOver) {
    if (!this._canBeDeleted) {
      console.log('Game is over due to afk');
      this.gameover(pLeftOver, pAfk);
      this._canBeDeleted = true;
    }
  }


}


module.exports = Game;