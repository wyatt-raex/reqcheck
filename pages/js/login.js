//Get elements
const emailLogin = document.getElementById("emailLogin");
const passwordLogin = document.getElementById("passwordLogin");
const submitLogin = document.getElementById("submitLogin");
const emailSignUp = document.getElementById("signUpEmail");
const passwordSignUp = document.getElementById("passwordSignUp");
const verifySignUp = document.getElementById("passwordVerifySignUp");
const submitSignUp = document.getElementById("submitSignUp");
const userEmail = localStorage.getItem("userEmail");
const userRole = localStorage.getItem("userRole");

//Check Local Storage (initial)
if (localStorage.getItem("userEmail") == undefined) localStorage.setItem("userEmail", "null");
if (localStorage.getItem("userRole") == undefined) localStorage.setItem("userRole", "null");

//Make sure you don't get sent here
if (sessionStorage.getItem("logout") == 'true') {
  localStorage.setItem("userEmail", null);
  localStorage.setItem("userRole", null);
  sessionStorage.setItem("logout", false);
}
else {
  if (userEmail != null) {
    if (userRole == "user") location.assign('index.html');
    if (userRole == "admin") location.assign('admin.html');
    if (userRole == "dev") location.assign('dev.html');
  }
}

//Get Users
let userJSON;
let userReq = new XMLHttpRequest();
userReq.addEventListener("load", reqListener => {
  usersJSON = JSON.parse(userReq.responseText);
});
userReq.open("GET", "http://localhost:5000/api/db/login/");
userReq.send();

//Check for onclick
async function loginClick(){
  //submitLogin.preventDefault(); //Stops normal behavior

  //Check login info
  const email = emailLogin.value;
  const pass = passwordLogin.value;

  //Verify
  let emailConfirm = false;
  let passwordConfirm = false;
  for (let i = 0; i < usersJSON.length; i++) {
    if (email == usersJSON[i].email)
    {
      emailConfirm = true;
      if (pass == usersJSON[i].password) {
        //Send to proper page
        passwordConfirm = true;
        if (usersJSON[i].role == "user") location.assign('index.html');
        if (usersJSON[i].role == "admin") location.assign('admin.html');
        if (usersJSON[i].role == "dev") location.assign('dev.html');
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userRole", usersJSON[i].role)
        break;
      }
      else {
        break;
      }
    }
  }
  
  //Messages
  if (emailConfirm == false) alert("No user under this email, please try again or register an account.");
  else if (passwordConfirm == false) alert("Incorrect password, please try again.");

}

async function signUpClick(){
  const email = emailSignUp.value;
  const pass = passwordSignUp.value;
  const passVerfiy = passwordVerifySignUp.value;

  //Sign up
  if (email == "") alert("Please enter a valid email.");
  else if (pass == "") alert("Please enter a password.");
  else if (passVerfiy == "") alert("Please re-enter your password.");
  else {
    if (pass == passVerfiy)
    {
      let emailCheck = true;
      for (let i = 0; i < usersJSON.length; i++) {
        if (usersJSON[i].email == email) {
          emailCheck = false;
          break;
        }
      }
      
      if (emailCheck == true) {
        //Data
        const data = 
        {
          email: email,
          password: pass,
          role: "user",
          games: [],
          builds: []
        }
        await fetch("http://localhost:5000/api/db/login", {method: 'POST', body: JSON.stringify(data), headers: {'Accept': 'application/json', 'Content-Type': 'application/json'}})
        .then(function(res){ return res.json(); })
        .then(function(data){
          location.assign('index.html')
          localStorage.setItem("userEmail", data.email);
          localStorage.setItem("userRole", data.role)
        });
      }
      else alert("Account under email already exists.");
    }
    else alert("Passwords do not match. Please try again.");
      
  }
}
