class Player {
  constructor(socket) {
    this._socket = socket;
    this._id = undefined;
    this._x = undefined;
    this._y = undefined;
    this._isPresent = true;
    this._hasJoined = true;
    this._timeWithoutResponse = 0;
    this._wins = 0;
    this._losses = 0;
    this._wantsReset = false;
  }

  static get H() {
    // return 100;
    return 40;
  }

  static get W() {
    return 400;
  }

  get Socket() { return this._socket; }
  get Id() { return this._id; }
  get IsPresent() { return this._isPresent; }
  get HasJoined() { return this._hasJoined; }
  get TimeWithoutResponse() { return this._timeWithoutResponse; }
  get Wins() { return this._wins; }
  get Losses() { return this._losses; }
  get WantsReset() { return this._wantsReset; }
  get JumpsPerMove() { return 50; }
  get JumpSize() {return 0.5}
  get X() { return this._x; }
  get Y() { return this._y; }

  set Socket(value) { this._socket = value; }
  set Id(value) { this._id = value; }
  set IsPresent(value) { this._isPresent = value; }
  set HasJoined(value) { this._hasJoined = value; }
  set TimeWithoutResponse(value) { this._timeWithoutResponse = value; }
  set Wins(value) { this._wins = value; }
  set Losses(value) { this._losses = value; }
  set WantsReset(value) { this._wantsReset = value }

  set X(value) { this._x = value; }
  set Y(value) { this._y = value; }

}

module.exports = Player;
