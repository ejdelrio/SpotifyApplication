"use strict";

const request = require("request");
const Operation = require("./Operation");
const SessionManager = require("../ThirdPartySessionManagement/SessionManager");
const operationEndpoint = "/api/playlist/:playlistId";
const spotifyApiEndpoint = "https://api.spotify.com/v1/playlists/";

// ================================================
// Private methods

function ValidateRequestParameters(request, operationInstance)
{
    operationInstance.ValidateIsNotNull(request);

    if (operationInstance.IsStringNullOrWhiteSpace(request.params.playlistId))
    {
        throw new ReferenceError("No playlist ID provided.");
    }
}

function GenerateRequestBody(token, endpoint)
{
    var requestBody;

    requestBody = new Object();
    requestBody.json = true;
    requestBody.url = endpoint;

    return requestBody;
}

function ExternalResponseHandler(resolve, reject)
{
    return function (error, response, body)
    {
        if (error)
        {
            return reject(error);
        }

        if (response.statusCode === 200)
        {
            return resolve(body);
        }

        return reject(new Error("The external server returned an unexpected response."));
    };
}

function SendExternalRequest(req, response, next, token, operationInstance)
{
    var playlistId = request.params.playlistId;
    var apiQueryString = `${spotifyApiEndpoint}${playlistId}}`;

    return new Promise((resolve, reject) =>
    {
        return request.get(
            GenerateRequestBody(token, apiQueryString),
            ExternalResponseHandler(resolve, reject));
    });
}

function HandleResponseToCaller(request, response, next, data)
{

}

function HandleException(request, response, next, exception, operationInstance)
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
        try
        {
            ValidateRequestParameters(request, this);
        }
        catch (exception)
        {
            response.statusCode = 400;
            response.send("An exception occured : ", exception);
            response.error = exception;
            response.end();
            next(response);
        }

        SessionManager.SpotifySession.PrevalidateApiCall()
            .then(token => SendExternalRequest(request, response, token, this))
            .then(data => HandleResponseToCaller(request, response, next, data))
            .catch(exception => HandleException(request, response, next, exception, this));
    }
}

module.exports = GetSpotifyPlaylistOperation();