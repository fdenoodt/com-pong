const con = require('./con.js')

class DataManager {


  //code from: https://codeburst.io/node-js-mysql-and-promises-4c3be599909b
  retreive(sql) {
    return new Promise((resolve, reject) => {
      con.query(sql, (err, result) => {
        if (err)
          return reject(err);
        resolve(result);
      });
    });
  }

}

module.exports = DataManager;
