class Scoreboard {

  constructor(dataManger) {
    this._dataManager = dataManger;
  }

  getScore() {
    const sql = `select username, wins, losses from users order by num wins first 3 rows only;`
    dataManger.retreive(sql);
  }

}

module.exports = Scoreboard;
