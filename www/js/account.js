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

const handleAccountStateChange = (isLoggedIn) => {
  const loggedInScreen = document.querySelector('#homeLoggedIn');
  const loggedOutScreen = document.querySelector('#homeNotLoggedIn');
  loggedInScreen.style.display = isLoggedIn ? 'block' : 'none';
  loggedOutScreen.style.display = isLoggedIn ? 'none' : 'block';
}


const login = () => {
  const email = document.querySelector('#login_inp_email').value;
  const password = document.querySelector('#login_inp_password').value;
  socket.emit('login', email, password);
}

const handleLoginResponse = (response) => {
  const accesstoken = response.userData.stsTokenManager.accessToken
  localStorage.setItem('wopToken', accesstoken);
  warn('Warning', response.isSuccessful ? 'Welcome XXX' : 'Email or password incorrect');
}

socket.on('registrationResponse', handleRegistrationResponse);
socket.on('loginResponse', handleLoginResponse);
socket.on('accountStateChange', handleAccountStateChange);

handleAccountStateChange(false);