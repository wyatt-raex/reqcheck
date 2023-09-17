
//Goto Admin Dashbaord
function gotoAdmin(){

}

//Goto Developer Dashboard
function gotoDev(){

}

//Goto login page
function gotoLogin(){
  sessionStorage.setItem("logout", true);
}

//Goto Hardware Page
function gotoHardware(){

}

//Add Buttons for respective Dashboards
const adminButton = document.getElementById("adminButton");
const devButton = document.getElementById("devButton");
const hardwareButton = document.getElementById("hardwareButton");

//Search (Code based on system by Traversy Media)
const searchBar = document.getElementById("searchBar");
const matchList = document.getElementById("matchList");
matchList.innerHTML = '';

//Change Login based on login status
const loginButton = document.getElementById("loginButton");
//Check Local Storage (initial)
if (localStorage.getItem("userEmail") == undefined) localStorage.setItem("userEmail", "null");
if (localStorage.getItem("userRole") == undefined) localStorage.setItem("userRole", "null");
if (localStorage.getItem("userEmail") == 'null') {
  loginButton.innerHTML = "LOGIN/SIGN-UP";
  adminButton.remove(); 
  devButton.remove();
  hardwareButton.remove();
} 
else {
  loginButton.innerHTML = "LOGOUT";
  switch (localStorage.getItem("userRole")) {
    case "user": adminButton.remove(); devButton.remove(); break;
    case "dev": adminButton.remove(); break;
    case "admin": devButton.remove(); break;
  }
} 

//Get User Builds
let steamJSON;
let xmlSteam = new XMLHttpRequest();
xmlSteam.addEventListener("load", reqListener => {
  steamJSON = JSON.parse(xmlSteam.responseText);
});
xmlSteam.open("GET", "http://localhost:5000/api/db/games/steam", true);
xmlSteam.send();

//Get Prebuilts
let localJSON;
const xmlLocal = new XMLHttpRequest();
xmlLocal.addEventListener("load", reqListener => {
  localJSON = JSON.parse(xmlLocal.responseText);
});
xmlLocal.open("GET", "http://localhost:5000/api/db/games/local");
xmlLocal.send();
//matchList.display = false;

//Search Games
const searchGames = async function(searchText) {
  //Get Data
  const res = await fetch('../data/gameList4-9-22.json');
  //console.log(steamJSON);
  //const res = steamJSON;
  const games = await res.json();
  const gameArray = games.concat(localJSON);
  console.log(gameArray);
  //matchList.display = true;
  
  //console.log(games.apps[4].name);

  //Get Matches
  let matches = gameArray.filter(game => {
    const regex = new RegExp(`^${searchText}`, 'gi');
    return game.name.match(regex);
  })
  //console.log(searchText)

  //Have at least 1 character to search
  if (searchText.length == 0) {
      matches= [];
      matchList.innerHTML = '';
  }
  //console.log(matches);

  //Get Path
  let gameUrl = 'game.html';
  if (window.location.pathname == '/index.html')  gameUrl = './game.html';
  gameUrl += "?appID=";

  //Display Results
  if (matches.length > 0) {
    const html = matches.map(
      match => `
        <a href="${gameUrl}${match.appid}">${match.name}<br></a>`
    ).join('');
    //console.log(html);

    matchList.innerHTML = html;
  } 
}

searchBar.addEventListener('input', () => searchGames(searchBar.value));
  //if (matchList.innerHTML == '') matchList.display = false;

  /*
function search(){
    //Get current page
    let page = window.location.href.split('/');
    page = page[page.length-1];

    //Send to page
    if (searchBar.value == "Minecraft")
    {
      if (page == "index.html") location.assign('pages/minecraft.html');
      else location.assign('minecraft.html');
    }
    else alert("Game not found. Please try again.")
}
*/
