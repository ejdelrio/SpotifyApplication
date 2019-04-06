"use strict";

class CommonWorkItems
{
    static ValidateIsNotNull(parameter, parameterName="")
    {
        if (parameter === null || parameter === undefined)
        {
            throw new ReferenceError(`The parameter ${parameterName} cannot be null or undefined.`);
        }
    }

    static IsStringNullOrWhiteSpace(str)
    {
        if (str === null || str === undefined)
        {
            return true;
        }

        CommonWorkItems.ValidateType(str, String);

        for (let i = 0; i < str.length; i++)
        {
            if (str[i] !== " ")
            {
                return false;
            }
        }

        return true;
    }


    static ValidateType(paramter, expectedType)
    {
        var exception;

        if (paramter === null || paramter === undefined)
        {
            return;
        }

        if (typeof expectedType !== "function")
        {
            throw new TypeError("expectedType must be a class or object constructor.");
        }

        exception = new TypeError(`Expected ${expectedType.constructor.name}`);

        if (expectedType === Array && !Array.isArray(paramter))
        {
            throw exception;
        }

        if (expectedType === String &&
            !(typeof paramter !== "string" ||
            paramter instanceof String))
        {
            throw exception;
        }

        if (paramter instanceof expectedType !== true)
        {
            throw exception;
        }
    }
}

module.exports = CommonWorkItems;