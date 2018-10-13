const register = () => {
  const email = document.querySelector('#register_inp_email').value;
  const user = document.querySelector('#register_inp_username').value;
  const password = document.querySelector('#register_inp_password').value;

  if (user.length <= 0) {
    warn('Warning', 'Username is too short');
  } else if (!validateEmail(email)) {
    warn('Warning', 'Incorrect email');
  }
  else if (password.length <= 8) {
    warn('Warning', 'Password must at least contain 8 characters.');
  } else {
    socket.emit('register', email, user, password, date);
  }
}

//method from: https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
const validateEmail = (email) => {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

const handleRegistrationResponse = (message) => {
  warn('Warning', message);
}

const login = () => {
  const user = document.querySelector('#login_inp_username').value;
  const password = document.querySelector('#login_inp_password').value;

  console.log(user, password);
}


socket.on('registrationResponse', handleRegistrationResponse);