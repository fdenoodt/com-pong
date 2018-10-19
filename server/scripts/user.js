const UserGameState = require('./userGameState.js');


class User {
  constructor(userManager, gameManager, socket, id, email, username, wins, losses, rankingpoints) {
    this.UserManager = userManager;
    this.GameManager = gameManager;
    this.Socket = socket;
    this.Id = id;
    this.Username = username;
    this.Email = email;
    this.Losses = losses;
    this.Wins = wins;
    this.Rankingpoints = rankingpoints;
    this.TimeWithoutResponse = 0;

    this.UserGameState = null;

    this.Socket.on('pingReply', () => {
      this.UserManager.handlePingReply(this);
    });

    this.Socket.on('findGame', () => {
      this.GameManager.addUserToQueue(this);
    })

    this.Socket.on('requestLogOut', () => {
      this.UserManager.handleLogout(this);
    })

    this.Socket.on('cancelQueue', () => {
      this.GameManager.removeUserFromQueue(this);
    })

  }

  get UserGameState() {
    return this._userGameState;
  }
  get UserManager() {
    return this._userManager;
  }
  get GameManager() {
    return this._gameManager;
  }
  get TimeWithoutResponse() {
    return this._timeWithoutResponse;
  }
  get Id() {
    return this._id;
  }
  get Username() {
    return this._username;
  }
  get Email() {
    return this._email;
  }
  get Losses() {
    return this._losses;
  }
  get Wins() {
    return this._wins;
  }
  get Rankingpoints() {
    return this._rankingpoints;
  }
  get Socket() {
    return this._socket;
  }
  get InGameState() {
    return this._inGameState;
  }

  set Id(value) {
    this._id = value;
  }
  set Username(value) {
    this._username = value;
  }
  set Email(value) {
    this._email = value;
  }
  set Losses(value) {
    this._losses = value;
  }
  set Wins(value) {
    this._wins = value;
  }
  set Rankingpoints(value) {
    this._rankingpoints = value;
  }
  set Socket(value) {
    this._socket = value;
  }
  set TimeWithoutResponse(value) {
    this._timeWithoutResponse = value;
  }
  set UserManager(value) {
    this._userManager = value;
  }
  set GameManager(value) {
    this._gameManager = value;
  }
  set InGameState(value) {
    this._inGameState = value;
  }
  set UserGameState(value) {
    this._userGameState = value;
  }

}

module.exports = User;
