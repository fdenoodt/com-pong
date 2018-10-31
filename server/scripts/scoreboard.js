class Scoreboard {

  constructor(dataManager) {
    this._dataManager = dataManager;
  }

  getHighScores() {
    const that = this;
    const sql = `
    select username, wins, losses from users 
    order by wins desc
    limit 3`;

    return that._dataManager.retreive(sql)
      .then((result) => {
        return { isSuccessful: true, result };
      })
      .catch((err) => {
        console.log(err);
        return { isSuccessful: false };
      })


  }

}

module.exports = Scoreboard;
