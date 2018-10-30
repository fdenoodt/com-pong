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
const DataManager = require('./scripts/dataManager.js');
const GameManager = require('./scripts/gameManager.js');
const UserManager = require('./scripts/userManager.js');
const User = require('./scripts/user.js');
const Scoreboard = require('./scripts/scoreboard.js')

const dataManager = new DataManager();
const scoreboard = new Scoreboard(dataManager);
const gameManager = new GameManager(dataManager);
const userManager = new UserManager(gameManager, dataManager, scoreboard);

io.sockets.on('connection', newConnection);

function newConnection(socket) {

  socket.on('register', (...data) => {
    userManager.register(socket, ...data);
  })

  socket.on('login', (username, password) => {
    userManager.login(socket, username, password);
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
