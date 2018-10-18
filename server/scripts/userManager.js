const User = require('./user.js');
const MainSript = require('../server.js');
const bcrypt = require('bcrypt');
const con = require('./con.js')

// const gameManager = MainSript.gameManager;

class UserManager {
  constructor(gameManager) {
    this._gameManager = gameManager;
    this._users = [];
    this._saltRounds = 10;
  }

  get Users() {
    return this._users;
  }

  register(socket, email, username, thePw) {
    const saltRounds = 10;

    let registerResponse = "Something went wrong.";
    if (validateInputs() && this.validateEmail(email)) {
      console.log(thePw + ' testing purpose of getting pw');
      // bcrypt.hash(thePw, saltRounds, function (err, theHash) {
      const wins = 0;
      const losses = 0;
      const rankingpoints = 0;
      const sql = `insert into users values(null, '${email}', '${thePw}', '${username}', ${wins}, ${losses}, ${rankingpoints})`;
      con.query(sql, function (err, result) {
        let registerRes = { isSuccessful: true, message: 'Registration successful' };
        if (err)
          registerRes = { isSuccessful: false, message: err.message }

        if (result == undefined)
          registerRes = { isSuccessful: false, message: 'Email or username already in use' }

        socket.emit('registrationResponse', registerRes);
      })
      // });
    }
    else {
      registerResponse = "Incorrect username, email or password.";
      socket.emit('registrationResponse', { isSuccessful: false, message: registerResponse });
    }

    function validateInputs() {
      return username.length >= 0 && thePw.length >= 8 ? true : false;
    }
  }

  //method from: https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
  validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  login(socket, email, thePw) {
    let loginResponse = "";
    const that = this;
    if (!this.validateEmail(email)) {
      loginResponse = "Incorrect email or password.";
      socket.emit('loginResponse', { isSuccessful: false, message: loginResponse });
    }
    else {
      const sql = `select * from users where email='${email}'`;
      con.query(sql, function (err, result) {
        if (err) {
          console.log(err, result);
          loginResponse = "Something went wrong trying to log in... Try again later.";
          socket.emit('loginResponse', { isSuccessful: false, message: loginResponse });
        }
        else if (result.length <= 0) {
          loginResponse = "Incorrect email or password.";
          socket.emit('loginResponse', { isSuccessful: false, message: loginResponse });
        }
        else {
          const row = result[0];
          const id = row.id;
          const email = row.email;
          const username = row.username;
          const wins = row.wins;
          const losses = row.losses;
          const rankingpoints = row.ranking_points; //TODO: FIX RANKING POINTS IN DB
          const thehash = row.password;

          // setTimeout(() => {
          //   bcrypt.compare(thePw, thehash, function (err, res) {
          //     // res == true
          //     console.log(res, ' fhcjk;ldas');
          //   });
          // }, 5000)


          const res = thehash == thePw;
          loginResponse = res ? `Welcome ${username}!` : "Incorrect email or password.";
          const userData = res ? { email, username, wins, losses, rankingpoints } : null;
          socket.emit('loginResponse', { isSuccessful: res, message: loginResponse, userData });


          const newUser = new User(that, that._gameManager, socket, id, email, username, wins, losses, rankingpoints);
          that._users.push(newUser);

        }
      });
    }
  }

  manageUsers() {
    this.trackConnections();
  }


  trackConnections() {

    if (this._users.length <= 0) {
      return;
    }

    for (let i = this._users.length - 1; i >= 0; i--) {
      const p = this._users[i];
      p.TimeWithoutResponse++;
      this.sendPing(p);
      if (p.TimeWithoutResponse > 2) {
        this._users.splice(i, 1);
      }
    }
  }

  sendPing(p) {
    p.Socket.emit('ping');
  }

  // handleLogout(u) {
  //   const index = this._users.indexOf(u)
  //   this._users.splice(index, 1);
  // }

  handlePingReply(p) {
    p.TimeWithoutResponse = 0;
  }
}

module.exports = UserManager;
