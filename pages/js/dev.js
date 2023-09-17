//DOM
const gameSelect = document.getElementById("gameSelect");
const impressions = document.getElementById("impressions");
const processorsTable = document.getElementById("processorsTable");
const graphicsTable = document.getElementById("graphicsTable");

//Load
function load() {
  if (localStorage.getItem("userRole") != "dev") {
    window.location.href = "404.html";
    window.location.replace("404.html");
  }
  else {
    getGames(localStorage.getItem("userEmail"));
  }
}

//Get games
const dataArray = [];
async function getGames(email) {
  //Get data of user
  await fetch("http://localhost:5000/api/db/login/"+email)
  .then(function(res){ return res.json(); })
  .then(async function(data){
    //Get data
    let endIndex = 0;
    data.games.forEach((element, index) => {
      let dataArray = [];
      if (typeof element == "string") {
        fetch("http://localhost:5000/api/db/games/local/list/"+element)
        .then(function(res){ return res.json(); })
        .then(function(data){sessionStorage.setItem(`game${index}`, JSON.stringify(data))});
      }
      else {
        fetch("http://localhost:5000/api/db/games/steam/list/"+element)
        .then(function(res){ return res.json(); })
        .then(function(data){sessionStorage.setItem(`game${index}`, JSON.stringify(data))});
      }
      endIndex = index;
    });

    //Get Games
    for (let i = 0; i < endIndex; i++) {
      dataArray[i] = sessionStorage.getItem(`game${i}`);
      dataArray[i] = JSON.parse(dataArray[i]);
    }

    //Set Games
    gameSelect.innerHTML = "";
    dataArray.forEach((element, index) => {
      gameSelect.innerHTML += `<option class="gameLinks"; value="${index}">${element.name}</option>`
    });
    
    //Run Open Game
    openGame(0);
  });
}



//Games
function openGame(i) {
  const data = dataArray[i];
  //Processor
  processorsTable.innerHTML = `<tr><th>Name</th><th>Impressions</th></tr>`
  if (data.hasOwnProperty('processor') == true) {
    const keys = Object.keys(data.processor);
    keys.forEach((element, index) => {
      processorsTable.innerHTML += `
      <tr>
      <th>${element}</th>
      <th>${data.processor[element]}</th>
      </tr>`
    });
  }

  //Graphics
  graphicsTable.innerHTML = `<tr><th>Name</th><th>Impressions</th></tr>`
  if (data.hasOwnProperty('graphics') == true) {
    const keys = Object.keys(data.graphics);
    keys.forEach((element, index) => {
      graphicsTable.innerHTML += `
      <tr>
      <th>${element}</th>
      <th>${data.graphics[element]}</th>
      </tr>`
    });
  }

  //Impressions
  if (data.hasOwnProperty('impressions') == true) impressions.innerHTML = "Impressions: " + data.impressions;
  else impressions.innerHTML = "Impressions: No Views"
}
