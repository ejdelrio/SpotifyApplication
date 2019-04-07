"use strict";

const CommonWorkItems = require("../Util/CommonWorkItems");

class Operation
{
    IsStringNullOrWhiteSpace(str) { return CommonWorkItems.IsStringNullOrWhiteSpace(str); }

    ValidateType(parameter, expectedType) { return CommonWorkItems.ValidateType(parameter, expectedType); }

    ValidateIsNotNull(parameter, parameterName = "") { return CommonWorkItems.ValidateIsNotNull(parameter, parameterName); }

    Invoke(request, response, next)
    {
        throw new Error("Base implementation of Invoke cannot be used. Please overwrite it.");
    }
}

module.exports = Operation;