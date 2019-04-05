"use strict";

const Session = require("./Session");

// Private variables;

var accessToken;
var refreshToken;
var lastRefresh;
var lastValidityCheck;

/*
 * Singleton instance that maintains a valid session with an external spotify API
 * 
 * - Notes :
 *  Maintains an access token for validating API calls and a refresh token for requesting a new access token
 *  when the current one expires
 * 
 */
class SpotifySession extends Session
{
    constructor(_refreshToken)
    {
        super();
        refreshToken = _refreshToken;
    }

    /*
     * Access token that allows API calls to Spotify API.
     */
    get AccessToken() { return accessToken; }

    RequestNewAccessToken()
    {

    }


    VerifyAccessTokenIsStillValid()
    {

    }
}

module.exports = new SpotifySession();