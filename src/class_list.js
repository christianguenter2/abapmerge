"use strict";
exports.__esModule = true;
var io = require("io");
var ClassList = /** @class */ (function () {
    function ClassList() {
        this.exceptions = "";
        this.deferred = "";
        this.definitions = "";
        this.implementations = "";
    }
    ClassList.prototype.push = function (f) {
        console.log(io.EOL);
        var match = f.getContents().match(/^((.|\n)*ENDCLASS\.)\s*(CLASS(.|\n)*)$/i);
        if (!match || !match[1] || !match[2] || !match[3]) {
            throw "error parsing class: " + f.getFilename();
        }
        var name = f.getFilename().split(".")[0];
        var def = this.removePublic(name, match[1]);
        if (name.match(/^.?CX_/i)) {
            // the DEFINITION DEFERRED does not work very well for exception classes
            this.exceptions = this.exceptions + def + "\n" + match[3] + "\n";
        }
        else {
            this.deferred = this.deferred + "CLASS " + name + " DEFINITION DEFERRED.\n";
            this.definitions = this.definitions + def + "\n";
            this.implementations = this.implementations + match[3] + "\n";
        }
    };
    ClassList.prototype.getResult = function () {
        return this.exceptions +
            this.deferred +
            this.definitions +
            this.implementations;
    };
    ClassList.prototype.getDeferred = function () {
        return this.deferred;
    };
    ClassList.prototype.getDefinitions = function () {
        return this.definitions;
    };
    ClassList.prototype.getExceptions = function () {
        return this.exceptions;
    };
    ClassList.prototype.getImplementations = function () {
        return this.implementations;
    };
    ClassList.prototype.removePublic = function (name, s) {
        var reg = new RegExp("CLASS\\s+" + name + "\\s+DEFINITION\\s+PUBLIC", "i");
        return s.replace(reg, "CLASS " + name + " DEFINITION");
    };
    return ClassList;
}());
exports["default"] = ClassList;
