//projected started by typing:
//node init (this made package.json file)
//npm install express --save
//npm i firebase

console.log("running..");
let express = require('express');
let app = express();
let server = app.listen(3000);
app.use(express.static('public'));

let socket = require('socket.io');
let io = socket(server);

const Game = require('./scripts/game.js');
const Player = require('./scripts/player.js');


var firebase = require('firebase');

var config = {
  apiKey: "AIzaSyBuFsDmKYvJs9BSRVeUf-gGwELCkNstae0",
  authDomain: "world-of-pong.firebaseapp.com",
  databaseURL: "https://world-of-pong.firebaseio.com",
  projectId: "world-of-pong",
  storageBucket: "world-of-pong.appspot.com",
  messagingSenderId: "197805907925"
};

firebase.initializeApp(config);
let database = firebase.database();

// var firebaseapp = firebase.initializeApp({
//   apiKey: "AIzaSyBuFsDmKYvJs9BSRVeUf-gGwELCkNstae0",
//   authDomain: "world-of-pong.firebaseapp.com",
//   databaseURL: "https://world-of-pong.firebaseio.com",
//   projectId: "world-of-pong",
//   storageBucket: "world-of-pong.appspot.com",
//   messagingSenderId: "197805907925"
// });

// var database = firebaseapp.database();


io.sockets.on('connection', newConnection);



let lsGames = [];
let lsSocketsInQueue = [];
function newConnection(socket) {

  function addPersonToQueue() {
    lsSocketsInQueue.push(socket);
    matchSockets();
  }

  socket.on('findGame', addPersonToQueue);
  socket.on('register', register)
}




function register(data) {
  // console.log(data);
  let userDatabase = database.ref('users');
  let user = userDatabase.push(data, finished);
  console.log("firebase generated key: " + user.key);

  function finished(err) {
    if (err)
      console.error("error: " + err)
    else {
      console.log("data saved");

    }
  }
}







const timerTick = () => {
  ticks++;
  manageGames();
}

const matchSockets = () => {
  const queueCount = lsSocketsInQueue.length;
  if (queueCount > 1) {
    for (let i = queueCount - 1; i > 0; i -= 2) {
      const duo = [lsSocketsInQueue[i], lsSocketsInQueue[i - 1]]
      createGame(duo);
      lsSocketsInQueue.splice(i, 1);
      lsSocketsInQueue.splice(i - 1, 1);
    }
  }
}

const createGame = (duo) => {
  lsGames.push(new Game(duo));
  console.log('creating game');

}

const manageGames = () => {
  for (let i = lsGames.length - 1; i >= 0; i--) {
    lsGames[i].playTick();

    if (ticks % 100 == 0) {
      lsGames[i].afkTick();
    }

    if (lsGames[i].IsOver) {
      lsGames.splice(i, 1);
      // Game deleted'
    }
  }
}


let ticks = 0;
const timer = setInterval(timerTick, 6);