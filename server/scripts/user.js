class User {
  constructor(socket, id, email, username, wins, losses, rankingpoints) {
    this._socket = socket;
    this._id = id;
    this._username = username;
    this._email = email;
    this._losses = losses;
    this._wins = wins;
    this._rankingpoints = rankingpoints;
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

}

module.exports = User;
