class User {
  constructor(socket, username, email, wins, losses, rankingPoints) {
    this.socket = socket;
    this.username = username;
    this.email = email;
    this.losses = losses;
    this.wins = wins;
    this.rankingPoints = rankingPoints;
  }
}

module.exports = User;
