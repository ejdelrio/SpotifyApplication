"use strict";

// Session Imports
const SpotifySession = require("./SpotifySession");
const PandoraSession = require("./PandoraSession");

/*
 * Consolidates the various singleton instances that manage interactions with thrid party APIs 
 */
class SessionManager
{
    static get SpotifySession() { return SpotifySession; }

    static get PandoraSession() { return PandoraSession; }
}

module.exports = SessionManager;