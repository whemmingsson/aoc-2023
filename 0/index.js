const Parser = require("../common/parser.js");
module.exports = class Day {
  static run(day) {
    const data = Parser.parse(day, false, {
      delimiter: ",",
      props: [
        { name: "elfName", type: "STR" },
        { name: "elfWeight", type: "INT" },
        { name: "elfAge", type: "FLO" },
      ],
    });
    console.log(data);
  }
};
