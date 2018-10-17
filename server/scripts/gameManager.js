const User = require('./user.js');

class GameManager {
  constructor() {
    this._lsGames = [];
    this._lsSocketsInQueue = [];
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
    lsGames.push(new Game(duo));
    console.log('creating game');
  }

  addPersonToQueue() {
    this._lsSocketsInQueue.push(socket);
    matchSockets();
  }

  matchSockets() {
    const queueCount = this._lsSocketsInQueue.length;
    if (queueCount > 1) {
      for (let i = queueCount - 1; i > 0; i -= 2) {
        const duo = [this._lsSocketsInQueue[i], this._lsSocketsInQueue[i - 1]]
        createGame(duo);
        this._lsSocketsInQueue.splice(i, 1);
        this._lsSocketsInQueue.splice(i - 1, 1);
      }
    }
  }

}
module.exports = GameManager;

