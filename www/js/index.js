/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
  // Application Constructor
  initialize: function () {
    document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
  },

  // deviceready Event Handler
  //
  // Bind any cordova events here. Common events are:
  // 'pause', 'resume', etc.
  onDeviceReady: function () {
    this.receivedEvent('deviceready');
  },

  // Update DOM on a Received Event
  receivedEvent: function (id) {
    var parentElement = document.getElementById(id);
    var listeningElement = parentElement.querySelector('.listening');
    var receivedElement = parentElement.querySelector('.received');

    listeningElement.setAttribute('style', 'display:none;');
    receivedElement.setAttribute('style', 'display:block;');
    console.log('Received Event: ' + id);
  }
};
app.initialize();




//Materializercss: make navbar swipe + datepicker on registration
$(document).ready(function () {
  $('.sidenav').sidenav();
  $('.datepicker').datepicker();
  $('.modal').modal();
});


const register = () => {
  const email = document.querySelector('#register_inp_email').value;
  const user = document.querySelector('#register_inp_username').value;
  const password = document.querySelector('#register_inp_password').value;
  const date = document.querySelector('#register_inp_date').value;

  console.log(email, user, password, date);
}


const login = () => {
  const user = document.querySelector('#login_inp_username').value;
  const password = document.querySelector('#login_inp_password').value;
  console.log(user, password);
}


const warn = (title = "", message = "") => {
  document.querySelector('.warnTitle').innerHTML = title;
  document.querySelector('.warnMessage').innerHTML = message;
  $('.modal').modal('open');
}




const socket = io.connect('http://localhost:3000');
let canvas;
let context;
let cw;
let ch;

let me;
let enemy;
let ball;
let lsBalls = [];
let score = {
  wins: 0,
  losses: 0
}

const findGame = () => {
}

const initalizeMultiGame = () => {
  canvas = document.getElementById('myCanvas');
  context = canvas.getContext('2d');
  cw = canvas.width;
  ch = canvas.height;

  me = new Rect();
  enemy = new Rect();
  ball = new Ball();

  socket.emit('init');
}

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

  console.log(target, x, y, h, w)

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


class Figure {
  constructor(x = undefined, y = undefined) {
    this.X = x;
    this.Y = y;
  }

  get X() {
    return this.x;
  }
  get Y() {
    return this.y;
  }

  set X(value) {
    this.x = value;
  }

  set Y(value) {
    this.y = value;
  }
}

class Rect extends Figure {
  constructor(x, y) {
    super(x, y);
  }

  get Id() {
    return this.id;
  }

  set Id(value) {
    this.id = value;
  }

  static set H(value) {
    this.h = value;
  }

  static get H() {
    return this.h;
  }

  static set W(value) {
    this.w = value;
  }

  static get W() {
    return this.w;
  }

  preciseMove(x) {
    socket.emit('preciseMove', x);
  }

  move(isLeft) {
    socket.emit('move', isLeft);
  }
}

class Ball extends Figure {
  constructor(x, y) {
    super(x, y);
  }

  static set R(value) {
    this.r = value;
  }

  static get R() {
    return this.r;
  }

  static get RColor() { return 255 /*230*/ }
  static get GColor() { return 255 /*50*/ }
  static get BColor() { return 255 /*255*/ }

}

const reset = () => {
  document.getElementById('btnReset').style.display = "none";
  socket.emit('reset');
}

const showWarnMessage = (message) => {
  warn('Warning', message)
  // document.getElementById('warning').innerHTML = message;
}
const updateScoreboard = () => {
  warn('Score', `Wins: ${score.wins} \nLosses: ${score.losses}`);
  // document.getElementById('score').innerHTML = `Wins: ${score.wins} \nLosses: ${score.losses}`;
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

// const mouseMove = (evt) => {
//   var rect = canvas.getBoundingClientRect(), // abs. size of element
//     scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for X
//     scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for Y

//   me.preciseMove(((evt.clientX - rect.left) * scaleX) - Rect.W / 2);
// }

// window.addEventListener('mousemove', mouseMove, false);
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
  ballCounter++;
  if (lsBalls.length <= 50)
    lsBalls.push(new Ball(x, y));
  else {

    lsBalls.push(new Ball(x, y));
    lsBalls.splice(0, 1);
  }

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
  winOrLoss == "win" ? score.wins++ : score.losses++;
  updateScoreboard();
  // document.getElementById('btnReset').style.display = 'block';
})


socket.on('ping', () => {
  socket.emit('pingReply');
})

socket.on('enemyDisconnected', () => {
  score.wins++;
  updateScoreboard();
  showWarnMessage('The enemy disconnected, You have won the game.')
})


