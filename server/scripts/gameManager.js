const User = require('./user.js');
const Game = require('./game.js');
const Player = require('./player.js');

class GameManager {
  constructor() {
    this._lsGames = [];
    this._lsUsersInQueue = [];
  }

  manageGames() {
    for (let i = this._lsGames.length - 1; i >= 0; i--) {
      this._lsGames[i].playTick();

      if (this._lsGames[i].IsOver) {
        this._lsGames.splice(i, 1); // Game deleted
      }
    }
  }

  createGame(duo) {
    this._lsGames.push(new Game(duo));
  }

  addUserToQueue(user) {
    if (!this._lsUsersInQueue.includes(user)) {
      console.log('adding user');
      
      this._lsUsersInQueue.push(user);
      this.matchUsers();
    }
  }

  removeUserFromQueue(user) {
    const index = this._lsUsersInQueue.indexOf(user);
    this._lsUsersInQueue.splice(index, 1);
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

