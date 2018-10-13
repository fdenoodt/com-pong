const register = () => {
  const email = document.querySelector('#register_inp_email').value;
  const user = document.querySelector('#register_inp_username').value;
  const password = document.querySelector('#register_inp_password').value;
  const date = document.querySelector('#register_inp_date').value;

  socket.emit('register', { email, user, password, date });
  console.log(email, user, password, date);
}


const login = () => {
  const user = document.querySelector('#login_inp_username').value;
  const password = document.querySelector('#login_inp_password').value;

  console.log(user, password);
}