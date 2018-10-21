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
  const email = document.querySelector('#register_inp_email').value;
  const user = document.querySelector('#register_inp_username').value;
  const password = document.querySelector('#register_inp_password').value;

  if (user.length <= 0) {
    warn('Warning', 'Username is too short');
  } else if (!validateEmail(email)) {
    warn('Warning', 'Incorrect email');
  }
  else if (password.length < 8) {
    warn('Warning', 'Password must at least contain 8 characters.');
  } else {
    socket.emit('register', email, user, password);
  }
}

//method from: https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
const validateEmail = (email) => {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

const handleRegistrationResponse = (response) => {
  warn('Warning', response.message);
  if (response.isSuccessful)
    goTo('home');
}

const login = () => {
  const email = document.querySelector('#login_inp_email').value;
  const password = document.querySelector('#login_inp_password').value;
  socket.emit('login', email, password);
}

const handleLoginResponse = (response) => {
  warn('Warning', response.message);
  if (response.isSuccessful) {
    const inputs = response.userData;
    user = new User(inputs.email, inputs.username, inputs.wins, inputs.losses, inputs.rankingpoints);
    goTo('home');
  }
}

const requestLogout = () => {
  socket.emit('requestLogOut');
}

const handleLogOut = () => {
  warn(null, 'Successfully signed out.');
  user = null;
  location.reload();
  // goTo('home');
  // location.href = '/home'
  // location.href = '/#page=' + 'home'

}


//TODO: THIS MUST BE TESTED FROM CORDOVA APP
const tryAutoLogin = () => {
  const isOnline = true;
  const token = localStorage.getItem('wopToken');
  if (isOnline && token !== null) {
    socket.emit('tokenLogin', token);
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