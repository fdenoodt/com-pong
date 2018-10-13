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

const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';


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

io.sockets.on('connection', newConnection);



let lsGames = [];
let lsSocketsInQueue = [];
function newConnection(socket) {

  function addPersonToQueue() {
    lsSocketsInQueue.push(socket);
    matchSockets();
  }

  socket.on('findGame', addPersonToQueue);
  socket.on('register', (...data) => {
    register(socket, ...data);
  })
}




function register(socket, email, username, password, date) {
  let registerResponse = "";

  bcrypt.genSalt(saltRounds, function (err, salt) {
    bcrypt.hash(password, salt, function (err, hash) {

      let userDatabase = database.ref('users');
      const data = { email, username, hash, date };
      let user = userDatabase.push(data, finished);

      function finished(err) {
        if (err) {
          console.error("error: " + err);
          registerResponse = "Registration failed, try again later.";
        }
        else {
          console.log("data saved");
          registerResponse = "Registration succeeded.";
        }

        socket.emit('registrationResponse', registerResponse);

      }
    });
  });
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