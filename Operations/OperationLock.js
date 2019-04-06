"use strict";

class OperationLock
{
    constructor(isLocked = false)
    {
        this.isLocked = isLocked;
    }
}

module.exports = OperationLock;