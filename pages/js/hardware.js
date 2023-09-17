//DOM
const nameHTML = document.getElementById('name');
const cpuHTML = document.getElementById('cpu');
const gpuHTML = document.getElementById('gpu');
const ramHTML = document.getElementById('ram');
const storageHTML = document.getElementById('storage');
const osHTML = document.getElementById("os");
const myBuilds = document.getElementById("MYBUILDS");
const prebuilts = document.getElementById("PREBUILTS")
openType('MYBUILDS');

//Get Data
const processorArray = [];
const graphicsArray = [];
const memoryArray = ["512 MB", "1 GB", "2 GB", "4 GB", "8 GB", "12 GB", "16 GB", "32 GB", "64 GB", "128 GB"];
const storageArray = ["32 GB", "64 GB", "128 GB", "256 GB", "512 GB", "1 TB", "2 TB", "3 TB", "4 TB", "5 TB"];

//Prebuilts
let prebuiltData;
fetch("http://localhost:5000/api/db/hardware/prebuilt")
  .then(function(res){ return res.json(); })
  .then(function(data){
    //Your builds
    prebuiltData = data; 
    prebuiltData.forEach((element, index) => {
      prebuilts.innerHTML += `<h3  ">${element.name}</h3>
      <ul>
        <li>Processor: ${element.processor}</li>
        <li>Memory: ${element.memory}</li>
        <li>Graphics: ${element.graphics}</li>
        <li>Storage: ${element.storage}</li>
      </ul>
      <br>
      `
    });
  });

//User Data
let userData;
fetch("http://localhost:5000/api/db/login/"+localStorage.getItem("userEmail"))
  .then(function(res){ return res.json(); })
  .then(function(data){
    //Your builds
    userData = data; 
    userData.builds.forEach((element, index) => {
      setBuildHTML(element, index);
    });
  });

//Processor
cpuHTML.innerHTML = "<option value=Loading>Loading</option>"
fetch("http://localhost:5000/api/db/hardware/processor")
.then(function(res){ return res.json(); })
.then(function(data){ 
  data.forEach(element => {
    processorArray.push(element.name);
  });
  cpuHTML.innerHTML = "";
  processorArray.sort();
  processorArray.forEach(element => {
    cpuHTML.innerHTML += `<option value="${element}">${element}</option>`
  });
});

//Graphics
gpuHTML.innerHTML = "<option value=Loading>Loading</option>"
fetch("http://localhost:5000/api/db/hardware/graphics")
.then(function(res){ return res.json(); })
.then(function(data){ 
  data.forEach(element => {
    graphicsArray.push(element.name);
  });
  gpuHTML.innerHTML = "";
  graphicsArray.sort();
  graphicsArray.forEach(element => {
    gpuHTML.innerHTML += `<option value="${element}">${element}</option>`
  });
});

//Memory
memoryArray.forEach(element => {
  ramHTML.innerHTML += `<option value="${element}">${element}</option>`
});

//Storage
storageArray.forEach(element => {
  storageHTML.innerHTML += `<option value="${element}">${element}</option>`
});

//Save Option Display
async function saveOption() {
  //Check for same name 
  let nameCheck = true;
  for (let i = 0; i < userData.builds.length; i++) {
    if (userData.builds[i].name == nameHTML.value) {
      nameCheck = false;
      break; 
    }
  }

  if (nameCheck == true) {
    //Data
    let data = userData.builds;
    newBuild = {
      name: nameHTML.value,
      processor: cpuHTML.value,
      memory: ramHTML.value,
      graphics: gpuHTML.value,
      storage: storageHTML.value,
      os: osHTML.value
    }
    data.push(newBuild);

    //Update Database
    await fetch(`http://localhost:5000/api/db/login/build/${userData.email}`, {method: 'POST', body: JSON.stringify(data), headers: {'Accept': 'application/json', 'Content-Type': 'application/json'}})

    //Update My Builds
    myBuilds.innerHTML = "";
    data.forEach((element, index) => {
      setBuildHTML(element, index);
    });
    userData.builds = data;
  }
  else alert("Another build with the same name already exists");
}

//Delete Build
async function deleteBuild(index) {
  userData.builds[index] = "";
  const data = userData.builds;
  for (let i = index+1; i < data.length; i++) {
    data[i-1] = data[i];
  }
  data.pop();
  
  //Update Database
  await fetch(`http://localhost:5000/api/db/login/build/${userData.email}`, {method: 'POST', body: JSON.stringify(data), headers: {'Accept': 'application/json', 'Content-Type': 'application/json'}})

  //Update My Builds
  myBuilds.innerHTML = "";
  data.forEach((element, index) => {
    setBuildHTML(element, index);
  });
  userData.builds = data;
}

//JS Switch Between Tabs
function openType(buildType) {
  let i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
  tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
  tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(buildType).style.display = "block";
  //evt.currentTarget.className += " active";
}

//Load Build
function loadBuild(i) {
  nameHTML.value = userData.builds[i].name;
  cpuHTML.value = userData.builds[i].cpu;
  gpuHTML.value = userData.builds[i].gpu;
  ramHTML.value = userData.builds[i].ram;
  storageHTML.value = userData.builds[i].storage;
  osHTML.value = userData.builds[i].os;
}

//Set builds
function setBuildHTML(element, index) {
  myBuilds.innerHTML += `
      <h3 id="myNAME${index}"; onclick="">${element.name}</h3>
      <ul>
        <li id="myCPU${index}">Processor: ${element.processor}</li>
        <li id="myRAM${index}">Memory: ${element.memory}</li>
        <li id="myGPU${index}">Graphics: ${element.graphics}</li>
        <li id="mySTORAGE${index}">Storage: ${element.storage}</li>
      </ul>
      <button onclick="deleteBuild(${index})">DELETE</button;
      <br>
      `
}

