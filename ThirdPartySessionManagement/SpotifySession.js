"use strict";

const request = require("request");
const Session = require("./Session");
const ConfigurationManager = require("../Util/ConfigurationManager");
const spotifyAddress = "https://accounts.spotify.com/api/token";
const clientIdConfigurationName = "SPOTIFY_CLIENT_ID";
const secretConfigurationName = "SPOTIFY_CLIENT_SECRET";

//=========================================================
//Private variables;
var accessToken;
var refreshToken;
var clientId;
var clientSecret;
var lastRefresh;
var currentRefreshOperation;
var currentValidationOperation;
var currentTokenLifespan;
// End private variables
//=========================================================

//=========================================================
// Private functions
function GenerateRequestBody()
{
    var base64EncodedSecret = new Buffer(`${clientId}:${clientSecret}`).toString("base64");

    return {
        url: spotifyAddress,
        headers: { 'Authorization': 'Basic ' + base64EncodedSecret },
        form: {
            grant_type: 'client_credentials',
        },
        json: true
    };
}

function HandleRefreshTokenResponse(resolve, reject)
{
    return function (error, response, body)
    {
        if (error)
        {
            currentRefreshOperation = null;
            return reject(error);
        }

        if (body.error)
        {
            currentRefreshOperation = null;
            return reject(body.error);
        }

        if (response.statusCode === 200)
        {
            accessToken = body.access_token;
            currentTokenLifespan = body.expires_in;
            lastRefresh = Date.now();
            currentRefreshOperation = null;

            return resolve(accessToken);
        }

        currentRefreshOperation = null;
        return reject(new Error("The remote service returned an unexpected response."));
    };
}

function RequestNewAccessToken()
{
    if (currentRefreshOperation !== null && currentRefreshOperation !== undefined)
    {
        return currentRefreshOperation;
    }

    currentRefreshOperation = new Promise((resolve, reject) => request.post(GenerateRequestBody(), HandleRefreshTokenResponse(resolve, reject)));
    return currentRefreshOperation;
}
// END private functions
//==============================================

/*
 * Singleton instance that maintains a valid session with an external spotify API
 * 
 * - Notes :
 *  Maintains an access token for validating API calls and a refresh token for requesting a new access token
 *  when the current one expires. The singleton will prevent additional refresh / validation calls if a current one is in porgress.
 */
class SpotifySession extends Session
{
    constructor()
    {
        super(SpotifySession.constructor.name);
        clientId = ConfigurationManager.GetValueWithThrow(clientIdConfigurationName);
        clientSecret = ConfigurationManager.GetValueWithThrow(secretConfigurationName);
        currentRefreshOperation = null;
        currentValidationOperation = null;
    }

    // Access token that allows API calls to Spotify API.
    get AccessToken() { return new String(accessToken); }

    // Lock to prevent multiple refreshes at the same time
    get IsCurrentlyRefreshing() { return currentRefreshOperation !== null; }

    get IsTokenStillValid()
    {
        var secondsSinceLastRefresh;

        if (this.IsStringNullOrWhiteSpace(accessToken))
        {
            return false;
        }

        secondsSinceLastRefresh = Math.abs(Date.now() - lastRefresh) / 1000;
        return secondsSinceLastRefresh >= currentTokenLifespan;
    }

    PrevalidateApiCall()
    {
        if (this.IsTokenStillValid)
        {
            return Promise.resolve(accessToken);
        }

        return RequestNewAccessToken();
    }

}

module.exports = Object.freeze(new SpotifySession());