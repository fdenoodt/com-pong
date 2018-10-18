class UserGameState extends User {
  constructor() {
    this._x = undefined;
    this._y = undefined;
  }

  static get H() {
    return 40;
  }

  static get W() {
    return 400;
  }

  get X() { return this._x; }
  get Y() { return this._y; }

  set X(value) { this._x = value; }
  set Y(value) { this._y = value; }

}

module.exports = UserGameState;
