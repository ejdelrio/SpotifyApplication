"use strict";

const request = require("request");
const Session = require("./Session");
const OperationLock = require("../Operations/OperationLock");
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
var lastValidityCheck;
var refreshLock;
var validationLock;
// End private variables
//=========================================================

//=========================================================
// Private functions

// Waits for a lock to be released before returning a resolved project. Rejects if the lock is not released in 10 seconds
function WaitForOperationCompletness(lockValue)
{
    const maximumRetries = 5;
    var currentRetryCount;
    var intervalId;

    return new Promise((resolve, reject) =>
    {
        currentRetryCount = 1;
        intervalId = setInterval(() =>
        {
            if (currentRetryCount >= maximumRetries)
            {
                clearInterval(intervalId);
                reject("Wait for spotify API response timed out.");
            }

            if (!lockValue.isLocked)
            {
                clearInterval(intervalId);
                resolve();
            }

            currentRetryCount++;
        },
        2000); // Wait 2 seconds before checking again
    });
}

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

function HandleRemoteServiceResponse(resolve, reject)
{
    return function (error, response, body)
    {
        if (error)
        {
            refreshLock.isLocked = false;
            return reject(error);
        }

        if (body.error)
        {
            refreshLock.isLocked = false;
            return reject(body.error)
        }

        if (response.statusCode === 200)
        {
            accessToken = body.access_token;
            refreshLock.isLocked = false;
            lastRefresh = Date.now();
            return resolve(accessToken);
        }

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
        refreshLock = new OperationLock();
        validationLock = new OperationLock();
    }

    // Access token that allows API calls to Spotify API.
    get AccessToken() { return accessToken; }

    // If we are currently refreshing, we will not trigger another refresh
    get IsCurrentlyRefreshing() { return refreshLock; }

    // If we are checking the validity of our current token, we'll lock this value to prevent multiple validation calls
    get IsCurrentlyValidating() { return validationLoc.isLockedk; }

    // Lock to prevent multiple refreshes at the same time
    get IsCurrentlyRefreshing() { return refreshLock.isLocked; }

    // Waits for the refresh lock to be released. Returns a promise
    WaitForRefreshComplete()
    {
        return WaitForOperationCompletness(refreshLock);
    }

    // Waits for the validation lock to be released. Returns a promise
    WaitForValidationToComplete()
    {
        return WaitForOperationCompletness(validationLock);
    }

    RequestNewAccessToken()
    {
        return new Promise((resolve, reject) =>
        {
            refreshLock.isLocked = true;
            request.post(GenerateRequestBody(), HandleRemoteServiceResponse(resolve, reject));
        });
    }

    VerifyAccessTokenIsStillValid()
    {
        if (this.IsStringNullOrWhiteSpace(accessToken))
        {
            return this.RequestNewAccessToken();
        }
    }
}

module.exports = Object.freeze(new SpotifySession());