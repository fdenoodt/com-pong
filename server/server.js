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
const auth = firebase.auth();
let fireDB = firebase.database();

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
    // register(socket, ...data);
    registerWithEmailAndPassword(socket, ...data);
  })

  socket.on('login', (email, password) => {
    loginWithEmailAndPassword(socket, email, password);
  })
}

firebase.auth().onAuthStateChanged(firebaseUser => {
  if (firebaseUser)
    console.log('logged in');
  else
    console.log('not logged in');
})

function registerWithEmailAndPassword(socket, email, username, password) {
  const promise = auth.createUserWithEmailAndPassword(email, password);
  promise.then(function (res) {
    const newUser = res.user;
    handleLogin(socket, newUser);
    activeUsers.push({ user: newUser, socket: socket });
    fireDB.ref('users/' + newUser.uid).set({
      username: username,
      wins: 0,
      losses: 0,
      rankingPoings: 100
    })
      .then(() => {
        socket.emit('registrationResponse', { isSuccessful: true, message: 'Registration successful' });
      })
      .catch((ex) => {
        console.log(ex.message);
        socket.emit('registrationResponse', { isSuccessful: false, message: ex.message });
      })
  })

  promise.catch(function (ex) {
    console.log(ex.message);
    socket.emit('registrationResponse', { isSuccessful: false, message: ex.message });
  });
}

function loginWithEmailAndPassword(socket, email, password) {
  auth.signInWithEmailAndPassword(email, password)
    .then((res) => {
      const user = res.user;
      handleLogin(socket, user);
      socket.emit('loginResponse', { isSuccessful: true, token: null });
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




// function register(socket, email, username, password) {
//   let registerResponse = "Something went wrong.";
//   if (validateInputs()) {
//     const saltRounds = 10;
//     bcrypt.genSalt(saltRounds, function (err, salt) {
//       bcrypt.hash(password, salt, function (err, hash) {
//         let userDatabase = database.ref('users');
//         const data = { email, username, hash };
//         let user = userDatabase.push(data, finished);

//         function finished(err) {
//           if (err) {
//             console.error("error: " + err);
//             registerResponse = "Registration failed, try again later.";
//           }
//           else {
//             console.log("data saved");
//             registerResponse = "Registration succeeded.";
//           }
//           socket.emit('registrationResponse', registerResponse);
//         }
//       });
//     });
//   }
//   else {
//     registerResponse = "Incorrect username, email or password.";
//     socket.emit('registrationResponse', registerResponse);
//   }

//   function validateInputs() {
//     return username.length >= 0 && validateEmail(email) && password.length >= 8 ? true : false;
//   }

//   //method from: https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
//   function validateEmail(email) {
//     var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//     return re.test(String(email).toLowerCase());
//   }
// }







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