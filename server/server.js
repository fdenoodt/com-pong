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

function newConnection(socket) {
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

const timerTick = () => {
  ticks++;
  if (ticks % 1000 == 0)
    userManager.manageUsers();
    gameManager.manageGames();
}

let ticks = 0;
const timer = setInterval(timerTick, 6);