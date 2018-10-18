const User = require('./user.js');
const Game = require('./game.js');
const Player = require('./player.js');

class GameManager {
  constructor() {
    this._lsGames = [];
    // this._lsUsersInGame = [];
    this._lsUsersInQueue = [];
  }

  manageGames() {
    for (let i = this._lsGames.length - 1; i >= 0; i--) {
      this._lsGames[i].playTick();

      if (ticks % 100 == 0) {
        this._lsGames[i].afkTick();
      }

      if (this._lsGames[i].IsOver) {
        this._lsGames.splice(i, 1); // Game deleted
      }
    }
  }

  createGame(duo) {
    this._lsGames.push(new Game(duo));
    console.log('creating game');
  }

  addUserToQueue(user) {
    console.log('user added to queue');
    this._lsUsersInQueue.push(user);
    this.matchUsers();
  }

  matchUsers() {
    const queueCount = this._lsUsersInQueue.length;
    if (queueCount > 1) {
      for (let i = queueCount - 1; i > 0; i -= 2) {
        const duo = [this._lsUsersInQueue[i], this._lsUsersInQueue[i - 1]]
        this.createGame(duo);
        this._lsUsersInQueue.splice(i, 1);
        this._lsUsersInQueue.splice(i - 1, 1);
      }
    }
  }

}
module.exports = GameManager;

