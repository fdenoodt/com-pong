class Canvas {
  constructor(pl) {
    this._canvas = document.querySelector('#soloCanvas');
    this._context = this._canvas.getContext('2d');
    this.player = pl;
  }


  updateScreen(player, ball) {
    this._context.clearRect(0, 0, Canvas.W, Canvas.H);
    this.updatePlayer(player);
    this.updateBall(ball);
  }

  updateBall(ball) {
    this._context.beginPath();
    this._context.arc(ball.X, ball.Y, MovingBall.R, 0, 2 * Math.PI);
    this._context.lineWidth = 1;
    this._context.strokeStyle = `rgb(${Ball.RColor},${Ball.GColor},${Ball.BColor})`;
    this._context.stroke();
    this._context.fillStyle = `rgb(${Ball.RColor},${Ball.GColor},${Ball.BColor})`;
    this._context.fill();
  }

  updatePlayer(player) {
    this._context.beginPath();
    this._context.rect(player.x, player.y, Rect.W, Rect.H);

    this._context.lineWidth = 3;

    this._context.strokeStyle = `gray`;
    this._context.stroke();

    this._context.fillStyle = 'rgb(100, 255, 200)';
    this._context.fill();
  }

  // updateGenerationCount(count) {
  //   this._context.font = "30px Arial";
  //   this._context.fillStyle = "black";
  //   this._context.fillText(count, 10, 50);
  // }

  static get W() {
    return 1500;
  }

  static get H() {
    return 2500;
  }

}