const initWaitingLobby = () => {
  socket.emit('findGame');
}

const joinGame = () => {
  // goTo('multi');
  console.log(socket.id)
  socket.emit('isReady');
}

socket.on('foundGame', joinGame)