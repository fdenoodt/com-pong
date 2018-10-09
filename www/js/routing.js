// Routing
const goTo = (page) => {
  console.log(page);
  location.href = '?page=' + page
}

//Method copied from online
const getUrlVars = () => {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
    vars[key] = value;
  });
  return vars;
}

const lsPages = ['home', 'login', 'register', 'profile', 'scoreboard', 'solo', 'multi', 'waitinglobby'];
lsPages.forEach(element => {
  document.querySelector('.' + element).style.display = 'none';
});

let pageToDisplay = getUrlVars().page;
if (pageToDisplay == null)
  pageToDisplay = 'home';

document.querySelector('.' + pageToDisplay).style.display = 'block';

//Page events:
if (pageToDisplay == 'multi') {
  initalizeMultiGame();
} else if(pageToDisplay == 'waitinglobby') {
  findGame();
}