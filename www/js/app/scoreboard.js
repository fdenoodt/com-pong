const initScoreboard = () => {
  if (user == null) {
    warn('Warning', 'You need to log in before you can see the scoreboard.');
    goTo('home');
  }
  else {
    socket.emit('scoreboard');
  }

}

const handleScoreboardResponse = (res) => {
  const data = res.data;

  if (data.isSuccessful) {
    const lsUsers = data.result;
    const table = document.querySelector('.tblWins');
    clearTable(table);
    let rankState = 1;
    for (const user of lsUsers) {
      const row = table.insertRow(table.rows.length);

      const rowRank = row.insertCell(0);
      const rowUsername = row.insertCell(1);
      const rowWins = row.insertCell(2);
      const rowLosses = row.insertCell(3);
      const rowRatio = row.insertCell(4);

      const username = user.username;
      const wins = user.wins;
      const losses = user.losses;
      const ratio = wins / losses == Infinity || (wins == 0 && losses == 0) ? '-' : Math.round((wins / losses) * 100) / 100;
      rowRank.innerHTML = rankState++;
      rowUsername.innerHTML = username;
      rowWins.innerHTML = wins;
      rowLosses.innerHTML = losses;
      rowRatio.innerHTML = ratio;
    }
  }
  else {
    warn('Warning', 'Something went wrong.. try again later.');
    goTo('home');
  }

}

const clearTable = (table) => {
  var rowCount = table.rows.length;
  for (var x = rowCount - 1; x > 1; x--) {
    table.deleteRow(x);
  }
}

socket.on('scoreboardResponse', handleScoreboardResponse);
