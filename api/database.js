const mongoClient = require('mongodb');
const express = require('express');
const router = express.Router();
const conn = require('./conn.js');
const { addListener } = require('nodemon');
conn.connectToServer();

//API Functions
//List Databases
router.get('/', async (req, res) => {
    const json = await listDatabases(conn.getDb());
    res.json(json);
});

////* LOGIN *////
//Get User Login
router.get('/login/:email', async (req, res) => {
    const result = await conn.getDb().db('loginData').collection('user').findOne({email: req.params.email});
    if (result == undefined) return res.status(400).send("No user under that email found");
    else res.json(result);
});

//Get all Users
router.get('/login', async (req, res) => {
    const result = await conn.getDb().db('loginData').collection('user').find({}).toArray(function(err, arr){
        if (err) throw err;
        if (arr == null) return res.status(400).send("No users found");
        else res.json(arr);
    });
});

//Get first 25 Users
router.get('/login-limit', async (req, res) => {
    const result = await conn.getDb().db('loginData').collection('user').find({}).limit(25).toArray(function(err, arr){
        if (err) throw err;
        if (arr == null) return res.status(400).send("No users found");
        else res.json(arr);
    });
});

//Add New Login
router.post('/login', async (req, res) => {
    if (await createLogin(conn.getDb(), req.body) == false) {
        return res.status(400).send("User with same email already in database.");
    }
    else res.send(req.body);
});

//Delete Login
router.delete('/login/:email', async (req, res) => {
    if (await deleteLogin(conn.getDb(), req.params.email) == false) {
        return res.status(400).send("No user with that email in database.");
    }
    else res.send("User deleted");
});

//Update Email
router.put('/login/email/:email/:newEmail', async (req, res) => {
    if (await updateUserEmail(conn.getDb(), req.params.email, req.params.newEmail) == false) {
        return res.status(400).send("No user under that email found");
    }
    else {
        res.send("User " + req.params.email + " email changed to " + req.params.newEmail)
    }
});

//Update Password
router.put('/login/password/:email/:newPassword', async (req, res) => {
    if (await updateUserPassword(conn.getDb(), req.params.email, req.params.newPassword) == false) {
        return res.status(400).send("No user under that email found");
    }
    else {
        res.send("User " + req.params.email + " password changed.");
    }
});

//Update Role
router.put('/login/role/:email/:newRole', async (req, res) => {
    if (await updateUserRole(conn.getDb(), req.params.email, req.params.newRole) == false) {
        return res.status(400).send("No user under that email found");
    }
    else {
        res.send("User " + req.params.email + " role changed to " + req.params.newRole)
    }
});

//Update Builds
router.post('/login/build/:email', async (req, res) => {
    if (await updateUserBuilds(conn.getDb(), req.params.email, req.body) == false) {
        return res.status(400).send("No user under that email found");
    }
    else {
        res.send("Developer " + req.params.email + " games updated.");
    }
});


////* DEVEOPER *////
//Update Dev Games
router.put('/dev/:email/:appID', async (req, res) => {
    if (await addDeveloperGames(conn.getDb(), req.params.email, req.params.appID) == false) {
        return res.status(400).send("No user under that email found");
    }
    else {
        res.send("Developer " + req.params.email + " games updated.");
    }
});

////* HARDWARE *////
//Get all hardware
router.get('/hardware/:type', async (req, res) => {
    if (req.params.type == 'prebuilt') {
        const result = await conn.getDb().db('hardware').collection('prebuilts').find({}).toArray(function(err, arr){
            if (err) throw err;
            if (arr == null) return res.status(400).send("No prebuilts found");
            else res.json(arr);
        });
    }
    else {
        const result = await conn.getDb().db('hardware').collection(req.params.type).find({}).toArray(function(err, arr){
            if (err) throw err;
            if (arr == null) return res.status(400).send("No hardware found");
            else res.json(arr);
        });
    }
    
});

//Get first 25 hardware
router.get('/hardware/limit/:type', async (req, res) => {
    const result = await conn.getDb().db('hardware').collection(req.params.type).find({}).limit(25).toArray(function(err, arr){
        if (err) throw err;
        if (arr == null) return res.status(400).send("No hardware found");
        else res.json(arr);
    });
});

//Get One Hardware
router.get('/hardware/:type/:name', async (req, res) => {
    if (req.params.type == 'prebuilt') {
        const result = await conn.getDb().db('hardware').collection('prebuilts').findOne({id: req.params.name});
        if (result == undefined) return res.status(400).send("No prebuilt with ID");
        else res.json(result);
    }
    else {
        const result = await conn.getDb().db('hardware').collection(req.params.type).findOne({name: req.params.name});
        if (result == undefined) return res.status(400).send("No hardware with name");
        else res.json(result);
    }
    
});

//Add Hardware
router.post('/hardware/:type', async (req, res) => {
    if (req.params.type == 'prebuilt') {
        if (await addPrebuilt(conn.getDb(), req.body) == false) {
            return res.status(400).send("Prebuilt with same id already in database");
        }
        else res.send(req.body);
    }
    else {
        if (await addHardware(conn.getDb(), req.params.type, req.body) == false) {
            return res.status(400).send("Hardware with the same name already in database.");
        }
        else res.send(req.body);
    }
});

//Delete Processor
router.delete('/hardware/:type/:name', async (req, res) => {
    if (await deleteHardware(conn.getDb(), req.params.type, req.params.name) == false) {
        return res.status(400).send("No hardware with name in database.");
    }
    else res.send("Hardware deleted");
});

//Update Hardware Value
router.put('/hardware/:type/:name/:newValue', async (req, res) => {
    if (await updateHardwareValue(conn.getDb(), req.params.type, req.params.name, req.params.newValue) == false) {
        return res.status(400).send("No hardware under that name found");
    }
    else {
        res.send("Hardware value updated.");
    }
});

////* GAMES *////
//Get list of all steam games
router.get('/games/steam', async (req, res) => {
    const result = await conn.getDb().db('gameList').collection('steamGameList').find({}).toArray(function(err, arr){
        if (err) throw err;
        if (arr == null) return res.status(400).send("No steam games found");
        else res.json(arr);
    });
});

//Get lsiting of steam game via appID
router.get('/games/steam/list/:appID', async (req, res) => {
    const result = await conn.getDb().db('gameList').collection('steamGameList').findOne({appid: parseInt(req.params.appID)});
    console.log(result);
    if (result != undefined) {
        res.json(result);
        console.log("Steam Listing found")
    }
    else {
        res.status(400).send("No steam games found");
        console.log("No steam listing under that ID found")
        return false;
    }
});

//Get lsiting of local game via appID
router.get('/games/local/list/:appID', async (req, res) => {
    const result = await conn.getDb().db('gameList').collection('localGameList').findOne({appid: req.params.appID});
    console.log(result);
    if (result != undefined) {
        res.json(result);
        console.log("Local Listing found")
    }
    else {
        res.status(400).send("No local games found");
        console.log("No lcoal listing under that ID found")
        return false;
    }
});

//Get first 25 steam games
router.get('/games/steam-limit', async (req, res) => {
    const result = await conn.getDb().db('gameList').collection('steamGameList').find({}).limit(25).toArray(function(err, arr){
        if (err) throw err;
        if (arr == null) return res.status(400).send("No steam games found");
        else res.json(arr);
    });
});

//Get list of all local games
router.get('/games/local', async (req, res) => {
    const result = await conn.getDb().db('gameList').collection('localGameList').find({}).toArray(function(err, arr){
        if (err) throw err;
        if (arr == null) return res.status(400).send("No local games found");
        else res.json(arr);
    });
});

//Get first 25 local games
router.get('/games/local-limit', async (req, res) => {
    const result = await conn.getDb().db('gameList').collection('localGameList').find({}).limit(25).toArray(function(err, arr){
        if (err) throw err;
        if (arr == null) return res.status(400).send("No local games found");
        else res.json(arr);
    });
});

//Find one steam game via appID
// router.get('/games/steam/:appID', async (req, res) => {
//     const result = await conn.getDb().db('gameList').collection('steamGameList').findOne({appID: req.params.appID});
//     if (result == undefined) return res.status(400).send(`No steam game found with appID ${req.params.appID}`);
//     else res.json(result);
// });

//Find one steam game via name
router.get('/games/steam/:name', async (req, res) => {
    const result = await conn.getDb().db('gameList').collection('steamGameList').findOne({name: req.params.name});
    if (result == undefined) return res.status(400).send(`No steam game found with name ${req.params.name}`);
    else res.json(result);
});

//Find one local game via appID

//Find one local game via name
router.get('/games/local/:name', async (req, res) => {
    const result = await conn.getDb().db('gameList').collection('localGameList').findOne({name: req.params.name});
    if (result == undefined) return res.status(400).send(`No local game found with name ${req.params.name}`);
    else res.json(result);
});

//Add local game
router.post('/games/local/:appID', async (req, res) => {
    if (await addLocalGame(conn.getDb(), req.params.appID, req.body) == false) {
        return res.status(400).send("Local game with same ID already in database");
    }
    else res.send(req.body);
});

//Remove local game
router.delete('/games/local/:appID', async (req, res) => {
    if (await removeLocalGame(conn.getDb(), req.params.appID) == false) {
        return res.status(400).send("No game with ID in database.");
    }
    else res.send("Game deleted");
});

//Update local game title
router.put('/games/local/update/title/:appID/:newTitle', async (req, res) => {
    if (await updateLocalTitle(conn.getDb(), req.params.appID, req.params.newTitle) == false) {
        return res.status(400).send(`No Local Game under appID: ${req.params.appID} found`);
    }
    else {
        res.send(`Local Game AppID: ${req.params.appID} title changed to ${req.params.newTitle}`);
    }
});

// router.post('/games/local/update/:appID/:title', async (req, res) => {
//     if (await updateLocalGame(conn.getDb(), req.params.appID, req.body) == false) {
//         return res.status(400).send("No local game with ID.");
//     }
//     else res.send(req.body);
// });

//Update local game appID
router.put('/games/local/update/appid/:appID/:newAppID', async (req, res) => {
    if (await updateLocalAppID(conn.getDb(), req.params.appID, req.params.newAppID) == false) {
        return res.status(400).send(`No Local Game under appID: ${req.params.appID} found`);
    }
    else {
        res.send(`Local Game AppID: ${req.params.appID} changed to ${req.params.newAppID}`);
    }
});


//Add Hardware Impression to Game
router.get('/games/:type/:appID/:hardwareName/', async (req, res) => {
    if (await updateHardwareImpressions(conn.getDb(), req.params.type, req.params.appID, req.params.hardwareName) == false) {
        return res.status(400).send("No games under that appID found");
    }
    else {
        console.log("Hardware impressions updated");
        res.send("Updated Impressions")
    }
});

//Add Webiste Impression to Game
router.get('/games/:appID/', async (req, res) => {
    if (await updateGameImpressions(conn.getDb(), req.params.appID) == false) {
        return res.status(400).send("No games under that appID found");
    }
    else {
        console.log("Game impressions updated");
        res.send("Updated Impressions")
    }
});

//MongoDB Database Functions//
//List Databases
async function listDatabases(client) {
    const databaseList = await client.db().admin().listDatabases();
    return databaseList.databases;
}

//Create Login
async function createLogin(client, data) {
    //Check for same email.
    const email = data['email'];
    const check = await client.db('loginData').collection('user').findOne({email: email});
    if (check == undefined) {
        //Create Login
        /*
        const newLogin = {
            email: email,
            password: password,
            role: role,
            games: []
        };
        */

        //Add
        await client.db('loginData').collection('user').insertOne(data);
        console.log("New Login Added for user " + email);
        return true;
    }
    else {
        console.log("User with same email already in database.");
        return false;
    }
}

//Delete Login
async function deleteLogin(client, email) {
    const check = await client.db('loginData').collection('user').findOne({email: email});
    if (check != undefined) {
        await client.db('loginData').collection('user').deleteOne({email: email});
        console.log("Login with email " + email + "was deleted.");
        return true;
    }
    else {
        console.log("No login with email " + email +" found.");
        return false;
    }
}

//Update role
async function updateUserRole(client, userEmail, newRole) {
    const check = await client.db('loginData').collection('user').findOne({email: userEmail});
    if (check) {
        await client.db('loginData').collection('user').updateOne({email: userEmail}, {$set: {role: newRole}});
        console.log("User " + userEmail + " role changed from " + check.role + " to " + newRole);
        return true;
    }
    else {
        console.log("No user under that email found");
        return false;
    }
}

//Update Password
async function updateUserPassword(client, userEmail, newPassword) {
    const check = await client.db('loginData').collection('user').findOne({email: userEmail});
    if (check) {
        await client.db('loginData').collection('user').updateOne({email: userEmail}, {$set: {password: newPassword}});
        console.log("User " + userEmail + " password changed.");
        return true;
    }
    else {
        console.log("No user under that email found");
        return false;
    }
}

//Update Email 
async function updateUserEmail(client, userEmail, newEmail) {
    const check = await client.db('loginData').collection('user').findOne({email: userEmail});
    if (check) {
        await client.db('loginData').collection('user').updateOne({email: userEmail}, {$set: {email: newEmail}});
        console.log("User " + userEmail + "email changed to " + newEmail);
        return true;
    }
    else {
        console.log("No user under " + userEmail + " found");
        return false;
    }
}

//Update Builds
async function updateUserBuilds(client, userEmail, data) {
    const check = await client.db('loginData').collection('user').findOne({email: userEmail});
    if (check) {
        await client.db('loginData').collection('user').updateOne({email: userEmail}, {$set: {builds: data}});
        console.log(data);
        console.log("User builds updated");
        return true;
    }
    else {
        console.log("No user under " + userEmail + " found");
        return false;
    }
}

//Add associated games to Game Developers
async function addDeveloperGames(client, userEmail, data){
    //Get data
    if (data.substring(0, 1) != "0") data = parseInt(data);
    const user = await client.db('loginData').collection('user').findOne({email: userEmail});
    if (user) {
        //user.games.push(appID);
        await client.db('loginData').collection('user').updateOne({email: userEmail}, {$push: {games: data}});
        console.log("Games for developer " + userEmail + " has been updated.");
        return true;
    }
    else {
        console.log("No developer under email " + userEmail + " found.");
        return false;
    }
}

//Remove an associated game from Game Developer (not used)
async function removeDeveloperGames(client, userEmail, appID){
    const user = await client.db('loginData').collection('user').findOne({email: userEmail}, {role: "dev"});
    if (user) {
        let d = false;
        for (let i = -1; i < user.games.length; i++) {
            if (d == false) {
                if (user.games[i] == appID) {
                    user.games[i] = undefined;
                    d = true;
                }
            }
            else {
                user.games[i-2] = user.games[i];
            }       
        }
        if (d == true) {
            user.games.pop();
            console.log("Game with ID " + appID + " was removed from developer " + userEmail);
        } 
        else console.log("Game with ID " + appID + " was not found in developer " + userEmail);
        await client.db('loginData').collection('user').updateOne({email: userEmail}, {$set: {games: user.games}});
        
        return true;
    }
    else {
        console.log("No developer under email " + userEmail + " found.");
        return false;
    }
}

//Update Comparator Value
async function updateHardwareValue(client, collection, hardwareName, newValue) {
    const check = await client.db('hardware').collection(collection).findOne({name: hardwareName});
    if (check != undefined)
    {
        await client.db('hardware').collection(collection).updateOne({name: hardwareName}, {$set: {value: newValue}});
        console.log("Value of hardware " + hardwareName + " set to " + newValue);
        return true;
    }
    else {
        console.log("No hardware with the name " + hardwareName + " was found.");
        return false;
    }
}

//Add New Hardware 
async function addHardware(client, collection, data) {
    const check = await client.db('hardware').collection(collection).findOne({name: data["name"]});
    if (check == undefined) {
        //const data = {name: hardwareName, value: value}
        await client.db('hardware').collection(collection).insertOne(data);
        console.log("Hardware with the name " + data["name"] + " added to database with value " + data["value"]);
        return true;
    }
    else {
        console.log("Hardware with the name " + data["name"] + " already in database.");
        return false;
    }
     
}

//Delete Hardware
async function deleteHardware(client, collection, hardwareName) {
    const check = await client.db('hardware').collection(collection).findOne({name: hardwareName});
    if (check != undefined) {
        await client.db('hardware').collection(collection).deleteOne({name: hardwareName});
        console.log("Hardware with the name " + hardwareName + " was deleted from the database.");
        return true;
    } 
    else {
        console.log("No hardware with the name " + hardwareName + " was found.");
        return false;
    }
}

//Add Prebuilt
async function addPrebuilt(client, data) {
    const check = await client.db('hardware').collection('prebuilts').findOne({id: data["id"]});
    if (check == undefined) {
        //const data = {name: hardwareName, value: value}
        await client.db('hardware').collection('prebuilts').insertOne(data);
        console.log("Prebuilt added");
        return true;
    }
    else {
        console.log("Prebuilt with same ID already in database");
        return false;
    }
     
}

//Add Hardware Impressions
async function updateHardwareImpressions(client, collection, appID, hardwareName, newValue) {
    //Get right list
    if (await client.db('gameList').collection('localGameList').findOne({appid: appID}) != undefined) {
        const str = collection+"."+hardwareName;
        await client.db('gameList').collection('localGameList').updateOne({appid: appID}, {$inc: {[str]: 1}});
        console.log("Value of hardware " + hardwareName + " set to " + newValue);
        return true;
    }
    else {
        if (await client.db('gameList').collection('steamGameList').findOne({appid: parseInt(appID)}) != undefined) {
            const str = collection+"."+hardwareName;
            await client.db('gameList').collection('steamGameList').updateOne({appid: parseInt(appID)}, {$inc: {[str]: 1}});
            console.log("Value of hardware " + hardwareName + " set to " + newValue);
            return true;
        }
        else {
            console.log("No game with the appID found.");
            return false;
        }
    }
}

//Add Game Impressions
async function updateGameImpressions(client, appID) {
    //Get right list
    if (await client.db('gameList').collection('localGameList').findOne({appid: appID}) != undefined) {
        await client.db('gameList').collection('localGameList').updateOne({appid: appID}, {$inc: {impressions: 1}});
        console.log("Local Gmae Impression Incremented");
        return true;
    }
    else {
        if (await client.db('gameList').collection('steamGameList').findOne({appid: parseInt(appID)}) != undefined) {
            await client.db('gameList').collection('steamGameList').updateOne({appid: parseInt(appID)}, {$inc: {impressions: 1}});
            console.log("Game Impression Incremented");
            return true;
        }
        else {
            console.log("No game with the appID found.");
            return false;
        }
    }
}

//Add Game to List
async function addGameList(client, gameName, appID) {
    const check = await client.db('gameList').collection('localGameList').findOne({appid: appID});
    if (check == undefined) {
        const data = {
            appid: appID,
            name: gameName
        }
        await client.db('gameList').collection('localGameList').insertOne(data);
        console.log(gameName + " added to local game list.");
        return true;
    }
    else {
        console.log("A game with this ID already exists.");
        return false;
    }

}

//Add Local Game (for id, use rc12...)
async function addLocalGame(client, appID, data) {
    /*
    const data = {
        appid: appID
        [appID]: {
            name: gameName,
            appid: appID,
            about_the_game: gameDesc,
            header_image: gameImage,
            platforms: {windows: windows, mac: mac, linux: linux},
            pc_requirements: {minimum: windowsMin, recommended: windowsRec},
            mac_requirements: {minimum: macMin, recommended: macRec},
            linux_requirements: {minimum: linuxMin, recommended: linuxRec}
        }
    }
    */
    
    // console.log(data);
    if (await addGameList(client, data[appID].data.name, data[appID].data.appid) == true) {
        await client.db('gameList').collection('localGames').insertOne(data);
        console.log("Added requirement page data for " + data[appID].name);
        return true;
    }
    else return false;

}

//Remove local game
async function removeLocalGame(client, appID) {
    const check = await client.db('gameList').collection('localGameList').findOne({appid: appID});
    if (check == undefined) {
        console.log("No game with appID " + appID + "found.");
        return false;
    }
    else {
        await client.db('gameList').collection('localGameList').deleteOne({appid: appID});
        await client.db('gameList').collection('localGames').deleteOne({appid: appID});
        console.log("Game with the appID " + appID + " was deleted from the database.");
    }
}

//Update Local game
async function updateLocalGame(client, appID, data) {
    const check = await client.db('gameList').collection('localGameList').findOne({appid: appID});
    if (check == undefined) {
        console.log("No game with appID " + appID + "found.");
        return false;
    }
    else {
        await client.db('gameList').collection('localGameList').updateOne({appid: appID}, {$set: {name: data[appID].name}});
        await client.db('gameList').collection('localGames').updateOne({appid: appID}, {$set: data});
        console.log("Updated requirement page data for " + data[appID].name);
    }
}

//Update Local game title
async function updateLocalTitle(client, appID, title) {
    const check = await client.db('gameList').collection('localGameList').findOne({appid: appID});
    if (check) {
        let path = `${appID}.name`;
        await client.db('gameList').collection('localGameList').updateOne({appid: appID}, {$set: {name: title}});
        await client.db('gameList').collection('localGames').updateOne({appid: appID}, {$set: {[path]: title}});
        console.log(`Local Game: ${appID} name changed from ${check.name} to ${title}`);
        return true;
    }
    else {
        console.log(`No Local Game found under appid: ${appID}`);
        return false;
    }
}

//Update Local game appid
async function updateLocalAppID(client, appID, newID) {
    const check = await client.db('gameList').collection('localGameList').findOne({appid: appID});
    if (check) {
        console.log(appID);
        let path = `${appID}.appid`;
        await client.db('gameList').collection('localGames').updateOne({appid: appID}, {$set: {[path]: newID, appid: newID}});
        await client.db('gameList').collection('localGames').updateOne({appid: newID}, {$rename: {[appID]: newID}});
        await client.db('gameList').collection('localGameList').updateOne({appid: appID}, {$set: {appid: newID}});
        console.log(`Local Game: ${check.appid} appid changed from ${check.appid} to ${newID}`);
        //{ $rename: { "name.first": "name.fname" } } )
        return true;
    }
    else {
        console.log(`No Local Game found under appid: ${appID}`);
        return false;
    }
}

//Make Requirements right format 
async function formatRequirement(min, cpu, memory, gpu, storage, extra) {
    let requirement = '';

    //Type
    if (min) requirement += '<strong>Minimum:</strong><br>';
    else requirement += '<strong>Recommended:</strong>';

    //Parts
    requirement += `<li><strong>Processor:</strong> ${cpu}<br></li>`;
    requirement += `<li><strong>Memory:</strong> ${memory}<br></li>`;
    requirement += `<li><strong>Graphics:</strong> ${gpu}<br></li>`;
    requirement += `<li><strong>Storage:</strong> ${storage}<br></li>`;
    if (extra != undefined) requirement += `<li><strong>Additional Notes:</strong> ${extra}<br></li>`;
    return requirement;
}



module.exports = router;