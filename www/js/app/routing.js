// Routing
const goTo = (page) => {
  location.href = '#page=' + page
  updatePage();
  $('.sidenav').sidenav();
}

//Method copied from online and changed "? into #"
const getUrlVars = () => {
  var vars = {};
  var parts = window.location.href.replace(/[#&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
    vars[key] = value;
  });
  return vars;
}

const lsPages = ['home', 'login', 'register', 'profile', 'scoreboard', 'solo', 'multi', 'waitinglobby', 'offline'];

const updatePage = () => {
  lsPages.forEach(element => {
    document.querySelector('.' + element).style.display = 'none';
  });

  let pageToDisplay = getUrlVars().page;
  if (pageToDisplay == null)
    pageToDisplay = 'home';

  if (pageToDisplay == 'multi' || pageToDisplay == 'solo')
    document.querySelector('nav').style.display = 'none';
  else
    document.querySelector('nav').style.display = 'block';


  document.querySelector('.' + pageToDisplay).style.display = 'block';

  //Page events:
  if (pageToDisplay == 'multi') {
    initMulti();
  } else if (pageToDisplay == 'waitinglobby') {
    initWaitingLobby();
  } else if (pageToDisplay == 'profile') {
    initProfile();
  }
  else if (pageToDisplay == 'home')
    initHome();
  else if (pageToDisplay == 'solo')
    initSolo();
}
