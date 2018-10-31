const initScoreboard = () => {
  if (user == null) {
    warn('Warning', 'You need to log in before you can see the scoreboard.');
    goTo('home');
  }
  else {
    socket.emit('scoreboard');
  }

}

const handleScoreboardResponse = (data) => {
  console.log(data);
  if (data.isSuccessful) {
    const lsUsers = data.result;
    for (const user of lsUsers) {

    }
    //tblWins
  }
  else {
    warn('Warning', 'Something went wrong.. try again later.');
    goTo('home');
  }

}

socket.on('scoreboardResponse', handleScoreboardResponse);
