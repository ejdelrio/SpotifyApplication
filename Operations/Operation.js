"use strict";

const CommonwWorkItems = require("../Util/CommonWorkItems");

class Operation
{
    IsStringNullOrWhiteSpace(str) { return CommonwWorkItems.IsStringNullOrWhiteSpace(str); }

    ValidateType(parameter, expectedType) { return CommonwWorkItems.ValidateType(parameter, expectedType); }

    ValidateIsNotNull(parameter, parameterName = "") { return CommonwWorkItems.ValidateIsNotNull(parameter, parameterName); }
}

module.exports = Operation;