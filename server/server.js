//projected started by typing:
//node init (this made package.json file)
//npm install express --save

console.log("running..");
let express = require('express');
let app = express();
let server = app.listen(3000);
app.use(express.static('public'));

const socket = require('socket.io');
const io = socket(server);
const Game = require('./scripts/game.js');
const Player = require('./scripts/player.js');
const GameManager = require('./scripts/gameManager.js');
const UserManager = require('./scripts/userManager.js');
const User = require('./scripts/user.js');

const userManager = new UserManager();
const gameManager = new GameManager();


io.sockets.on('connection', newConnection);

let lsGames = [];
let lsSocketsInQueue = [];

function newConnection(socket) {

  function addPersonToQueue() {
    lsSocketsInQueue.push(socket);
    matchSockets();
  }

  //TODO: FIND GAME TEMP DISABLED BECAUSE THE LOGIN MUST WORK FIRST
  // socket.on('findGame', () => {
  //   gameManager.addPersonToQueue(socke)
  // });

  socket.on('register', (...data) => {
    userManager.register(socket, ...data);
  })

  socket.on('login', (email, password) => {
    userManager.login(socket, email, password);
  })

}

// socket.emit('loginResponse', { isSuccessful: true, userData: user });
// socket.emit('loginResponse', { isSuccessful: false });


//TODO: this method should exist, but the loginResponse and registerResponse should be deleted
function handleLogin(socket, user) {
  activeUsers.push({ socket, user })
  socket.emit('accountStateChange', true);
}

//to log out: firebase.auth().signOut();

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