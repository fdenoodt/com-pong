//projected started by typing:
//node init (this made package.json file)
//npm install express --save

console.log("running..");
let express = require('express');
let app = express();
let server = app.listen(3000);
app.use(express.static('public'));

let socket = require('socket.io');
let io = socket(server);
io.sockets.on('connection', newConnection);

const Game = require('./scripts/game.js');
const Player = require('./scripts/player.js');

let lsGames = [];
let lsSocketsInQueue = [];
function newConnection(socket) {
  function addPersonToQueue() {
    lsSocketsInQueue.push(socket);
    matchSockets();
  }

  socket.on('findGame', addPersonToQueue);
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

    if (lsGames[i].canBeDeleted) {
      lsGames.splice(i, 1);
      console.log('Game deleted');
    }
  }
}


let ticks = 0;
const timer = setInterval(timerTick, 6);