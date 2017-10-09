"use strict";
exports.__esModule = true;
var File = /** @class */ (function () {
    // object names are unique across packages in ABAP, so
    // the folder name is not part of this class
    function File(filename, c) {
        this.filename = filename;
        this.contents = c;
        this.isUsed = false;
    }
    File.prototype.getName = function () {
        return this.filename.split(".")[0];
    };
    File.prototype.getFilename = function () {
        return this.filename;
    };
    File.prototype.getContents = function () {
        return this.contents;
    };
    File.prototype.wasUsed = function () {
        return this.isUsed;
    };
    File.prototype.markUsed = function () {
        this.isUsed = true;
    };
    File.prototype.isABAP = function () {
        return this.filename.match(/.abap$/) !== null;
    };
    return File;
}());
exports["default"] = File;
