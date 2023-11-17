const Reader = require("../common/reader.js");
const getDay = require("../common/dayFolderParser.js");

module.exports = class Parser {
  static parse(dir, useExample, shapes) {
    const result = [];
    Reader._getRawData(Parser._getPath(dir, useExample))
      .split("\n")
      .forEach((line) => {
        const shape = this._findMatchingShape(line, shapes);
        if (shape) {
          result.push(this._parseUsingShape(shape, line));
        } else {
          console.log(`Could not find shape that matches line ${line}`);
        }
      });
    return result;
  }

  static _getPath(dir, useExample) {
    return `./${getDay(dir)}/data${useExample ? "_example" : ""}.txt`;
  }

  static readRaw(dir, useExample) {
    return Reader._getRawData(Parser._getPath(dir, useExample));
  }

  static _parserFuncs() {
    return {
      STR: (value) => value,
      INT: (value) => parseInt(value),
      FLO: (value) => parseFloat(value),
    };
  }

  static _findMatchingShape(line, shapes) {
    for (let i = 0; i < shapes.length; i++) {
      const shape = shapes[i];
      if (this._matchesShape(line.split(shape.delimiter), shape)) {
        return shape;
      }
    }
    return null;
  }

  static _matchesShape(lineParts, shape) {
    if (lineParts.length !== shape.props.length) {
      return false;
    }

    const isInt = function (n) {
      return parseInt(n) == n;
    };

    const isFloat = function (n) {
      return parseFloat(n) == n;
    };

    for (let i = 0; i < lineParts.length; i++) {
      const part = lineParts[i];
      const shapePartType = shape.props[i].type;
      if (shapePartType === "INT" && isInt(part)) continue;
      if (shapePartType === "FLO" && isFloat(part)) continue;
      if (shapePartType === "STR") continue;

      return false;
    }

    return true;
  }

  static _parseUsingShape(shape, line) {
    const lineParts = line.split(shape.delimiter);
    const resultObj = {};

    if (!this._matchesShape(lineParts, shape)) {
      console.log(`Shape-line mismatch for line ${line} using shape`, shape, "Could not parse");
      return;
    }

    lineParts.forEach((part, i) => {
      const func = this._parserFuncs()[shape.props[i].type];

      if (func) {
        resultObj[shape.props[i].name] = func(part);
      }
    });

    return resultObj;
  }

  static _parseUsingFunc(func, line) {
    return func(line);
  }
};
