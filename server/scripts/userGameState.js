class UserGameState {
  constructor() {
    this._x = null;
    this._y = null;
  }

  static get H() {
    return 40;
  }

  static get W() {
    return 400;
  }

  static get JumpsPerMove() { return 50; }
  static get JumpSize() { return 0.5 }

  get X() { return this._x; }
  get Y() { return this._y; }

  set X(value) { this._x = value; }
  set Y(value) { this._y = value; }

}

module.exports = UserGameState;
