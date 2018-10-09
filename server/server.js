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


const Game = require('./scripts/game.js');
const Player = require('./scripts/player.js');




io.sockets.on('connection', newConnection);

let lsGames = [];

function newConnection(socket) {
  console.log("new player joined");
  

  socket.on('init', init);

  function init() {
    console.log('testtttt')
    let player = new Player(socket);

    for (const game of lsGames) {

      if (!game.isFull()) {
        console.log('adding player');
        game.addPlayer(player);
        game.prepare();
        return;
      }
    }

    console.log('creating new game');
    lsGames.push(new Game(player));
    lsGames[lsGames.length - 1].prepare();
  }


}

const timerTick = () => {
  ticks++;

  for (let i = lsGames.length - 1; i >= 0; i--) {
    lsGames[i].playTick();

    if (ticks % 300 == 0) {
      lsGames[i].afkTick();
    }

    if (lsGames[i].canBeDeleted) {
      lsGames.splice(i, 1);
      console.log('Game deleted');
    }
  }
}


let ticks = 0;
const timer = setInterval(timerTick, 4);