let soloTimer = null;
let soloGame = null;

const initSolo = () => {
  soloGame = new Game();
  soloTimer = setInterval(gameTick, 4);
}

const gameTick = () => {
  soloGame.playTick();
}