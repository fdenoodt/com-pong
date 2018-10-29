let soloTimer = null;
let soloGame = null;

const initSolo = () => {
  if (user == null) {
    warn('Warning', 'You need to log in before you can play a game.');
    goTo('home');
    return;
  }

  soloGame = new Game();
  soloTimer = setInterval(gameTick, 4);
}

const gameTick = () => {
  soloGame.playTick();
}