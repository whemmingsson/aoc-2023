const Parser = require("../common/parser.js");
const regex = require("../common/regexUtils.js");
module.exports = class Day {
  static run() {
    const data = Parser.parse(__dirname, true, [
      {
        regex: `${regex.I}\\t${regex.I}\\t${regex.I}\\t${regex.I}\\t${regex.I}\\t${regex.I}\\t${regex.I}\\t${regex.I}\\t${regex.I}\\t${regex.I}\\t${regex.I}\\t${regex.I}\\t${regex.I}\\t${regex.I}\\t${regex.I}\\t${regex.I}`,
        props: ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p"],
      },
    ]);
    console.log(data);
  }
};
