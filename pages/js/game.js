//Varaibles
const noSupport = "Selected Build's Operating System is not offically supported by this game.";
const noRequirements = "Though the selected build's Operating System is supported for this game, there are no requirements listed by the developer.";
const build = document.querySelector('#build');
const results = document.getElementById("buildResults");
const minimumResults = document.getElementById("minResults");
const recommendedResults = document.getElementById("recResults");
const userEmail = localStorage.getItem("userEmail"); //Change to some sort of login thing later
let userBuilds;

window.onload = async function(){
  results.style.display = "none";
  await fetch("http://localhost:5000/api/db/games/"+getID());
  getJSON();
}

//Get ID
function getID() {
  const urlParm = new URLSearchParams(window.location.search);
  return urlParm.get('appID');
}

//Get User Builds
if (userEmail != 'null') {
  let xmlReq = new XMLHttpRequest();
  xmlReq.addEventListener("load", reqListener => {
    userBuilds = JSON.parse(xmlReq.responseText).builds;
  });
  xmlReq.open("GET", "http://localhost:5000/api/db/login/"+userEmail);
  xmlReq.send();
}


//Get Prebuilts
let prebuiltBuilds;
const xmlReq2 = new XMLHttpRequest();
xmlReq2.addEventListener("load", reqListener => {
  prebuiltBuilds = JSON.parse(xmlReq2.responseText);
});
xmlReq2.open("GET", "http://localhost:5000/api/db/hardware/prebuilt");
xmlReq2.send();

//Get all hardware
let processorJSON;
const xmlReq3 = new XMLHttpRequest();
xmlReq3.addEventListener("load", reqListener => {
  processorJSON = JSON.parse(xmlReq3.responseText);
});
xmlReq3.open("GET", "http://localhost:5000/api/db/hardware/processor");
xmlReq3.send();

let graphicsJSON;
const xmlReq4 = new XMLHttpRequest();
xmlReq4.addEventListener("load", reqListener => {
  graphicsJSON = JSON.parse(xmlReq4.responseText);
});
xmlReq4.open("GET", "http://localhost:5000/api/db/hardware/graphics");
xmlReq4.send();




//Get JSON
async function getJSON(){
  //Vars
  let id = getID();
  let url = 'http://localhost:5000/api/steam/'+id;

  //Get JSON
  $.getJSON(url, await function(data)
  {
    //Combined Builds
    let combinedBuilds;
    if (userBuilds != undefined) combinedBuilds = userBuilds.concat(prebuiltBuilds);
    else combinedBuilds = prebuiltBuilds;

    //Show user builds
    combinedBuilds.forEach((element, index) => {
      build.innerHTML += `<option value=${index}>${element.name}</option>`;
    });

    //Get Data
    const name = data[id].data.name;
    const image = data[id].data.header_image;
    const description = data[id].data.about_the_game;

    //Requirements
    sessionStorage.setItem('windowsSupport', (data[id].data.platforms.windows));
    sessionStorage.setItem('windowsMinimum', data[id].data.pc_requirements.minimum);
    sessionStorage.setItem('windowsRecommended', data[id].data.pc_requirements.recommended);
    sessionStorage.setItem('macSupport', data[id].data.platforms.mac);
    sessionStorage.setItem('macMinimum', data[id].data.mac_requirements.minimum);
    sessionStorage.setItem('macRecommended', data[id].data.mac_requirements.recommended);
    sessionStorage.setItem('linuxSupport', data[id].data.platforms.linux);
    sessionStorage.setItem('linuxMinimum', data[id].data.linux_requirements.minimum);
    sessionStorage.setItem('linuxRecommended', data[id].data.linux_requirements.recommended);

    //Display JSON
    document.getElementById("titleName").innerHTML = 'ReqCheck - ' + name;
    document.getElementById("gameName").innerHTML = name;
    document.getElementById("gameImage").src = image;
    document.getElementById("gameDescription").innerHTML = description;
    checkOS();
  });
}

//Check OS Support
function checkOS() {
  //Get Requirements
  const windowsSupport = sessionStorage.getItem('windowsSupport') === 'true';
  const windowsMinimum = sessionStorage.getItem('windowsMinimum').replace(/[^0-9a-z_<>/."&:]/gi, ' ');
  const windowsRecommended = sessionStorage.getItem('windowsRecommended').replace(/[^0-9a-z_<>/."&:]/gi, ' ');
  const macSupport = sessionStorage.getItem('macSupport') === 'true';
  const macMinimum = sessionStorage.getItem('macMinimum').replace(/[^0-9a-z_<>/."&:]/gi, ' ');
  const macRecommended = sessionStorage.getItem('macRecommended').replace(/[^0-9a-z_<>/."&:]/gi, ' ');
  const linuxSupport = sessionStorage.getItem('linuxSupport') === 'true';
  const linuxMinimum = sessionStorage.getItem('linuxMinimum').replace(/[^0-9a-z_<>/."&:]/gi, ' ');
  const linuxRecommended = sessionStorage.getItem('linuxRecommended').replace(/[^0-9a-z_<>/.&":]/gi, ' ');
  let combinedBuilds;
  if (userBuilds != undefined) combinedBuilds = userBuilds.concat(prebuiltBuilds);
  else combinedBuilds = prebuiltBuilds;

  //Display Requirement Based on Selected Build OS
  let osSupport = true;
  let minRequirement = '';
  let recRequirement = '';

  //Display loading
  document.getElementById("recResults0").innerHTML = "Processor: Loading...";
  document.getElementById("recResults1").innerHTML = "Memory: Loading...";
  document.getElementById("recResults2").innerHTML = "Graphics: Loading...";
  document.getElementById("recResults3").innerHTML = "Storage: Loading...";
  document.getElementById("minResults0").innerHTML = "Processor: Loading...";
  document.getElementById("minResults1").innerHTML = "Memory: Loading...";
  document.getElementById("minResults2").innerHTML = "Graphics: Loading...";
  document.getElementById("minResults3").innerHTML = "Storage: Loading...";

  //Select based on current system
  systemType = combinedBuilds[build.value].os;

  //Display Specs
  if (combinedBuilds.length > 0) {
    document.getElementById("buildSpecs").innerHTML = `
    <li><strong>Processor: ${combinedBuilds[build.value].processor}</strong></li>
    <li><strong>Memory: ${combinedBuilds[build.value].memory}</strong></li>
    <li><strong>Graphics: ${combinedBuilds[build.value].graphics}</strong></li>
    <li><strong>Storage: ${combinedBuilds[build.value].storage}</strong></li>
    <li><strong>OS: ${(combinedBuilds[build.value].os).charAt(0).toUpperCase() + (combinedBuilds[build.value].os).slice(1)}</strong></li>`;
  }

  switch (systemType)
  {
    case 'windows':
      minRequirement += windowsMinimum;
      recRequirement += windowsRecommended;
      osSupport = windowsSupport;
    break;

    case 'mac':
      minRequirement += macMinimum;
      recRequirement += macRecommended;
      osSupport = macSupport;
    break;

    case 'linux':
      minRequirement += linuxMinimum;
      recRequirement += linuxRecommended;
      osSupport = linuxSupport;
    break;
  }

  //Get current system
  let requirement = '';
  if (osSupport == false) requirement = noSupport;
  else{
    if (minRequirement != 'undefined') requirement += minRequirement;
    if (recRequirement != 'undefined') requirement += '<br>' + recRequirement;
    if (requirement == '') requirement = noRequirements;
  }
  
  if (requirement != document.getElementById("gameRequirements").innerHTML) results.style.display = "none";
  document.getElementById("gameRequirements").innerHTML = requirement;
  return requirement;
}

//Compare
async function compareOption() {
    //Get Requirements
    let requirement = checkOS().toUpperCase();
    const minimum = ['', '', '', ''] //CPU, RAM, GPU, STORAGE
    const recommended = ['', '', '', ''] //CPU, RAM, GPU, STORAGE

    //Check for tiers
    let hasMin = requirement.indexOf("MINIMUM");
    let hasRec = requirement.indexOf("RECOMMENDED")
    let minString = '';
    let recString = '';
    let sIndex = -1;
    let sLength = -1;

    //Set strings
    if (hasMin != -1)
    {
      if (hasRec != -1) minString = requirement.substring(hasMin, hasRec);
      else minString = requirement.substring(hasMin);
    }
    if (hasRec != -1) recString = requirement.substring(hasRec);

    //If they don't have minimum or recommended, but have system requirements, count them as minimum (example, Grand Theft Auto)
    if (hasMin == -1 && hasRec == -1)
    {
      hasMin = 0;
      minString = requirement;
    }
    
    if (requirement != noSupport.toUpperCase() && requirement != noRequirements.toUpperCase()) {
      //Display
      results.style.display = "initial";

      //MINIMUM//
      //If there are minimum requirements
      if (hasMin != -1) { 
        
        //Processor
        sIndex = minString.indexOf("<STRONG>PROCESSOR:</STRONG>");
        if (sIndex != -1) {
          sLength = ("<STRONG>PROCESSOR:</STRONG>").length;
          sIndex = sIndex+sLength+1;
          minimum[0] = minString.substring(sIndex, sIndex+(minString.substring(sIndex+1)).indexOf("<")+1);
        }

        //Memory
        sIndex = minString.indexOf("<STRONG>MEMORY:</STRONG>");
        if (sIndex != -1) {
          sLength = ("<STRONG>MEMORY:</STRONG>").length;
          sIndex = sIndex+sLength+1;
          minimum[1] = minString.substring(sIndex, sIndex+(minString.substring(sIndex+1)).indexOf("<")+1);
        }

        //Graphics
        sIndex = minString.indexOf("<STRONG>GRAPHICS:</STRONG>");
        if (sIndex != -1) {
          sLength = ("<STRONG>GRAPHICS:</STRONG>").length;
          sIndex = sIndex+sLength+1;
          minimum[2] = minString.substring(sIndex, sIndex+(minString.substring(sIndex+1)).indexOf("<")+1);
        }

        //Storage
        sIndex = minString.indexOf("<STRONG>STORAGE:</STRONG>");
        if (sIndex != -1) {
          sLength = ("<STRONG>STORAGE:</STRONG>").length;
          sIndex = sIndex+sLength+1;
          minimum[3] = minString.substring(sIndex, sIndex+(minString.substring(sIndex+1)).indexOf("<")+1);
        }

        //Set display
        minimumResults.style.display = "initial";
      }


      //RECOMMENDED//
      //If there are recommended requirements
      if (hasRec != -1) { 
        //Processor
        sIndex = recString.indexOf("<STRONG>PROCESSOR:</STRONG>");
        if (sIndex != -1) {
          sLength = ("<STRONG>PROCESSOR:</STRONG>").length;
          sIndex = sIndex+sLength+1;
          recommended[0] = recString.substring(sIndex, sIndex+(recString.substring(sIndex+1)).indexOf("<")+1);
        }

        //Memory
        sIndex = recString.indexOf("<STRONG>MEMORY:</STRONG>");
        if (sIndex != -1) {
          sLength = ("<STRONG>MEMORY:</STRONG>").length;
          sIndex = sIndex+sLength+1;
          recommended[1] = recString.substring(sIndex, sIndex+(recString.substring(sIndex+1)).indexOf("<")+1);
        }

        //Graphics
        sIndex = recString.indexOf("<STRONG>GRAPHICS:</STRONG>");
        if (sIndex != -1) {
          sLength = ("<STRONG>GRAPHICS:</STRONG>").length;
          sIndex = sIndex+sLength+1;
          recommended[2] = recString.substring(sIndex, sIndex+(recString.substring(sIndex+1)).indexOf("<")+1);
        }

        //Storage
        sIndex = recString.indexOf("<STRONG>STORAGE:</STRONG>");
        if (sIndex != -1) {
          sLength = ("<STRONG>STORAGE:</STRONG>").length;
          sIndex = sIndex+sLength+1;
          recommended[3] = recString.substring(sIndex, sIndex+(recString.substring(sIndex+1)).indexOf("<")+1);
        }

        //Set display
        recommendedResults.style.display = "initial";
      }
    }
    else results.style.display = "none";

  //Get Hardware
  const hardwareValues = await getHardwareValues();
  const minValues = await getRequirementValues(minimum);
  const recValues = await getRequirementValues(recommended);
  let text = "";
  let minText = "";
  let recText = "";
  const minTotal = [0, 0, 0, 0];
  const recTotal = [0, 0, 0, 0];

  //Compare
  if (requirement != noSupport)
  {
    for (let i = 0; i < 4; i++) {
      //Vars
      switch (i){
        case 0: text = "<strong>Processor:</strong> "; break;
        case 1: text = "<strong>Memory:</strong> "; break;
        case 2: text = "<strong>Graphics:</strong> "; break;
        case 3: text = "<strong>Storage:</strong> "; break;
      }
      minText = text;
      recText = text;

      //Minimum
      if (hasMin != -1) {
        if (minValues[i] == -1 || minValues[i] == 1.3 || minValues[i] == 1.5 || minValues[i] == 1.7) { minText += "<span style='color: orange'>N/A</span><br>The minimum requirements do not have enough information to make an accurate estimate."; }
        else
        {
          if (hardwareValues[i] < minValues[i]) minText += "<span style='color: red'>FAIL</span><br>Component does not meet minimum requirement.";
          if (hardwareValues[i] == minValues[i]) minText += "<span style='color: yellow'>MEET</span><br>Component meets minimum requirement.";
          if (hardwareValues[i] > minValues[i]) minText += "<span style='color: green'>PASS</span><br>Component exceeds minimum requirement.";
        }
        minTotal[i] = hardwareValues[i]-minValues[i];
      }
      else minimumResults.style.display = "none";

      //Reccomended
      if (hasRec != -1){
        //Compare
        if (recValues[i] == -1 || recValues[i] == 1.3 || recValues[i] == 1.5 || recValues[i] == 1.7) recText += "<span style='color: orange'>N/A</span><br>The recommended requirements do not have enough information to make an accurate estimate.";
        else
        {
          if (hardwareValues[i] < recValues[i]) recText += "<span style='color: red'>FAIL</span><br>Component does not meet recommended requirement.";
          if (hardwareValues[i] == recValues[i]) recText += "<span style='color: yellow'>MEET</span><br>Component meets recommended requirement.";
          if (hardwareValues[i] > recValues[i]) recText += "<span style='color: green'>PASS</span><br>Component exceeds recommended requirement.";
        }
        recTotal[i] = hardwareValues[i]-recValues[i];
      }
      else recommendedResults.style.display = "none";
      

      //Set text
      document.getElementById("minResults"+i).innerHTML = minText;
      document.getElementById("recResults"+i).innerHTML = recText;
    }
  }


}


//Get array of values for current hardware
async function getHardwareValues() {
  let values = [0, 0, 0, 0];
  let combinedBuilds;
  if (userBuilds != undefined) combinedBuilds = userBuilds.concat(prebuiltBuilds);
  else combinedBuilds = prebuiltBuilds;
  const currentBuild = combinedBuilds[build.value];

  //Set impressions
  await fetch(`http://localhost:5000/api/db/games/processor/${getID()}/${currentBuild.processor}`);
  await fetch(`http://localhost:5000/api/db/games/graphics/${getID()}/${currentBuild.graphics}`);

  //Fetch Data (CPU & GPU)
  for (let i = 0; i < Math.max(graphicsJSON.length, processorJSON.length); i++) {
    let graphicsDone = false;
    let processorDone = false;

    //Processor
    if (processorJSON.length > i) {
      if (processorJSON[i].name == currentBuild.processor) {
        values[0] = processorJSON[i].value;
        processorDone = true;
      }
    }
    else processorDone = true;

    //Graphics
    if (graphicsJSON.length > i) {
      if (graphicsJSON[i].name == currentBuild.graphics) {
        values[2] = graphicsJSON[i].value;
        graphicsDone = true;
      }
    }
    else graphicsDone = true;

    //Break 
    if (graphicsDone == true && processorDone == true) break;
  }

  //RAM & Storage
  //Get RAM Unit
  let unit = 1;
  let amount = 0;

  //RAM
  if (currentBuild.memory.indexOf("MB") != -1) unit = .1;
  amount = currentBuild.memory.match(/\d+/)[0];
  values[1] = amount*unit;

  //Storage
  if (currentBuild.storage.indexOf("MB") != -1) unit = .1;
  if (currentBuild.storage.indexOf("TB") != -1) unit = 1000;
  amount = currentBuild.storage.match(/\d+/)[0];
  values[3] = amount*unit;
  return values;
}

//Get array of values for game hardware
async function getRequirementValues(array) {
  let values = [-1, -1, -1, -1];
  array[0] = array[0].replaceAll("  ", " ");
  array[1] = array[1].replaceAll("  ", " ");
  array[2] = array[2].replaceAll("  ", " ");
  array[3] = array[3].replaceAll("  ", " ");

  //Processor
  if (array[0] != "") {
    let matches = processorJSON.filter(element => {
      //Remove Intel/AMD (For better chance of matches)
      let name = element.name;
      if (name.indexOf("Intel ") != -1) name = name.replaceAll("Intel ", "");
      if (name.indexOf("AMD ") != -1) name = name.replaceAll("AMD ", "");
      name = name.toUpperCase();
      
      //Create regular expression
      const regex = new RegExp(`${name}`, 'gi');
      return array[0].match(regex);
    })
    //ADD A CHECK FOR INCORRECT ENTRIES (SUCH AS I7 750 VS WITH AN I7 7500)
    //console.log(matches);
    
    //Get Smallest
    if (matches.length > 0) {
      let min = Number.MAX_VALUE;
      for (let i = 0; i < matches.length; i++) {
        if (matches[i].value < min) min = matches[i].value;
      }
      values[0] = min;
    } else {
      //Check for ambiguous things
      if (array[0].indexOf("CORE I3") != -1) values[0] = 1.3;
      if (array[0].indexOf("CORE I5") != -1) values[0] = 1.5;
      if (array[0].indexOf("CORE I7") != -1) values[0] = 1.7;
    }
    console.log("CPU: " + values[0]);
  }
  
  //Graphics
  if (array[2] != "") {
    matches = graphicsJSON.filter(element => {
      let name = element.name.toUpperCase();
      if (name.indexOf("NVIDIA ") != -1) name = name.replaceAll("NVIDIA ", "");
      if (name.indexOf("AMD ") != -1) name = name.replaceAll("AMD ", "");
      

      //Create regular expression
      let regex = new RegExp(`${name}`, 'gi');

      //Check first with geforce/radeon
      if (array[2].match(regex) != null) return array[2].match(regex);
      else {
        if (name.indexOf("RADEON ") != -1) name = name.replaceAll("RADEON ", "");
        if (name.indexOf("GEFORCE ") != -1) name = name.replaceAll("GEFORCE ", "");
        regex = new RegExp(`${name}`, 'gi');
        return array[2].match(regex);
      }
      
    });
  
    //Get Smallest
    if (matches.length > 0) {
      min = Number.MAX_VALUE;
      for (let i = 0; i < matches.length; i++) {
        if (matches[i].value < min) min = matches[i].value;
      }
      values[2] = min;
    }
    console.log("GPU: " + values[2]);
  }
  
  //RAM
  if (array[1] != "") {
    let unit = 1;
    let amount = 0;
    if (array[1].indexOf("MB") != -1) unit = .1;
    amount = array[1].match(/\d+/)[0];
    values[1] = amount*unit;
    console.log("RAM: " + values[1]);
  }
  
  //Storage
  if (array[3] != "") {
    unit = 1;
    amount = 0;
    if (array[3].indexOf("MB") != -1) unit = .1;
    if (array[3].indexOf("TB") != -1) unit = 1000;
    amount = array[3].match(/\d+/)[0];
    values[3] = amount*unit;
    console.log("Storage: " + values[3]);
  }
  console.log(values);
  return values;
}
