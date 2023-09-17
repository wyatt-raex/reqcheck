//DOM

//User Data
let userData;
if (localStorage.getItem("userEmail") != "null") {
    fetch("http://localhost:5000/api/db/login/"+localStorage.getItem("userEmail"))
  .then(function(res){ return res.json(); })
  .then(function(data){
    //Your builds
    userData = data; 
    if (userData.builds.length > 0) {
        userData.builds.forEach((element, index) => {
            document.getElementById("builds").innerHTML += `
            <h3><a href="hardware.html">${element.name}</a></h3>
            <ul>
            <li>Processor: ${element.processor}}</li>
            <li>RAM: ${element.memory}}</li>
            <li>Graphics: ${element.graphics}}</li>
            <li>Storage: ${element.storage}}</li>
            </ul>`
          });
    }
    else document.getElementById("builds").innerHTML += '<a href="hardware.html" style="text-align: center; display: block">Click here to create builds.</a>'
    
  });
}
else {
    document.getElementById("builds").innerHTML += '<h3 style="text-align: center">Please login to create custom builds.</h3>'
}