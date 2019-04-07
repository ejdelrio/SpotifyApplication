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
    operationInstance.ValidateIsNotNull(request, "request");

    if (operationInstance.IsStringNullOrWhiteSpace(request.params.playlistId))
    {
        throw new ReferenceError("No playlist ID provided.");
    }
}

function GenerateRequestBody(token, endpoint)
{
    return {
        url: endpoint,
        headers: { Authorization: `Bearer ${token}` },
        json : true
    };
}

function ExternalResponseHandler(resolve, reject)
{
    return function (error, response, body)
    {
        if (error)
        {
            return reject(error);
        }

        if (body.error)
        {
            reject(body.error);
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
    var playlistId = req.params.playlistId;
    var apiQueryString = `${spotifyApiEndpoint}${playlistId}`;

    return new Promise((resolve, reject) =>
    {
        return request.get(
            GenerateRequestBody(token, apiQueryString),
            ExternalResponseHandler(resolve, reject));
    });
}

function HandleResponseToCaller(request, response, next, data)
{
    response.send(data);
    response.statusCode = 200;
    response.end();
    next();
}

function HandleException(request, response, next, exception, operationInstance)
{
    response.statusCode = 400;
    response.send(exception.message);
    response.error = exception;
    response.end();
    next();
}

// End private methods
// ===============================================

/*
 * Description :
 *  Recieves a playlist ID as a parameter in the endpoint url string. Uses the ID to make a call 
 *  to Spotify's api. This API provides a token for authentication with spotify API. That token is validated before this call
 */
class GetSpotifyPlaylistOperation extends Operation
{
    constructor()
    {
        super();
        this.Invoke = this.Invoke.bind(this);
    }

    static get Endpoint() { return new String(operationEndpoint); }

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
            .then(token => SendExternalRequest(request, response, next, token, this))
            .then(data => HandleResponseToCaller(request, response, next, data))
            .catch(exception => HandleException(request, response, next, exception, this));
    }
}

module.exports = GetSpotifyPlaylistOperation;