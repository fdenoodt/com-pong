const initScoreboard = () => {
  if (user == null) {
    warn('Warning', 'You need to log in before you can see the scoreboard.');
    goTo('home');
  }
  else {
    socket.emit('scoreboard');
  }

}