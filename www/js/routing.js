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

const lsPages = ['home', 'login', 'register', 'profile', 'scoreboard', 'solo', 'multi'];
lsPages.forEach(element => {
  document.querySelector('.' + element).style.display = 'none';
});

const pageToDisplay = getUrlVars().page;
document.querySelector('.' + pageToDisplay).style.display = 'block';
if (pageToDisplay == 'multi') {
  initalizeMultiGame();
}