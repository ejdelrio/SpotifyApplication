"use strict";

const CommonWorkItems = require("../Util/CommonWorkItems");

class Session
{
    constructor(sessionName)
    {
        this.sessionName = sessionName;
    }

    IsStringNullOrWhiteSpace(str) { return CommonWorkItems.IsStringNullOrWhiteSpace(str); }

    ValidateType(parameter, expectedType) { return CommonWorkItems.ValidateType(parameter, expectedType); }

    ValidateIsNotNull(parameter, parameterName = "") { return CommonWorkItems.ValidateIsNotNull(parameter, parameterName); }
}

module.exports = Session;