const xmlReq = new XMLHttpRequest();
const userReq = new XMLHttpRequest();
const steamReq = new XMLHttpRequest();
const localReq = new XMLHttpRequest();
const cpuReq = new XMLHttpRequest();
const gpuReq = new XMLHttpRequest();

let cur_db_tab = 'USERS';
let curr_edit_docs = [];

//Load
function load(evt, editType){
  openType(evt, editType);
}

//Switch between tabs
function openType(evt, editType) {
  // let i, tabcontent, tablinks;

  // tabcontent = document.getElementsByClassName("tabcontent");
  // for (i = 0; i < tabcontent.length; i++) {
  //   tabcontent[i].style.display = "none";
  // }

  // tablinks = document.getElementsByClassName("tablinks");
  // for (i = 0; i < tablinks.length; i++) {
  //   tablinks[i].className = tablinks[i].className.replace(" active", "");
  // }

  // document.getElementById(editType).style.display = "block";
  // if (evt != null) evt.currentTarget.className += " active";

  cur_db_tab = editType;

  //Request the first 25 entries from the database for the respectively viewed data
  reqData(editType);
}

function reqData(editType) {
  //Upon data gotten from db, given to callback function reqListner()
  xmlReq.addEventListener("load", reqListener => {

    //xmlReq.responseText sends back a string, can parse it with json.parse()
    const db_results = JSON.parse(xmlReq.responseText);

    if (db_results != null) {
      populateTable(db_results, editType);
    }
  });

  //Lets get the first 25 results of each database so the admin has something to look at upon switching tabs
  //Also change the table title
  let table_title = document.getElementById('table-title');
  switch(editType) {
    case 'USERS':
      table_title.innerText = "Users";
      xmlReq.open("GET", "http://localhost:5000/api/db/login-limit");
      break;

    case 'STEAM':
      table_title.innerText = "Steam Games";
      xmlReq.open("GET", "http://localhost:5000/api/db/games/steam-limit");
      break;

    case 'LOCAL':
      table_title.innerText = "Local Games";
      xmlReq.open("GET", "http://localhost:5000/api/db/games/local-limit");
      break;

    case 'PROCESSOR':
      table_title.innerText = "Processors";
      xmlReq.open("GET", "http://localhost:5000/api/db/hardware/limit/processor");
      break;

    case 'GRAPHICS':
      table_title.innerText = "Graphics Cards";
      xmlReq.open("GET", "http://localhost:5000/api/db/hardware/limit/graphics");
      break;
  }
  xmlReq.send();
}

function populateTable(db_res, editType) {
  let table = '';
  let search_txtbox = document.getElementById("input_searchDb");

  //Reset the list of database elements being edited
  reset_edit_doc_list();

  //Push all database elements to currently editing elements
  db_res.forEach(i => {
    curr_edit_docs.push(i);
  });

  switch (editType) {

    //USERS//
    case 'USERS':
      //Replace the placeholder text in search textbox with appropriate text
      search_txtbox.setAttribute("placeholder", 'Search user via email...')

      //Reset the table so we don't get duplicate entries shown
      reset_table('USERS');

      //Display first 25 entires in database
      db_res.forEach(i => {
        display_data('USERS', i);
      });
      break;

    //STEAM//
    case 'STEAM':
      //Replace the placeholder text in search textbox with appropriate text
      search_txtbox.setAttribute("placeholder", 'Search game via title...')

      //Reset the table so we don't get duplicate entries shown
      reset_table('STEAM');

      //Display first 25 entires in database
      db_res.forEach(i => {
        display_data('STEAM', i);
      });
      break;
    
    //LOCAL GAMES//
    case 'LOCAL':
      //Replace the placeholder text in search textbox with appropriate text
      search_txtbox.setAttribute("placeholder", 'Search game via title...')

      //Reset the table so we don't get duplicate entries shown
      reset_table('LOCAL');

      //Display first 25 entires in database
      db_res.forEach(i => {
        display_data('LOCAL', i);
      });
      break;

    //PROCESSOR//
    case 'PROCESSOR':
      //Replace the placeholder text in search textbox with appropriate text
      search_txtbox.setAttribute("placeholder", 'Search CPU via name...')

      //Reset the table so we don't get duplicate entries shown
      reset_table('PROCESSOR');

      //Display first 25 entires in database
      db_res.forEach(i => {
        display_data('PROCESSOR', i);
      });
      break;

    //GRAPHICS//
    case 'GRAPHICS':
      //Replace the placeholder text in search textbox with appropriate text
      search_txtbox.setAttribute("placeholder", 'Search GPU via name...')

      //Reset the table so we don't get duplicate entires shown
      reset_table('GRAPHICS');

      //Display first 25 entires in database
      db_res.forEach(i => {
        display_data('GRAPHICS', i);
      });
      break;
  }
}

function searchDatabase(evt) {
  let search_input = document.getElementById("input_searchDb").value;

  //Reset list of currently editing database documents
  reset_edit_doc_list();

  switch(cur_db_tab) {
    case 'USERS':

      //Find the user given the email, email is primary key
      //Callback function searchListener() gets fired once the data is found and retrieved
      //(so it will be executed after searchReq.send() gets executed below)
      userReq.addEventListener("load", userListener => {
        const db_results = JSON.parse(userReq.responseText);
        console.log('searchDatabase() userListener fired');

        if (db_results != null) {
          console.log(db_results);

          //Also reset the table's current display
          reset_table('USERS');
          
          //Since email is primary key, each user must have unique email so
          //We only need to display 1 row on the table
          display_data('USERS', db_results);

          //Push currently editing database documents to a list for when we update the database
          curr_edit_docs.push(db_results);
        } 
      });
      userReq.open("GET", `http://localhost:5000/api/db/login/${search_input}`);
      userReq.send();
      break;

    case 'STEAM':
      steamReq.addEventListener("load", steamListener => {
        const db_results = JSON.parse(steamReq.responseText);
        console.log('searchDatabase() steamListener fired');

        if (db_results != null) {
          // console.log(db_results);

          //Reset games table
          reset_table('STEAM');

          //Display result
          display_data('STEAM', db_results);
          curr_edit_docs.push(db_results);
        }
      });
      steamReq.open("GET", `http://localhost:5000/api/db/games/steam/${search_input}`);
      steamReq.send();
      break;

    case 'LOCAL':
      localReq.addEventListener("load", localListener => {
        const db_results = JSON.parse(localReq.responseText);
        console.log('searchDatabase() localListener fired');

        if (db_results != null) {
          // console.log(db_results);

          //Reset games table
          reset_table('LOCAL');

          //Display result
          display_data('LOCAL', db_results);
          curr_edit_docs.push(db_results);
        }
      });
      localReq.open("GET", `http://localhost:5000/api/db/games/local/${search_input}`);
      localReq.send();
      break;

    case 'PROCESSOR':
      cpuReq.addEventListener("load", cpuListener => {
        const db_results = JSON.parse(cpuReq.responseText);
        console.log('searchDatabase() cpuListener fired');

        if (db_results != null) {
          // console.log(db_results);
          
          //Reset processor table
          reset_table('PROCESSOR');

          //Display result
          display_data('PROCESSOR', db_results);
          curr_edit_docs.push(db_results);
        }
      });
      cpuReq.open("GET", `http://localhost:5000/api/db/hardware/processor/${search_input}`);
      cpuReq.send();
      break;

    case 'GRAPHICS':
      gpuReq.addEventListener("load", gpuListener => {
        const db_results = JSON.parse(gpuReq.responseText);
        console.log('searchDatabase() gpuListener fired');

        if (db_results != null) {
          // console.log(db_results);

          //Reset graphics table
          reset_table('GRAPHICS');

          //Display result
          display_data('GRAPHICS', db_results);
          curr_edit_docs.push(db_results);
        }
      });
      gpuReq.open("GET", `http://localhost:5000/api/db/hardware/graphics/${search_input}`);
      gpuReq.send();
      break;
  }
}

function updateDatabase() {
  // console.log(curr_edit_docs);
  if (document.getElementById('create') != null) {
    alert('ERROR: Please use Push Document button to submit new document to database.');
    return;
  }
  else {

    //Pre-declare variable to store the current element being worked on from DOM
    let curr_elem;
    //Different parts of database needs to be updated based on what tab the admin is on
    switch (cur_db_tab) {
      case 'USERS':
        //Loop for every document currently being edited and push changes to database
        curr_edit_docs.forEach(i => {
          curr_elem = document.getElementById(i._id).children;
          // console.log(curr_elem);
          // console.log(curr_elem[0].textContent);
          // console.log(curr_elem[1].textContent);
          // console.log(curr_elem[2].childNodes[1].value);

          //Update password for current document
          //Remember to use the new email, it should be updated by now
          let update_password = new XMLHttpRequest();
          update_password.open("PUT", `http://localhost:5000/api/db/login/password/${i.email}/${curr_elem[1].textContent}`, false);
          update_password.send();

          //Update role for current document
          let update_role = new XMLHttpRequest();
          update_role.open("PUT", `http://localhost:5000/api/db/login/role/${i.email}/${curr_elem[2].childNodes[1].value}`, false);
          update_role.send();
          
          //Update email for current document
          let update_email = new XMLHttpRequest();
          update_email.open("PUT", `http://localhost:5000/api/db/login/email/${i.email}/${curr_elem[0].textContent}`, false);
          update_email.send();
        });
        break;

      case 'STEAM':
        alert('Can not modify games pulled from Steam API');
        break;
      
      case 'LOCAL':
        curr_edit_docs.forEach(i => {
          curr_elem = document.getElementById(i._id).children;
          // console.log(curr_elem);

          let update_local_title = new XMLHttpRequest();
          update_local_title.open("PUT", `http://localhost:5000/api/db/games/local/update/title/${i.appid}/${curr_elem[0].textContent}`, false);
          update_local_title.send();

          let update_local_appid = new XMLHttpRequest();
          update_local_appid.open("PUT", `http://localhost:5000/api/db/games/local/update/appid/${i.appid}/${curr_elem[1].textContent}`, false);
          update_local_appid.send();
        });
        break;

      case 'PROCESSOR':
        curr_edit_docs.forEach(i => {
          curr_elem = document.getElementById(i._id).children;
          // console.log(curr_elem);

          let update_cpu_perf_val = new XMLHttpRequest();
          update_cpu_perf_val.open("PUT", `http://localhost:5000/api/db/hardware/processor/${i.name}/${curr_elem[1].textContent}`, false);
          update_cpu_perf_val.send();
        });
        break;

      case 'GRAPHICS':
        curr_edit_docs.forEach(i => {
          curr_elem = document.getElementById(i._id).children;
          // console.log(curr_elem);

          let update_gpu_perf_val = new XMLHttpRequest();
          update_gpu_perf_val.open("PUT", `http://localhost:5000/api/db/hardware/graphics/${i.name}/${curr_elem[1].textContent}`, false);
          update_gpu_perf_val.send();
        })
        break;
    }
  }
}

function delete_document(elem) {
  let document_info = elem.parentNode.children;
  switch(cur_db_tab) {
    case 'USERS':
      // console.log(document_info[0].textContent);
      // console.log(document_info[1].textContent);
      // console.log(document_info[2].childNodes[1].value);
      let document_email = document_info[0].textContent;

      let delete_user = new XMLHttpRequest();
      delete_user.open("DELETE", `http://localhost:5000/api/db/login/${document_email}`);
      delete_user.send();
      break;

    case 'LOCAL':
      let document_local_appid = document_info[1].textContent;

      let delete_local_game = new XMLHttpRequest();
      delete_local_game.open("DELETE", `http://localhost:5000/api/db/games/local/${document_local_appid}`);
      delete_local_game.send();
      break;
  }
}

function create_document() {
  switch (cur_db_tab) {
    case 'USERS':
      reset_table('USERS');
      display_data('USERS', {_id: "create", email: "", password: "", role: "user", games: [], builds: []});
      break;

    case 'LOCAL':
      reset_table('LOCAL');
      display_data('LOCAL', {_id: "create", name: "", appid: ""});
      break;
  }

  let push_doc_button = document.getElementById("push_document");
  push_doc_button.style.display = "inline";
}

async function push_document(elem) {
  let req_new_doc = new XMLHttpRequest();

  //Check to make sure document fields are filled in
  let elem_new_doc = document.getElementById("create");
  if (elem_new_doc.children[0].textContent == "" || elem_new_doc.children[1].textContent == "") { alert("Please fill in all fields of new document!");}
  else {
    if (cur_db_tab == 'USERS') {
      let email = elem_new_doc.children[0].textContent;
      let password = elem_new_doc.children[1].textContent;
      let role = elem_new_doc.children[2].childNodes[1].value;
      console.log(email + ' ' + password + ' ' + role);

      const data = {
        email: email,
        password: password,
        role: role,
        games: [],
        builds: []
      }

      req_new_doc.open("POST", `http://localhost:5000/api/db/login`);
      await fetch("http://localhost:5000/api/db/login", {method: 'POST', body: JSON.stringify(data), headers: {'Accept': 'application/json', 'Content-Type': 'application/json'}}).then(function(res){ return res.json(); });
    }

    else if (cur_db_tab == 'LOCAL') {
      let title = elem_new_doc.children[0].textContent;
      let gameid = elem_new_doc.children[1].textContent;
      console.log(`${title} ${gameid}`);

      const data = {
        appid: gameid,
        [gameid]: {
          data: {
            name: title,
            appid: gameid,
            about_the_game: 'Not Yet Implemented',
            header_image: 'The Cake is a Lie',
            platforms: {windows: true, mac: false, linux: false },
            pc_requirements: {minimum: 'placeholder', recommended: 'placeholder'},
            mac_requirements: {minimum: 'placeholder', recommended: 'placeholder'},
            linux_requirements: {minimum: 'placeholder', recommended: 'placeholder'}
          }
        }
      }

      req_new_doc.open("POST", `http://localhost:5000/api/db/games/local/${gameid}`);
      await fetch(`http://localhost:5000/api/db/games/local/${gameid}`, {method: 'POST', body: JSON.stringify(data), headers: {'Accept': 'application/json', 'Content-Type': 'application/json'}}).then(function(res){ return res.json(); });
    }
  }
}

//~~~~~~~~~~ HELPER METHODS ~~~~~~~~~~//
function reset_table(table) {
  let create_button = document.getElementById("create_button");

  //Make sure to hide the push_document button in all cases except when creating new document
  let push_doc_button = document.getElementById("push_document");
  push_doc_button.style.display = "none";

  switch (table) {
    case 'USERS':
      table = document.getElementById("table");
      table.innerHTML = `<tr>
                            <th>Email</th>
                            <th>Password</th>
                            <th>Role</th>
                          </tr>`;
      
      create_button.style.display = "inline";
      break;
    
    case 'STEAM':
      table = document.getElementById("table");
      table.innerHTML = `<tr>
                            <th>Game Title</th>
                            <th>App ID</th>
                          </tr>`;

      create_button.style.display = "none";
      break;

    case 'LOCAL':
      table = document.getElementById("table");
      table.innerHTML = `<tr>
                            <th>Game Title</th>
                            <th>App ID</th>
                          </tr>`;

      create_button.style.display = "inline";
      break;

    case 'PROCESSOR':
      table = document.getElementById("table");
      table.innerHTML = `<tr>
                            <th>Processor Name</th>
                            <th>Performance Value</th>
                          </tr>`;

      create_button.style.display = "none";
      break;

    case 'GRAPHICS':
      table = document.getElementById("table");
      table.innerHTML = `<tr>
                            <th>Graphics Card Name</th>
                            <th>Performance Value</th>
                          </tr>`;

      create_button.style.display = "none";
      break;
  }
}

function reset_edit_doc_list() {
  while (curr_edit_docs.length != 0) { curr_edit_docs.pop(); }
}

function display_data(table, data) {
  // console.log(data);

  let new_element = document.createElement("tr");
  new_element.setAttribute("id", `${data._id}`);
  new_element.setAttribute("class", "row_dbData");

  switch (table) {
    case 'USERS':

        //Need different role selected based on what the account's role is
        let html_usr_role = ``;
        switch (data.role) {
          case 'user':
            html_usr_role = `<td contenteditable="false">
                              <select>
                                <option selected>user</option>
                                <option>dev</option>
                                <option>admin</option>
                              </select>
                            </td>`;
            break;
          
          case 'dev':
            html_usr_role = `<td contenteditable="false">
                              <select>
                                <option>user</option>
                                <option selected>dev</option>
                                <option>admin</option>
                              </select>
                            </td>`;
            break;

          case 'admin':
            html_usr_role = `<td contenteditable="false">
                              <select>
                                <option>user</option>
                                <option>dev</option>
                                <option selected>admin</option>
                              </select>
                            </td>`;
            break;
        }

        new_element.innerHTML = `<td contenteditable="true">${data.email}</td>
                                <td contenteditable="true">${data.password}</td>` + html_usr_role +
                                `<button onclick="delete_document(this)">DELETE</button>`;
        document.getElementById("table").appendChild(new_element);
      break;

    case 'STEAM':
        new_element.innerHTML = `<td contenteditable="true">${data.name}</td>
                                <td contenteditable="true">${data.appid}</td>`;
        document.getElementById("table").appendChild(new_element);
      break;

    case 'LOCAL':
        new_element.innerHTML = `<td contenteditable="true">${data.name}</td>
                                <td contenteditable="true">${data.appid}</td>
                                <button onclick="delete_document(this)">DELETE</button>`;
        document.getElementById("table").appendChild(new_element);
      break;

    case 'PROCESSOR':
        new_element.innerHTML = `<td contenteditable="false">${data.name}</td>
                                <td contenteditable="true">${data.value}</td>`;

        document.getElementById("table").appendChild(new_element);
      break;

    case 'GRAPHICS':
        new_element.innerHTML = `<td contenteditable="false">${data.name}</td>
                                <td contenteditable="true">${data.value}</td>`;

        document.getElementById("table").appendChild(new_element);
      break;
  }
}
