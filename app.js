'use strict';

const Express = require("express");
const app = new Express();
const port = process.env.PORT || 3000;

function onListen()
{
    console.log("Server active on port : ", port);
}

app.listen(port, onListen);
