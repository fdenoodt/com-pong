let canvas;
let context;
let cw;
let ch;

let me;
let enemy;
let ball;
let lsBalls = [];

const initMulti = () => {
  socket.emit('isReady');
}


canvas = document.getElementById('myCanvas');
context = canvas.getContext('2d');
cw = canvas.width;
ch = canvas.height;

me = new Rect();
enemy = new Rect();
ball = new Ball();

const updateCanvas = () => {

  if (context == undefined)
    return;

  context.clearRect(0, 0, cw, ch);


  drawPlayer(me);
  drawPlayer(enemy);
  drawBall();
}

const drawPlayer = (player) => {
  if (player != undefined) {
    context.beginPath();
    context.rect(player.X, player.Y, Rect.W, Rect.H);

    context.lineWidth = 3;

    context.fillStyle = 'rgb(255, 255, 255)';
    context.fill();
  }

}

const drawBall = () => {
  if (ball.X != undefined && ball.Y != undefined) {
    context.beginPath();
    context.arc(ball.X, ball.Y, ball.R, 0, 2 * Math.PI);
    context.lineWidth = 1;
    context.strokeStyle = `rgb(${Ball.RColor},${Ball.GColor},${Ball.BColor})`;
    context.stroke();
    context.fillStyle = `rgb(${Ball.RColor},${Ball.GColor},${Ball.BColor})`;
    context.fill();
  }

  let gradient = 0;
  for (const shadowBall of lsBalls) {
    gradient += 0.01;
    context.beginPath();
    context.arc(shadowBall.X, shadowBall.Y, gradient * 20, 0, 2 * Math.PI);
    context.lineWidth = 1;
    context.strokeStyle = `rgba(${Ball.RColor},${Ball.GColor},${Ball.BColor}, ${gradient})`;
    context.stroke();
    context.fillStyle = `rgba(${Ball.RColor},${Ball.GColor},${Ball.BColor}, ${gradient})`;
    context.fill();
  }
}


const initPlayer = (target, x, y, h, w) => {
  target.Y = y;
  Rect.H = h;
  Rect.W = w;
  updatePlayerLocation(target, x);
}

const initBall = (x, y, r) => {
  ball.R = r;
  updateBall(x, y);
}


const updatePlayerLocation = (target, x) => {
  target.X = x;
}

const updateBall = (x, y) => {
  if (ball == undefined)
    return;

  ball.X = x;
  ball.Y = y;
}

const reset = () => {
  document.getElementById('btnReset').style.display = "none";
  socket.emit('reset');
}

const showWarnMessage = (message) => {
  warn('Warning', message)
}

const updateScoreboard = () => {
  warn('Score', `Wins: ${score.wins} \nLosses: ${score.losses}`);
}



window.onkeydown = function (e) {
  let key = e.keyCode ? e.keyCode : e.which;

  if (key == 39) {
    // me.move(false); //right
    right = true;
  } else if (key == 37) {
    // me.move(true); //left
    left = true;
  }
}

window.onkeyup = function (e) {
  let key = e.keyCode ? e.keyCode : e.which;

  if (key == 39) {
    // me.move(false); //right
    right = false;
  } else if (key == 37) {
    // me.move(true); //left
    left = false;
  }
}

let left = false;
let right = false;
const move = () => {
  if (left) {
    me.move(true);
  }
  if (right) {
    me.move(false);
  }
}

let timer = setInterval(move, 20);

socket.on('meInit', (x, y, w, h) => {
  initPlayer(me, x, y, h, w);
  updateCanvas();
});

socket.on('enemyInit', (x, y, w, h) => {
  initPlayer(enemy, x, y, h, w);
  updateCanvas();
});

socket.on('ballInit', (x, y, r) => {
  initBall(x, y, r);
  updateCanvas();
})
let ballCounter = 0;
socket.on('ball', (x, y) => {
  // ballCounter++;
  // if (lsBalls.length <= 50)
  //   lsBalls.push(new Ball(x, y));
  // else {

  //   lsBalls.push(new Ball(x, y));
  //   lsBalls.splice(0, 1);
  // }

  updateBall(x, y);
  updateCanvas();
});


socket.on('meX', (x) => {
  updatePlayerLocation(me, x);
  updateCanvas();
});

socket.on('enemyX', (x) => {
  updatePlayerLocation(enemy, x);
  updateCanvas();
});

socket.on('gameover', (winOrLoss) => {
  warn(winOrLoss == "win" ? "You win!" : "You lose!");
})


socket.on('ping', () => {
  socket.emit('pingReply');
})

socket.on('enemyDisconnected', () => {
  warn('The enemy disconnected, You have won the game.')
})


