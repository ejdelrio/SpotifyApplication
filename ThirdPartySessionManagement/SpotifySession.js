"use strict";

const request = require("request");
const Session = require("./Session");
const ConfigurationManager = require("../Util/ConfigurationManager");
const spotifyAddress = "https://accounts.spotify.com/api/token";
const refreshTokenConfigurationName = "SPOTIFY_REFRESH_TOKEN";
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
    var requestBody;
    var header;
    var form;
    var base64EncodedSecret;

    base64EncodedSecret = new Buffer(`${clientId}:${clientSecret}`);
    header = new Object();
    header.Authorization = base64EncodedSecret;

    form = new Object();
    form.grant_type = "refresh_token";
    form.refresh_token = refreshToken;

    requestBody = new Object();
    requestBody.header = header;
    requestBody.form = form;
    requestBody.json = true;
    requestBody.url = spotifyAddress;

    return requestBody;
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
        refreshToken = ConfigurationManager.GetValueWithThrow(refreshTokenConfigurationName);
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

    RequestNewAccessToken()
    {
        if (currentRefreshOperation !== null && currentRefreshOperation !== undefined)
        {
            return currentRefreshOperation;
        }

        currentRefreshOperation = new Promise((resolve, reject) => request.post(GenerateRequestBody(), HandleRefreshTokenResponse(resolve, reject)));
        return currentRefreshOperation;
    }
}

module.exports = Object.freeze(new SpotifySession());