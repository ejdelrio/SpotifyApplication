"use strict";

require("dotenv").config();
const CommonWorkItems = require("./CommonWorkItems");

class ConfigurationManager
{
    static get port() { return process.env.SERVER_PORT; }

    static TryGetValueWithNoThrow(value)
    {
        if (CommonWorkItems.IsStringNullOrWhiteSpace(value))
        {
            return null;
        }

        return process.env[value];
    }

    static GetValueWithThrow(value)
    {
        CommonWorkItems.ValidateType(value, String);

        if (!CommonWorkItems.IsStringNullOrWhiteSpace(value) &&
            !CommonWorkItems.IsStringNullOrWhiteSpace(process.env[value]))
        {
            return process.env.value;
        }

        throw new Error("Invalid configuration setting");
    }
}

module.exports = ConfigurationManager;