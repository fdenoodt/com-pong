const screenWidth = screen.width;

const initHome = () => {
  const loggedInScreen = document.querySelector('#homeLoggedIn');
  const loggedOutScreen = document.querySelector('#homeNotLoggedIn');
  loggedInScreen.style.display = user == null ? 'none' : 'block';
  loggedOutScreen.style.display = user == null ? 'block' : 'none';
}

const initProfile = () => {
  if (user == null) {
    warn('Warning', 'You need to log in before you can see your stats.');
    goTo('home');
  }
  else {
    document.querySelector('.username').innerHTML = user.Username;
    document.querySelector('.rankingpoints').innerHTML = user.Rankingpoints;
    document.querySelector('.wins').innerHTML = user.Wins;
    document.querySelector('.losses').innerHTML = user.Losses;
  }
}



const register = () => {
  const user = document.querySelector('#register_inp_username').value;
  const password = document.querySelector('#register_inp_password').value;

  if (user.length <= 0) {
    warn('Warning', 'Username is too short');
  }
  else if (password.length < 8) {
    warn('Warning', 'Password must at least contain 8 characters.');
  } else {
    warn('Warning', 'Loading..');
    socket.emit('register', user, password);
  }
}

const handleRegistrationResponse = (response) => {
  warn('Warning', response.message);
  if (response.isSuccessful)
    goTo('home');
}

const login = () => {
  const username = document.querySelector('#login_inp_username').value;
  const password = document.querySelector('#login_inp_password').value;
  localStorage.setItem('wopLogin', JSON.stringify({ username, password }));
  warn('Warning', 'Logging in..');
  socket.emit('login', username, password);
}

const handleLoginResponse = (response) => {
  warn('Warning', response.message);
  if (response.isSuccessful) {
    const inputs = response.userData;
    user = new User(inputs.username, inputs.wins, inputs.losses, inputs.rankingpoints);
    goTo('home');
  }
}

const requestLogout = () => {
  socket.emit('requestLogOut');
}

const handleLogOut = () => {
  localStorage.setItem('wopLogin', null);
  user = null;
  warn('Warning', 'Successfully signed out.');
  goTo('home');
  location.reload();
}


const tryAutoLogin = () => {
  const data = JSON.parse(localStorage.getItem('wopLogin'));
  if (data != null) {
    warn('Warning', 'Logging in..');
    socket.emit('login', data.username, data.password);
  }
}


const handleQuickVibration = () => {
  navigator.vibrate(1000);
  setTimeout(() => {
    navigator.vibrate(0);
  }, 100);
}

socket.on('registrationResponse', handleRegistrationResponse);
socket.on('loginResponse', handleLoginResponse);
socket.on('logOutResponse', handleLogOut)
socket.on('quickVibrate', handleQuickVibration)