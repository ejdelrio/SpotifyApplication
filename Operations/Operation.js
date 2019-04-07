"use strict";

const CommonwWorkItems = require("../Util/CommonWorkItems");

class Operation
{
    IsStringNullOrWhiteSpace(str) { return CommonwWorkItems.IsStringNullOrWhiteSpace(str); }

    ValidateType(parameter, expectedType) { return CommonwWorkItems.ValidateType(parameter, expectedType); }

    ValidateIsNotNull(parameter, parameterName = "") { return CommonwWorkItems.ValidateIsNotNull(parameter, parameterName); }

    Invoke(request, response, next)
    {
        throw new Error("Base implementation of Invoke cannot be used. Please overwrite it.");
    }
}

module.exports = Operation;