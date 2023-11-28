const Parser = require("../common/parser.js");
const regex = require("../common/regexUtils.js");
module.exports = class Day {
  static run() {
    const data = Parser.parse(__dirname, true, [
      {
        type: "array",
        valueType: "int",
        delimiter: " ",
      },
    ]);
    console.log(data);
  }
};
