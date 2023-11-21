const Reader = require("../common/reader.js");
const getDay = require("../common/dayFolderParser.js");

module.exports = class Parser {
  static parse(dir, useExample, shapes) {
    const result = [];
    Reader._getRawData(Parser._getPath(dir, useExample))
      .split("\n")
      .forEach((line) => {
        const regexParsed = this._parseUsingRegex(shapes, line);
        if (regexParsed) result.push(regexParsed);
        else {
          console.log("Could not parse line", line);
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

  static _parseUsingRegex(shapes, line) {
    const parse = (value) => {
      const maybeFloat = parseFloat(value);
      if (maybeFloat) return maybeFloat;
      const maybeInt = parseInt(value);
      if (maybeInt) return maybeInt;
      return value;
    };

    for (let i = 0; i < shapes.length; i++) {
      const result = new RegExp(shapes[i].regex).exec(line);
      if (result && result.length === shapes[i].props.length + 1) {
        const values = result.splice(1); // Splice off the whole string result
        const obj = {};
        for (let j = 0; j < values.length; j++) {
          obj[shapes[i].props[j]] = parse(values[j]);
        }
        return obj;
      }
    }
  }

  static _parseUsingFunc(func, line) {
    return func(line);
  }
};
