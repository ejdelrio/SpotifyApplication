"use strict";

/*
 * Consolidates the various singleton instances that manage interactions with thrid party APIs 
 */
class SessionManager
{
    static get SpotifySession() { return require("./SpotifySession"); }

    static get PandoraSession() { return require("./PandoraSession")}
}

module.exports = SessionManager;