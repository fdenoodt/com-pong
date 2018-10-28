class User {
  constructor(username, wins, losses, rankingpoints) {
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