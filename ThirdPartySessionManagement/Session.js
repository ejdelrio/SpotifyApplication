"use strict";

const CommonWorkItems = require("../Util/CommonWorkItems");

class Session
{
    constructor(sessionName)
    {
        this.sessionName = sessionName;
    }

    IsStringNullOrWhiteSpace(str) { return CommonwWorkItems.IsStringNullOrWhiteSpace(str); }

    ValidateType(parameter, expectedType) { return CommonwWorkItems.ValidateType(parameter, expectedType); }

    ValidateIsNotNull(parameter, parameterName = "") { return CommonwWorkItems.ValidateIsNotNull(parameter, parameterName); }
}

module.exports = Session;