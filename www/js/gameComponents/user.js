class User {
  constructor(email, username, wins, losses, rankingpoints) {
    this._email = email;
    this._username = username;
    this._wins = wins;
    this._losses = losses;
    this._rankingpoints = rankingpoints;
  }

  get Username() {
    return this._username;
  }
  get Wins() {
    return this._wins;
  }
  get Losses() {
    return this._losses;
  }

  get Rankingpoints() {
    return this._rankingpoints;
  }
  get Email() {
    return this._email;
  }

  set Wins(value) {
    this._wins = value;
  }
  set Losses(value) {
    this._losses = value;
  }

  set Rankingpoints(value) {
    this._rankingpoints = value;
  }

}