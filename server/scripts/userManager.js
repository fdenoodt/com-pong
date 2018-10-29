const User = require('./user.js');
const MainSript = require('../server.js');
const bcrypt = require('bcrypt');
const con = require('./con.js')

class UserManager {
  constructor(gameManager, dataManager) {
    this._gameManager = gameManager;
    this._dataManager = dataManager;
    this._users = [];
  }

  get Users() {
    return this._users;
  }

  register(socket, username, thePw) {
    const that = this;
    const saltRounds = 10;

    let registerResponse = "Something went wrong.";
    if (validateInputs()) {
      bcrypt.hash(thePw, saltRounds, function (err, theHash) {
        if (err) {
          socket.emit('registrationResponse', { isSuccessful: false, message: registerResponse });
        }
        else {
          const wins = 0;
          const losses = 0;
          const rankingpoints = 0;
          const sql = `insert into users values(null, '${theHash}', '${username}', ${wins}, ${losses}, ${rankingpoints})`;

          that._dataManager.retreive(sql)
            .then((res) => {
              let registerRes = { isSuccessful: true, message: 'Registration successful' };
              socket.emit('registrationResponse', registerRes);
            })
            .catch((error) => {
              if (error.code == 'ER_DUP_ENTRY')
                registerResponse = 'Username already in use.'

              socket.emit('registrationResponse',
                {
                  isSuccessful: false,
                  message: registerResponse
                });
            })
        }
      });
    }
    else {
      registerResponse = "Incorrect username or password.";
      socket.emit('registrationResponse', { isSuccessful: false, message: registerResponse });
    }

    function validateInputs() {
      return username.length >= 0 && thePw.length >= 8 ? true : false;
    }
  }

  login(socket, username, thePw) {
    let loginResponse = "";
    const that = this;
    const sql = `select * from users where username='${username}'`;
    con.query(sql, function (err, result) {
      if (err) {
        console.log(err, result);
        loginResponse = "Something went wrong trying to log in... Try again later.";
        socket.emit('loginResponse', { isSuccessful: false, message: loginResponse });
      }
      else if (result.length <= 0) {
        loginResponse = "Incorrect username or password.";
        socket.emit('loginResponse', { isSuccessful: false, message: loginResponse });
      }
      else {
        const row = result[0];
        const id = row.id;
        const username = row.username;
        const wins = row.wins;
        const losses = row.losses;
        const rankingpoints = row.rankingpoints;
        const theHash = row.password;

        bcrypt.compare(thePw, theHash, function (err, res) {
          if (err) {
            loginResponse = "Something went wrong, try again.";
          }
          else {
            if (res) {
              loginResponse = `Welcome ${username}!`;
              const newUser = new User(that, that._gameManager, socket, id, username, wins, losses, rankingpoints);
              const potentiallyAlreadyLoggedInUser = that.searchUserByUserName(newUser.Username);
              if (potentiallyAlreadyLoggedInUser != undefined) {
                that.handleLogout(potentiallyAlreadyLoggedInUser);
              }
              that._users.push(newUser);
            }
            else {
              loginResponse = "Incorrect username or password.";
            }
            const userData = res ? { username, wins, losses, rankingpoints } : null;
            socket.emit('loginResponse', { isSuccessful: res, message: loginResponse, userData });
          }
        });
      }
    });
  }

  searchUserByUserName(username) {
    for (const u of this._users) {
      if (u.Username == username) {
        return u;
      }
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

  handleLogout(u) {
    this._gameManager.removeUserFromQueue(u);
    u.Socket.emit('logOutResponse');
    const index = this._users.indexOf(u);
    this._users.splice(index, 1);
  }

  handlePingReply(p) {
    p.TimeWithoutResponse = 0;
  }
}

module.exports = UserManager;
