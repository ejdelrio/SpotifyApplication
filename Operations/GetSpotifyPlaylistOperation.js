"use strict";

const Operation = require("./Operation");
const SessionManager = require("../ThirdPartySessionManagement/SessionManager");
const operationEndpoint = "/api/playlist/:playlistId"

//=================================================
// Private variables

var playlistId;
var userId;

// End private variables
// ================================================

// ================================================
// Private methods

function ValidateRequestParameters(request, operationInstance)
{

}

// End private methods
// ===============================================

class GetSpotifyPlaylistOperation extends Operation
{
    constructor()
    {
        super();
    }

    get Endpoint() { return new String(operationEndpoint); }

    Invoke(request, response, next)
    {
        console.log("Entering GetSpotifyPlaylistOperation");
    }
}

module.exports = new GetSpotifyPlaylistOperation();