const http = require('http');
const https = require('https');
const path = require('path');
const fs = require('fs');
const url = require('url');
const express = require('express');
const conn = require('./api/conn.js');

//const db = require('./api/database.js');
const app = express();

//Server
console.log(path.join(__dirname, 'css'));
app.use(express.static(path.join(__dirname, 'pages')));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Server running on port ' + PORT))

//Database API
//db.database();
app.use(express.json()) //Use Body Parser for JSON Post requests
app.use(express.urlencoded({extended: false})); //Allows use of url encoded data
app.use('/api/db', require('./api/database.js'))

//Game List JSON//
app.get('/data/gameList4-9-22.json', (req, res) => {
    res.sendFile(path.join(__dirname, '/data', 'gameList4-9-22.json'));
});

//SteamAPI//
app.get('/api/steam/:appID', async (req, res) => {
    //Connect
    conn.connectToServer();
    const appID = req.params.appID;
    
    //Check for non steam game first
    const check = await conn.getDb().db('gameList').collection('localGameList').findOne({appid: appID});
    console.log(appID);
    if (check == null) { //Get steam game
        //Get JSON
        console.log("Incoming SteamAPI Request for ID: " + appID);

        https.get(`https://store.steampowered.com/api/appdetails/?appids=${appID}&l=english`, (resp) => {
            let body = "";
            resp.on("data", (chunk) => {
                body += chunk;
            });

            resp.on("end", () => {
                try {
                    let json = JSON.parse(body);
                    res.end(JSON.stringify(json));
                } catch (error) {
                    console.error(error.message);
                };
            });

            }).on("error", (error) => {
                console.error(error.message);
        });
    }
    else {
        //Get non steam game
        console.log("Responded local game");
        const result = await conn.getDb().db('gameList').collection('localGames').findOne({appid: appID});
        console.log(result);
        res.json(result);
    }
});