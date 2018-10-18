const initWaitingLobby = () => {
  socket.emit('findGame');
}

const joinGame = () => {
  goTo('multi');
}

socket.on('foundGame', joinGame)
// socket.on('')