const initWaitingLobby = () => {
  if (user == null) {
    warn('Warning', 'You need to be logged in before you can play a game.');
    goTo('home');
    return;
  }
  socket.emit('findGame');
}

const joinGame = () => {
  goTo('multi');
}

const cancelQueue = () => {
  socket.emit('cancelQueue');
  goTo('home');
}

socket.on('foundGame', joinGame)