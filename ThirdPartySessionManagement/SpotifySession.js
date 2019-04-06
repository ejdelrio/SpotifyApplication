"use strict";

const request = require("request");
const Session = require("./Session");
const ConfigurationManager = require("../Util/ConfigurationManager");
const refreshTokenConfigurationName = "SPOTIFY_REFRESH_TOKEN";
const clientIdConfigurationName = "SPOTIFY_CLIENT_ID";
const secretConfigurationName = "SPOTIFY_SECRET";

// Private variables;
var accessToken;
var refreshToken;
var clientId;
var lastRefresh;
var lastValidityCheck;
var refreshLock;
var validationLock;

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

            if (!lockValue)
            {
                clearInterval(intervalId);
                resolve();
            }

            currentRetryCount++;
        },
        2000); // Wait 2 seconds before checking again
    });
}

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
        accessToken = ConfigurationManager.TryGetValueWithNoThrow(secretConfigurationName);
        refreshLock = false;
        validationLock = false;
    }

    // Access token that allows API calls to Spotify API.
    get AccessToken() { return accessToken; }

    // If we are currently refreshing, we will not trigger another refresh
    get IsCurrentlyRefreshing() { return refreshLock; }

    // If we are checking the validity of our current token, we'll lock this value to prevent multiple validation calls
    get IsCurrentlyValidating() { return validationLock; }

    // Lock to prevent multiple refreshes at the same time
    get IsCurrentlyRefreshing() { return refreshLock ? true : false; }

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

    }

    VerifyAccessTokenIsStillValid()
    {

    }
}

module.exports = Object.freeze(new SpotifySession());