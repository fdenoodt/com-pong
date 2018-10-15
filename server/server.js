//projected started by typing:
//node init (this made package.json file)
//npm install express --save
//npm i firebase

console.log("running..");
let express = require('express');
let app = express();
let server = app.listen(3000);
app.use(express.static('public'));

const mysql = require('mysql');
const bcrypt = require('bcrypt');
const socket = require('socket.io');
const io = socket(server);
const Game = require('./scripts/game.js');
const Player = require('./scripts/player.js');

let con = mysql.createConnection({
  host: 'localhost',
  user: "root",
  password: "",
  database: "world_of_pong"
})

con.connect(function (err) {
  if (err) throw err;
});

io.sockets.on('connection', newConnection);

let lsGames = [];
let lsSocketsInQueue = [];
const activeUsers = [];

function newConnection(socket) {

  function addPersonToQueue() {
    lsSocketsInQueue.push(socket);
    matchSockets();
  }

  socket.on('findGame', addPersonToQueue);
  socket.on('register', (...data) => {
    register(socket, ...data);
  })

  socket.on('login', (email, password) => {
    loginWithEmailAndPassword(socket, email, password);
  })

}


function register(socket, email, username, password) {
  let registerResponse = "Something went wrong.";
  if (validateInputs()) {
    const saltRounds = 10;
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) throw err;

      bcrypt.hash(password, salt, function (err, hash) {
        if (err) throw err;

        const wins = 0;
        const losses = 0;
        const rankingpoints = 0;
        const sql = `insert into users values(null, '${email}', '${hash}', '${username}', ${wins}, ${losses}, ${rankingpoints})`;
        con.query(sql, function (err, result) {
          if (err)
            socket.emit('registrationResponse', { isSuccessful: false, message: err.message });


          console.log('user added');
          socket.emit('registrationResponse', { isSuccessful: true });
        })
      });
    });
  }
  else {
    registerResponse = "Incorrect username, email or password.";
    socket.emit('registrationResponse', { isSuccessful: false, message: registerResponse });
  }

  function validateInputs() {
    return username.length >= 0 && validateEmail(email) && password.length >= 8 ? true : false;
  }

  //method from: https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
  function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
}

function loginWithEmailAndPassword(socket, email, password) {
  auth.signInWithEmailAndPassword(email, password)
    .then((res) => {
      console.log('logged in from login');
      const user = res.user;
      handleLogin(socket, user);
      socket.emit('loginResponse', { isSuccessful: true, userData: user });
    })
    .catch((ex) => {
      console.log(ex.message)
      socket.emit('loginResponse', { isSuccessful: false });
    });
}

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