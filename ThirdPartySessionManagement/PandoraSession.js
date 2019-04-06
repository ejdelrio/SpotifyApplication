"use strict";

const Session = require("./Session");

class PandoraSession extends Session
{
    constructor()
    {
        super(PandoraSession.constructor.name);
    }
}

module.exports = Object.freeze(new PandoraSession());