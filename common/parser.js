const Reader = require("../common/reader.js");

module.exports = class Parser {
  static parse(day, useExample, shape, parseFunc) {
    const path = `./${day}/data${useExample ? "_example" : ""}.txt`;
    const raw = Reader._getRawData(path);

    // Assuming lines
    const lines = raw.split("\n");
    const result = []; // Result is an array of transformed objects
    lines.forEach((line) => {
      if (shape) {
        result.push(this._parseUsingShape(shape, line));
      } else if (parseFunc) {
        result.push(this._parseUsingFunc(parseFunc, line));
      } else {
        console.log(`Could not parse line ${line}`);
      }
    });
    return result;
  }

  static _parserFuncs() {
    return {
      STR: (value) => value,
      INT: (value) => parseInt(value),
      FLO: (value) => parseFloat(value),
    };
  }

  static _matchesShape(lineParts, shape) {
    console.log(lineParts.length, shape.props.length);
    if (lineParts.length !== shape.props.length) return false;

    const isInt = function (n) {
      console.log(n, parseInt(n) === n);
      return parseInt(n) == n;
    };

    const isFloat = function (n) {
      console.log(n, parseFloat(n) === n);
      return parseFloat(n) == n;
    };

    for (let i = 0; i < lineParts.length; i++) {
      const part = lineParts[i];
      const shapePartType = shape.props[i].type;
      console.log(shapePartType, part);
      if (shapePartType === "INT" && isInt(part)) continue;
      if (shapePartType === "FLO" && isFloat(part)) continue;
      if (shapePartType === "STR") continue;

      return false;
    }

    return true;
  }

  static _parseUsingShape(shape, line) {
    const delimiter = shape.delimiter;
    const lineParts = line.split(delimiter); // All are strings
    const resultObj = {};

    if (!this._matchesShape(lineParts, shape)) {
      console.log(`Shape / line mismatch for line ${line} using shape`, shape);
    }

    lineParts.forEach((part, i) => {
      const func = this._parserFuncs()[shape.props[i].type];

      if (func) {
        const parsedValue = func(part);
        const propAlias = shape.props[i].name;
        resultObj[propAlias] = parsedValue;
      }
    });

    return resultObj;
  }

  static _parseUsingFunc(func, line) {
    return func(line);
  }
};
