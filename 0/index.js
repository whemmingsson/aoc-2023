const Parser = require("../common/parser.js");
module.exports = class Day {
  static run() {
    const data = Parser.parse(__dirname, false, [
      {
        delimiter: ",",
        props: [
          { name: "elfName", type: "STR" },
          { name: "elfWeight", type: "INT" },
          { name: "elfAge", type: "FLO" },
        ],
      },
      {
        delimiter: "|",
        props: [
          { name: "flo", type: "FLO" },
          { name: "int", type: "INT" },
        ],
      },
    ]);
    console.log(data);
  }
};
