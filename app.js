'use strict';

require("dotenv").config();
const Express = require("express");
const app = new Express();
const port = process.env.SERVER_PORT || 3000;
const GetSpotifyPlaylistOperation = require("./Operations/GetSpotifyPlaylistOperation");
var op = new GetSpotifyPlaylistOperation();
var x = new Express.Router();
x.get(GetSpotifyPlaylistOperation.Endpoint, op.Invoke);
function onListen()
{
    console.log("Server active on port : ", port);
}

app.use(x);
app.listen(port, onListen);


